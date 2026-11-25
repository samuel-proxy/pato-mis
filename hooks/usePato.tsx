"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { DB } from "@/lib/store";
import {
  audit,
  clearSession,
  loadDB,
  loadSession,
  resetDB,
  saveDB,
  saveSession,
} from "@/lib/store";
import { authenticate } from "@/lib/auth";
import { ROLE_LABEL } from "@/lib/constants";
import type { User } from "@/types/user";

export interface PatoValue {
  /** The database (null until loaded on the client). */
  db: DB | null;
  /** True once the database and session have been loaded. */
  ready: boolean;
  /** The signed-in user, or null. */
  user: User | null;
  /** Last feedback message for the current screen. */
  msg: string;
  setMsg: (message: string) => void;
  /** Apply a mutation to a copy of the database and save it to localStorage. */
  update: (fn: (d: DB) => void, message?: string) => void;
  /** Save an already-mutated copy of the database (used by service actions). */
  commit: (copy: DB, message?: string) => void;
  /**
   * Run a service function on a copy of the database and commit it.
   * Returns false (and shows the refusal message) when the service throws.
   */
  run: (fn: (d: DB) => string) => boolean;
  /** Reload the database from localStorage. */
  refresh: () => void;
  /** Reset the database to the seeded demo data. */
  reset: () => void;
  login: (username: string, password: string) => { user: User } | { error: string };
  logout: () => void;
}

const PatoContext = createContext<PatoValue | null>(null);

/**
 * One provider per role area (mounted in each role layout). All pages in the
 * area share the same database state, so a change on one page is visible on
 * the next without a reload. Data lives in the browser (localStorage), as in
 * the reference implementation — there is no backend.
 */
export function PatoProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<DB | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [msg, setMsg] = useState("");
  const dbRef = useRef<DB | null>(null);
  dbRef.current = db;

  useEffect(() => {
    const d = loadDB();
    setDb(d);
    const s = loadSession();
    if (s) {
      const u = d.users.find((x) => x.username === s.username && x.active);
      if (u) setUser(u);
    }
    setReady(true);
  }, []);

  const commit = useCallback((copy: DB, message?: string) => {
    saveDB(copy);
    setDb(copy);
    if (message) setMsg(message);
  }, []);

  const run = useCallback(
    (fn: (d: DB) => string): boolean => {
      const current = dbRef.current;
      if (!current) return false;
      try {
        const copy: DB = JSON.parse(JSON.stringify(current));
        const message = fn(copy);
        commit(copy, message);
        return true;
      } catch (e) {
        setMsg(e instanceof Error ? e.message : "Something went wrong.");
        return false;
      }
    },
    [commit]
  );

  const update = useCallback(
    (fn: (d: DB) => void, message?: string) => {
      const current = dbRef.current;
      if (!current) return;
      const copy: DB = JSON.parse(JSON.stringify(current));
      fn(copy);
      commit(copy, message);
    },
    [commit]
  );

  const refresh = useCallback(() => {
    setDb(loadDB());
  }, []);

  const reset = useCallback(() => {
    const d = resetDB();
    setDb(d);
    setMsg("Demo data reset to seed data.");
  }, []);

  const login = useCallback((username: string, password: string) => {
    const dbNow = loadDB();
    const result = authenticate(dbNow, username, password);
    if ("error" in result) return result;
    saveSession(result.user.username);
    audit(
      dbNow,
      result.user.username,
      "Login",
      `${result.user.name} (${ROLE_LABEL[result.user.role]}) logged in. Session valid 8 hours.`
    );
    saveDB(dbNow);
    setDb(dbNow);
    setUser(result.user);
    return result;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  return (
    <PatoContext.Provider
      value={{ db, ready, user, msg, setMsg, update, commit, run, refresh, reset, login, logout }}
    >
      {children}
    </PatoContext.Provider>
  );
}

export function usePato(): PatoValue {
  const ctx = useContext(PatoContext);
  if (!ctx) throw new Error("usePato must be used inside <PatoProvider>.");
  return ctx;
}
