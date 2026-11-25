// Pato Sacco MIS — demo data store (browser localStorage only, no backend)
// Amounts are stored as integer cents (KES x 100) per NFR06.
// Types live in types/; this file is the data layer ported from the reference
// single-page implementation, with the same seed data and business rules.
import type { Role } from "@/types/user";
import type { Member } from "@/types/member";
import type { Loan, LoanProduct, LoanStatus } from "@/types/loan";
import type { AuditEntry, SmsLog, Txn } from "@/types/transaction";
import type { Settings } from "@/types/policy";
import type { User } from "@/types/user";
import type { Withdrawal, WithdrawalStatus } from "@/types/withdrawal";

export type { Role, LoanStatus, WithdrawalStatus, User, Member, LoanProduct, Loan, Txn, Withdrawal, SmsLog, AuditEntry, Settings };

export interface DB {
  users: User[]; members: Member[]; products: LoanProduct[]; loans: Loan[];
  txns: Txn[]; withdrawals: Withdrawal[]; sms: SmsLog[]; audit: AuditEntry[];
  settings: Settings; ussdSessions: string[];
}

const KEY = "pato-mis-db-v1";
const SESSION_KEY = "pato-mis-session-v1";
export const SESSION_HOURS = 8;

export const toCents = (kes: number) => Math.round(kes * 100);
export const fromCents = (c: number) => c / 100;
export const fmtKES = (c: number) => "KES " + (c / 100).toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const fmtDate = (iso: string) => new Date(iso).toLocaleString("en-KE", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
export const today = () => new Date().toISOString();
export const uid = (p: string) => p + "-" + Math.random().toString(36).slice(2, 8).toUpperCase();

export function monthlyPayment(amountCents: number, ratePa: number, months: number): number {
  const r = ratePa / 100 / 12;
  if (r === 0) return Math.round(amountCents / months);
  const p = amountCents / Math.pow(1 + r, months);
  // standard amortisation: P * r(1+r)^n / ((1+r)^n - 1)
  const pay = amountCents * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
  return Math.round(pay);
}
export interface ScheduleRow { month: number; paymentCents: number; principalCents: number; interestCents: number; balanceCents: number; }
export function repaymentSchedule(amountCents: number, ratePa: number, months: number): ScheduleRow[] {
  const r = ratePa / 100 / 12;
  const pay = monthlyPayment(amountCents, ratePa, months);
  let bal = amountCents; const rows: ScheduleRow[] = [];
  for (let m = 1; m <= months; m++) {
    const interest = Math.round(bal * r);
    const principal = m === months ? bal : pay - interest;
    const payment = principal + interest;
    bal = Math.max(0, bal - principal);
    rows.push({ month: m, paymentCents: payment, principalCents: principal, interestCents: interest, balanceCents: bal });
  }
  return rows;
}
export function outstandingLoans(db: DB, memberId: string): number {
  return db.loans.filter(l => l.memberId === memberId && (l.status === "Disbursed" || l.status === "Approved"))
    .reduce((s, l) => s + (l.amountCents - l.repaidCents), 0);
}
export function eligibility(db: DB, memberId: string, product: LoanProduct): { eligibleCents: number; reason: string } {
  const m = db.members.find(x => x.id === memberId);
  if (!m) return { eligibleCents: 0, reason: "Member not found." };
  if (m.inArrears) return { eligibleCents: 0, reason: "Not eligible: member is in arrears. No new loan while in arrears." };
  const limit = Math.min(m.depositsCents * db.settings.depositMultiplier - outstandingLoans(db, memberId), product.ceilingCents);
  if (limit <= 0) return { eligibleCents: 0, reason: "Not eligible: deposits x 3 minus outstanding loans is KES 0 or less." };
  return { eligibleCents: limit, reason: `Eligible up to ${fmtKES(limit)} (deposits ${fmtKES(m.depositsCents)} x ${db.settings.depositMultiplier} minus outstanding loans ${fmtKES(outstandingLoans(db, memberId))}, capped at product ceiling ${fmtKES(product.ceilingCents)}).` };
}

function seed(): DB {
  const now = today();
  const dev: LoanProduct = { id: "P-DEV", name: "Development Loan", ratePa: 12, maxMonths: 24, ceilingCents: toCents(500000) };
  const emg: LoanProduct = { id: "P-EMG", name: "Emergency Loan", ratePa: 10, maxMonths: 12, ceilingCents: toCents(100000) };
  const loans: Loan[] = [
    { id: "L-1001", memberId: "ER-0001", productId: "P-DEV", amountCents: toCents(60000), termMonths: 24, ratePa: 12, monthlyCents: monthlyPayment(toCents(60000), 12, 24), totalInterestCents: monthlyPayment(toCents(60000), 12, 24) * 24 - toCents(60000), repaidCents: toCents(12000), status: "Disbursed", purpose: "Business stock", appliedAt: "2026-09-02T09:00:00.000Z", decidedBy: "officer", disbursedAt: "2026-09-05T09:00:00.000Z" },
    { id: "L-1002", memberId: "ER-0002", productId: "P-EMG", amountCents: toCents(50000), termMonths: 12, ratePa: 10, monthlyCents: monthlyPayment(toCents(50000), 10, 12), totalInterestCents: monthlyPayment(toCents(50000), 10, 12) * 12 - toCents(50000), repaidCents: 0, status: "Pending", purpose: "Medical bill", appliedAt: "2026-11-14T08:30:00.000Z" },
    { id: "L-1003", memberId: "ER-0003", productId: "P-DEV", amountCents: toCents(150000), termMonths: 18, ratePa: 12, monthlyCents: monthlyPayment(toCents(150000), 12, 18), totalInterestCents: monthlyPayment(toCents(150000), 12, 18) * 18 - toCents(150000), repaidCents: 0, status: "Approved", purpose: "Dairy farming", appliedAt: "2026-11-10T10:00:00.000Z", decidedBy: "officer" },
  ];
  return {
    users: [
      { id: "U-1", username: "ER-0001", password: "member123", name: "Mary Wanjiru", role: "member", memberId: "ER-0001", active: true, createdAt: now },
      { id: "U-2", username: "ER-0002", password: "member123", name: "James Mwangi", role: "member", memberId: "ER-0002", active: true, createdAt: now },
      { id: "U-3", username: "ER-0003", password: "member123", name: "Grace Achieng", role: "member", memberId: "ER-0003", active: true, createdAt: now },
      { id: "U-4", username: "officer", password: "officer123", name: "David Otieno", role: "officer", active: true, createdAt: now },
      { id: "U-5", username: "admin", password: "admin123", name: "Sarah Njeri", role: "sacco_admin", active: true, createdAt: now },
      { id: "U-6", username: "sysadmin", password: "sysadmin123", name: "Peter Kamau", role: "sysadmin", active: true, createdAt: now },
    ],
    members: [
      { id: "ER-0001", name: "Mary Wanjiru", nationalId: "12345678", phone: "0712345678", email: "mary@example.co.ke", depositsCents: toCents(120000), savingsCents: toCents(45000), inArrears: false, idVerified: true, joined: "2024-03-12" },
      { id: "ER-0002", name: "James Mwangi", nationalId: "23456789", phone: "0723456789", email: "james@example.co.ke", depositsCents: toCents(80000), savingsCents: toCents(30000), inArrears: true, idVerified: true, joined: "2024-06-20" },
      { id: "ER-0003", name: "Grace Achieng", nationalId: "34567890", phone: "0734567890", email: "grace@example.co.ke", depositsCents: toCents(200000), savingsCents: toCents(60000), inArrears: false, idVerified: true, joined: "2023-11-05" },
    ],
    products: [dev, emg],
    loans,
    txns: [
      { id: "T-1", memberId: "ER-0001", type: "Contribution", amountCents: toCents(5000), date: "2026-11-01T09:00:00.000Z", note: "Monthly contribution Nov", channel: "Web" },
      { id: "T-2", memberId: "ER-0001", type: "Loan Repayment", amountCents: toCents(6000), date: "2026-11-03T09:00:00.000Z", note: "Repayment L-1001", channel: "Web" },
      { id: "T-3", memberId: "ER-0001", type: "Loan Repayment", amountCents: toCents(6000), date: "2026-10-03T09:00:00.000Z", note: "Repayment L-1001", channel: "Web" },
      { id: "T-4", memberId: "ER-0002", type: "Contribution", amountCents: toCents(3000), date: "2026-11-02T09:00:00.000Z", note: "Monthly contribution Nov", channel: "USSD" },
      { id: "T-5", memberId: "ER-0003", type: "Contribution", amountCents: toCents(10000), date: "2026-11-01T09:00:00.000Z", note: "Monthly contribution Nov", channel: "Web" },
      { id: "T-6", memberId: "ER-0001", type: "Loan Disbursement", amountCents: toCents(60000), date: "2026-09-05T09:00:00.000Z", note: "Disbursed L-1001", channel: "Office" },
    ],
    withdrawals: [
      { id: "W-1001", memberId: "ER-0003", amountCents: toCents(20000), status: "Pending", requestedAt: "2026-11-15T08:00:00.000Z" },
    ],
    sms: [
      { id: "S-1", to: "0712345678", message: "Dear Mary, your November contribution of KES 5,000 was received. Thank you. - Pato Sacco", status: "Delivered", date: "2026-11-01T09:05:00.000Z", kind: "Confirmation" },
      { id: "S-2", to: "0723456789", message: "Dear James, your loan repayment is overdue. Please pay KES 4,500 to avoid penalties. - Pato Sacco", status: "Delivered", date: "2026-11-12T08:00:00.000Z", kind: "Arrears reminder" },
    ],
    audit: [
      { id: "A-1", actor: "officer", action: "Loan approved", detail: "L-1003 Grace Achieng KES 150,000 approved", date: "2026-11-10T10:05:00.000Z" },
      { id: "A-2", actor: "admin", action: "Member registered", detail: "ER-0003 Grace Achieng registered, ID verified", date: "2023-11-05T09:00:00.000Z" },
    ],
    settings: { depositMultiplier: 3, minContributionCents: toCents(1000), withdrawalPct: 50, withdrawalCapCents: toCents(50000), backupSchedule: "Weekly" },
    ussdSessions: ["2026-11-02 *384*123# ER-0002 Balance enquiry - Delivered"],
  };
}

export function loadDB(): DB {
  if (typeof window === "undefined") return seed();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as DB;
  } catch { /* fall through to seed */ }
  const d = seed();
  localStorage.setItem(KEY, JSON.stringify(d));
  return d;
}
export function saveDB(db: DB) { if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(db)); }
export function resetDB(): DB { const d = seed(); saveDB(d); return d; }

export interface Session { username: string; expiresAt: number; }
export function loadSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Session;
    if (Date.now() > s.expiresAt) { localStorage.removeItem(SESSION_KEY); return null; }
    return s;
  } catch { return null; }
}
export function saveSession(username: string) {
  const s: Session = { username, expiresAt: Date.now() + SESSION_HOURS * 60 * 60 * 1000 };
  localStorage.setItem(SESSION_KEY, JSON.stringify(s));
}
export function clearSession() { localStorage.removeItem(SESSION_KEY); }
export function audit(db: DB, actor: string, action: string, detail: string) {
  db.audit.unshift({ id: uid("A"), actor, action, detail, date: today() });
}
export const ROLE_LABEL: Record<Role, string> = { member: "Sacco Member", officer: "Credit Officer", sacco_admin: "Sacco Administrator", sysadmin: "System Administrator" };
