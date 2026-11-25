import { loadDB, saveDB } from "@/lib/store";
import type { DB } from "@/lib/store";
import * as authService from "@/services/authService";
import * as loanService from "@/services/loanService";
import * as memberService from "@/services/memberService";
import * as savingsService from "@/services/savingsService";
import * as withdrawalService from "@/services/withdrawalService";
import * as transactionService from "@/services/transactionService";
import * as userService from "@/services/userService";
import * as policyService from "@/services/policyService";
import * as notificationService from "@/services/notificationService";
import type { LoanApplicationInput } from "@/types/loan";
import type { MemberRegistrationInput } from "@/types/member";
import type { UserInput } from "@/services/userService";
import type { ReminderKind } from "@/services/notificationService";

/**
 * Client-side API facade over the browser store. Every method loads the
 * database from localStorage, runs the matching service function, saves the
 * result and returns it — the same shape a backend API would have, without a
 * server. Pages that need reactive updates should use the hooks instead.
 */
function withDb<T>(fn: (db: DB) => T): T {
  const db = loadDB();
  const result = fn(db);
  saveDB(db);
  return result;
}

export const api = {
  auth: {
    login: (username: string, password: string) => authService.login(username, password),
    logout: () => authService.logout(),
  },
  members: {
    list: () => loadDB().members,
    get: (id: string) => memberService.getMember(loadDB(), id),
    search: (q: string) => memberService.searchMembers(loadDB(), q),
    register: (input: MemberRegistrationInput, actor: string) =>
      withDb((db) => memberService.registerMember(db, input, actor)),
  },
  loans: {
    list: () => loadDB().loans,
    forMember: (memberId: string) => loadDB().loans.filter((l) => l.memberId === memberId),
    apply: (memberId: string, input: LoanApplicationInput) =>
      withDb((db) => loanService.applyLoan(db, memberId, input)),
    decide: (loanId: string, approve: boolean, actor: string, note?: string) =>
      withDb((db) => loanService.decideLoan(db, loanId, approve, actor, note)),
    disburse: (loanId: string, actor: string) => withDb((db) => loanService.disburseLoan(db, loanId, actor)),
    repay: (loanId: string, amountCents: number, actor: string) =>
      withDb((db) => loanService.repayMemberLoan(db, loanId, amountCents, actor, "Web")),
    recordRepayment: (loanId: string, amountCents: number, actor: string) =>
      withDb((db) => loanService.recordOfficeRepayment(db, loanId, amountCents, actor)),
  },
  savings: {
    contribute: (memberId: string, amountCents: number, actor: string) =>
      withDb((db) => savingsService.contribute(db, memberId, amountCents, actor, "Web")),
    balances: (memberId: string) => savingsService.balances(loadDB(), memberId),
    withdrawalLimit: (memberId: string) => savingsService.withdrawalLimit(loadDB(), memberId),
  },
  withdrawals: {
    list: () => loadDB().withdrawals,
    request: (memberId: string, amountCents: number, actor: string) =>
      withDb((db) => withdrawalService.requestWithdrawal(db, memberId, amountCents, actor)),
    process: (id: string, approve: boolean, actor: string) =>
      withDb((db) => withdrawalService.processWithdrawal(db, id, approve, actor)),
  },
  transactions: {
    forMember: (memberId: string, limit = 20) =>
      transactionService.listForMember(loadDB(), memberId, limit),
    all: (limit = 50) => transactionService.listAll(loadDB(), limit),
  },
  users: {
    list: () => loadDB().users,
    get: (id: string) => userService.getUser(loadDB(), id),
    create: (input: UserInput, actor: string) => withDb((db) => userService.createUser(db, input, actor)),
    updateRole: (id: string, role: Parameters<typeof userService.updateRole>[2], actor: string) =>
      withDb((db) => userService.updateRole(db, id, role, actor)),
    toggleActive: (id: string, actor: string) => withDb((db) => userService.toggleActive(db, id, actor)),
  },
  policy: {
    products: () => loadDB().products,
    settings: () => loadDB().settings,
    updateProducts: (products: Parameters<typeof policyService.updateProducts>[1], actor: string) =>
      withDb((db) => policyService.updateProducts(db, products, actor)),
    updateSettings: (patch: Parameters<typeof policyService.updateSettings>[1], actor: string) =>
      withDb((db) => policyService.updateSettings(db, patch, actor)),
  },
  notifications: {
    sendSms: (kind: ReminderKind, actor: string) =>
      withDb((db) => notificationService.sendSms(db, kind, actor)),
    smsLog: () => loadDB().sms,
  },
  audit: {
    list: (limit = 50) => loadDB().audit.slice(0, limit),
  },
};
