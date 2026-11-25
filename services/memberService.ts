import type { DB } from "@/lib/store";
import { audit, outstandingLoans, uid } from "@/lib/store";
import type { Member, MemberRegistrationInput } from "@/types/member";

/** Search members by name or membership number (FR08). */
export function searchMembers(db: DB, query: string): Member[] {
  const q = query.trim();
  if (!q) return db.members;
  return db.members.filter(
    (m) => m.name.toLowerCase().includes(q.toLowerCase()) || m.id.includes(q.toUpperCase())
  );
}

export function getMember(db: DB, memberId: string): Member | undefined {
  return db.members.find((m) => m.id === memberId);
}

export function outstandingForMember(db: DB, memberId: string): number {
  return outstandingLoans(db, memberId);
}

/**
 * Register a member (FR15, FR16, FR17, FR18). Throws with a plain message
 * when the details are incomplete, the national ID is duplicated or invalid.
 * Issues the next ER-#### number and creates a member login (password member123).
 */
export function registerMember(
  db: DB,
  input: MemberRegistrationInput,
  actor: string
): { memberId: string; message: string } {
  if (!input.name.trim() || !input.nationalId.trim() || !input.phone.trim())
    throw new Error("Name, National ID and phone are required.");
  if (db.members.some((m) => m.nationalId === input.nationalId.trim()))
    throw new Error("Duplicate National ID: a member with this ID already exists.");
  if (!/^\d{8}$/.test(input.nationalId.trim()))
    throw new Error("National ID must be 8 digits.");
  const nextNum = Math.max(...db.members.map((m) => Number(m.id.split("-")[1])), 0) + 1;
  const newId = `ER-${String(nextNum).padStart(4, "0")}`;
  db.members.push({
    id: newId,
    name: input.name.trim(),
    nationalId: input.nationalId.trim(),
    phone: input.phone.trim(),
    email: input.email.trim(),
    depositsCents: 0,
    savingsCents: 0,
    inArrears: false,
    idVerified: input.idVerified,
    joined: new Date().toISOString().slice(0, 10),
  });
  db.users.push({
    id: uid("U"),
    username: newId,
    password: "member123",
    name: input.name.trim(),
    role: "member",
    memberId: newId,
    active: true,
    createdAt: new Date().toISOString(),
  });
  audit(
    db,
    actor,
    "Member registered",
    `${newId} ${input.name.trim()} registered. ID ${input.idVerified ? "verified" : "NOT verified"}. Login created: ${newId} / member123.`
  );
  return {
    memberId: newId,
    message: `Member registered. Membership number: ${newId}.`,
  };
}
