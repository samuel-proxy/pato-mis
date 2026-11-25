import type { DB } from "@/lib/store";
import { audit, clearSession, loadDB, loadSession, saveDB, saveSession } from "@/lib/store";
import { ROLE_HOME, ROLE_LABEL } from "@/lib/constants";
import type { Role, User } from "@/types/user";

export function roleHome(role: Role): string {
  return ROLE_HOME[role];
}

/**
 * Check credentials against the store (FR01). Mirrors the reference login:
 * a wrong password gives "Invalid username or password.", a deactivated
 * account with the right password gives the deactivated message.
 */
export function authenticate(
  db: DB,
  username: string,
  password: string
): { user: User } | { error: string } {
  const u = db.users.find((x) => x.username.trim() === username.trim() && x.password === password);
  if (!u) return { error: "Invalid username or password." };
  if (!u.active) return { error: "This account is deactivated. Contact the System Administrator." };
  return { user: u };
}

/** Sign in: authenticate, save the 8-hour session and audit the login. */
export function loginUser(
  username: string,
  password: string
): { user: User } | { error: string } {
  const db = loadDB();
  const result = authenticate(db, username, password);
  if ("error" in result) return result;
  saveSession(result.user.username);
  audit(db, result.user.username, "Login", `${result.user.name} (${ROLE_LABEL[result.user.role]}) logged in. Session valid 8 hours.`);
  saveDB(db);
  return result;
}

export function logoutUser(): void {
  clearSession();
}

/** The signed-in user from the session, or null when there is no valid session. */
export function getSessionUser(db: DB): User | null {
  const s = loadSession();
  if (!s) return null;
  return db.users.find((x) => x.username === s.username && x.active) ?? null;
}
