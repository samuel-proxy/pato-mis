import type { DB } from "@/lib/store";
import { audit, uid } from "@/lib/store";
import { ROLE_LABEL } from "@/lib/constants";
import type { Role, User } from "@/types/user";

export interface UserInput {
  username: string;
  password: string;
  name: string;
  role: Role;
}

/** Create a user account (FR21). Throws when details are missing or the username exists. */
export function createUser(db: DB, input: UserInput, actor: string): string {
  if (!input.username.trim() || !input.password)
    throw new Error("Username and password are required.");
  if (db.users.some((u) => u.username === input.username.trim()))
    throw new Error("Username already exists.");
  db.users.push({
    id: uid("U"),
    username: input.username.trim(),
    password: input.password,
    name: input.name.trim() || input.username.trim(),
    role: input.role,
    active: true,
    createdAt: new Date().toISOString(),
  });
  audit(db, actor, "User created", `${input.username.trim()} created as ${ROLE_LABEL[input.role]}.`);
  return `User ${input.username.trim()} created.`;
}

/** Update a user's role (FR22). */
export function updateRole(db: DB, userId: string, role: Role, actor: string): string {
  const u = db.users.find((x) => x.id === userId);
  if (!u) throw new Error("User not found.");
  u.role = role;
  audit(db, actor, "Role assigned", `${u.username} role changed to ${role}.`);
  return `Role updated for ${u.username}.`;
}

/** Deactivate or reactivate a user account (FR23). */
export function toggleActive(db: DB, userId: string, actor: string): string {
  const u = db.users.find((x) => x.id === userId);
  if (!u) throw new Error("User not found.");
  u.active = !u.active;
  audit(db, actor, u.active ? "User reactivated" : "User deactivated", `${u.username} ${u.active ? "reactivated" : "deactivated"}.`);
  return `${u.username} ${u.active ? "deactivated" : "reactivated"}.`;
}

export function getUser(db: DB, userId: string): User | undefined {
  return db.users.find((u) => u.id === userId);
}
