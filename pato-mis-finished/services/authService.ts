import { getSessionUser, loginUser, logoutUser } from "@/lib/auth";
import type { DB } from "@/lib/store";
import type { User } from "@/types/user";

/** Sign in with a username and password (FR01). */
export function login(username: string, password: string): { user: User } | { error: string } {
  return loginUser(username, password);
}

export function logout(): void {
  logoutUser();
}

export function sessionUser(db: DB): User | null {
  return getSessionUser(db);
}
