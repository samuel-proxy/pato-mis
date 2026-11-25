import type { DB } from "@/lib/store";
import type { Txn } from "@/types/transaction";

/** Transactions for one member, newest first, up to `limit` rows (NFR02: 20 rows). */
export function listForMember(db: DB, memberId: string, limit = 20): Txn[] {
  return db.txns.filter((t) => t.memberId === memberId).slice(0, limit);
}

/** All transactions, newest first. */
export function listAll(db: DB, limit = 50): Txn[] {
  return db.txns.slice(0, limit);
}

/** A member's statement (FR05): their transactions, newest first. */
export function statement(db: DB, memberId: string, limit = 20): Txn[] {
  return listForMember(db, memberId, limit);
}
