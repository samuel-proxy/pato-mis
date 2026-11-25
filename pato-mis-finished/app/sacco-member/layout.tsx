"use client";

import { PatoProvider } from "@/hooks/usePato";
import { useSession } from "@/hooks/useAuth";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { NAV_ITEMS, ROLE_LABEL } from "@/lib/constants";

function MemberLayoutInner({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user } = useSession();
  return (
    <DashboardLayout
      title="Member Portal"
      subtitle="Savings & Loans"
      userName={user?.name}
      userRole={user ? ROLE_LABEL[user.role] : "Member"}
      navItems={NAV_ITEMS.member}
    >
      {children}
    </DashboardLayout>
  );
}

export default function MemberLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <PatoProvider>
      <MemberLayoutInner>{children}</MemberLayoutInner>
    </PatoProvider>
  );
}
