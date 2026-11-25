export type Role = "member" | "officer" | "sacco_admin" | "sysadmin";

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role: Role;
  memberId?: string;
  active: boolean;
  createdAt: string;
}

export interface Session {
  username: string;
  expiresAt: number;
}
