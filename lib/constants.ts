import type { Role } from "@/types/user";

export const APP_NAME = "Pato Sacco";
export const APP_TAGLINE = "Pato Sacco Information Management System";

// USSD short code (simulated — no live Africa's Talking connection).
export const USSD_CODE = "*384*123#";

export const SESSION_HOURS = 8;

export const ROLE_LABEL: Record<Role, string> = {
  member: "Sacco Member",
  officer: "Credit Officer",
  sacco_admin: "Sacco Administrator",
  sysadmin: "System Administrator",
};

export const ROLE_HOME: Record<Role, string> = {
  member: "/sacco-member/dashboard",
  officer: "/credit-officer/dashboard",
  sacco_admin: "/sacco-admin/dashboard",
  sysadmin: "/system-admin/dashboard",
};

export const BACKUP_SCHEDULES = ["Daily", "Weekly", "Monthly"] as const;

/** Demo logins (prototype only — passwords are not hashed). */
export const DEMO_LOGINS: { username: string; password: string; name: string; role: Role }[] = [
  { username: "ER-0001", password: "member123", name: "Mary Wanjiru", role: "member" },
  { username: "officer", password: "officer123", name: "David Otieno", role: "officer" },
  { username: "admin", password: "admin123", name: "Sarah Njeri", role: "sacco_admin" },
  { username: "sysadmin", password: "sysadmin123", name: "Peter Kamau", role: "sysadmin" },
];

export interface NavItem {
  name: string;
  href: string;
}

export const NAV_ITEMS: Record<Role, NavItem[]> = {
  member: [
    { name: "Dashboard", href: "/sacco-member/dashboard" },
    { name: "My Savings", href: "/sacco-member/savings" },
    { name: "Loans", href: "/sacco-member/loans" },
    { name: "Withdrawals", href: "/sacco-member/withdrawals" },
    { name: "Statements", href: "/sacco-member/statements" },
    { name: "My Profile", href: "/sacco-member/profile" },
  ],
  officer: [
    { name: "Dashboard", href: "/credit-officer/dashboard" },
    { name: "Loan Applications", href: "/credit-officer/loan-applications" },
    { name: "Disbursements", href: "/credit-officer/disbursements" },
    { name: "Repayments", href: "/credit-officer/repayments" },
    { name: "Members", href: "/credit-officer/members" },
    { name: "USSD & SMS", href: "/credit-officer/ussd-sms" },
  ],
  sacco_admin: [
    { name: "Dashboard", href: "/sacco-admin/dashboard" },
    { name: "Members", href: "/sacco-admin/members" },
    { name: "Loan Products", href: "/sacco-admin/loan-products" },
    { name: "Policies", href: "/sacco-admin/policies" },
    { name: "Feedback", href: "/sacco-admin/feedback" },
  ],
  sysadmin: [
    { name: "Dashboard", href: "/system-admin/dashboard" },
    { name: "Users", href: "/system-admin/users" },
    { name: "Roles", href: "/system-admin/roles" },
    { name: "Audit Logs", href: "/system-admin/audit-logs" },
    { name: "Reports", href: "/system-admin/reports" },
    { name: "Backups", href: "/system-admin/backups" },
    { name: "Loan Products", href: "/system-admin/loan-products" },
    { name: "USSD & SMS", href: "/system-admin/ussd-sms" },
  ],
};
