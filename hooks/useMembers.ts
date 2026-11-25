"use client";

import { useMemo } from "react";
import { usePato } from "@/hooks/usePato";
import type { DB } from "@/lib/store";
import * as memberService from "@/services/memberService";
import type { Member, MemberRegistrationInput } from "@/types/member";

/** Members, search and registration, bound to the store. */
export function useMembers() {
  const { db, user, commit, setMsg } = usePato();

  const members = useMemo(() => db?.members ?? [], [db]);

  function search(query: string): Member[] {
    if (!db) return [];
    return memberService.searchMembers(db, query);
  }

  function getMember(memberId: string): Member | undefined {
    return db?.members.find((m) => m.id === memberId);
  }

  function outstanding(memberId: string): number {
    if (!db) return 0;
    return memberService.outstandingForMember(db, memberId);
  }

  /** Register a member (FR15–FR18). Returns the new membership number or null. */
  function register(input: MemberRegistrationInput): string | null {
    if (!db || !user) return null;
    try {
      const copy: DB = JSON.parse(JSON.stringify(db));
      const result = memberService.registerMember(copy, input, user.username);
      commit(copy, result.message);
      return result.memberId;
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Something went wrong.");
      return null;
    }
  }

  return { members, search, getMember, outstanding, register };
}
