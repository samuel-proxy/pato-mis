import type { Role } from "@/types/user";

/** Actions in the system, restricted by role (FR22 and the design rules). */
export type Action =
  | "loans.apply" // member applies for a loan (FR03)
  | "loans.decide" // approve / reject loans — Credit Officer only (FR09, FR10)
  | "loans.disburse" // disburse loans — Credit Officer only (FR12)
  | "loans.recordRepayment" // record a repayment at the office (FR13)
  | "withdrawals.process" // approve / reject withdrawals — Credit Officer only (FR14)
  | "members.viewAll" // open any member file (FR08)
  | "members.register" // register members — Sacco Administrator only (FR15)
  | "products.manage" // loan product settings — Sacco Administrator only (FR19)
  | "policy.manage" // contribution policy — Sacco Administrator only (FR20)
  | "users.create" // create user accounts — System Administrator only (FR21)
  | "users.manageRoles" // assign roles — System Administrator only (FR22)
  | "users.deactivate" // deactivate accounts — System Administrator only (FR23)
  | "reports.view" // system reports (FR24)
  | "audit.view" // audit log — System Administrator only (FR25)
  | "backup.run" // scheduled backup — System Administrator only (FR26)
  | "sms.send" // send SMS reminders (FR30, FR31)
  | "ussd.view"; // USSD simulator and SMS log (FR27)

const ROLE_ACTIONS: Record<Role, Action[]> = {
  member: ["loans.apply", "ussd.view"],
  officer: [
    "loans.decide",
    "loans.disburse",
    "loans.recordRepayment",
    "withdrawals.process",
    "members.viewAll",
    "reports.view",
    "sms.send",
    "ussd.view",
  ],
  sacco_admin: ["members.viewAll", "members.register", "products.manage", "policy.manage", "reports.view"],
  sysadmin: [
    "users.create",
    "users.manageRoles",
    "users.deactivate",
    "reports.view",
    "audit.view",
    "backup.run",
    "sms.send",
    "ussd.view",
    "products.manage",
  ],
};

export function can(role: Role, action: Action): boolean {
  return ROLE_ACTIONS[role].includes(action);
}

export interface RolePermission {
  role: Role;
  label: string;
  description: string;
  actions: string[];
}

export const ROLE_PERMISSIONS: RolePermission[] = [
  {
    role: "member",
    label: "Sacco Member",
    description: "Views only their own balances, loans and statements; applies for loans, repays, contributes and requests withdrawals.",
    actions: ["Apply for a loan", "Repay a loan", "Contribute savings", "Request a withdrawal", "View own statement", "Use USSD"],
  },
  {
    role: "officer",
    label: "Credit Officer",
    description: "Processes loans and withdrawals; cannot create user accounts or assign roles.",
    actions: ["Approve / reject loans", "Disburse loans", "Record repayments", "Process withdrawals", "View member records", "Send SMS reminders"],
  },
  {
    role: "sacco_admin",
    label: "Sacco Administrator",
    description: "Registers members and sets products and policy; cannot approve or reject loans.",
    actions: ["Register members", "Verify identity documents", "Set loan products", "Set contribution policy", "View reports"],
  },
  {
    role: "sysadmin",
    label: "System Administrator",
    description: "Manages users, roles, audit log, reports and backups.",
    actions: ["Create user accounts", "Assign roles", "Deactivate accounts", "View audit log", "Run backups", "View reports", "Send SMS reminders"],
  },
];
