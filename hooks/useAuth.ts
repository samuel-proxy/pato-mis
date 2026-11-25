"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePato } from "@/hooks/usePato";
import type { PatoValue } from "@/hooks/usePato";
import { roleHome } from "@/lib/auth";
import type { Role } from "@/types/user";

/** The session and database without any redirect (used by layouts). */
export function useSession(): PatoValue {
  return usePato();
}

/**
 * Require a signed-in user on this page (FR01). Redirects to /login when
 * there is no session, and to the user's own dashboard when the signed-in
 * role is not allowed on this page.
 */
export function useAuth(requiredRoles?: Role[]): PatoValue {
  const ctx = usePato();
  const router = useRouter();
  const { ready, user } = ctx;

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/login");
    } else if (requiredRoles && !requiredRoles.includes(user.role)) {
      router.replace(roleHome(user.role));
    }
  }, [ready, user, requiredRoles, router]);

  return ctx;
}
