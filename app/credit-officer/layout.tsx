"use client";

import { PatoProvider } from "@/hooks/usePato";
import { useSession } from "@/hooks/useAuth";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { NAV_ITEMS, ROLE_LABEL } from "@/lib/constants";

function CreditOfficerLayoutInner({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user } = useSession();
  return (
    <DashboardLayout
      title="Credit Officer Portal"
      subtitle="Loan Management"
      userName={user?.name}
      userRole={user ? ROLE_LABEL[user.role] : "Credit Officer"}
      navItems={NAV_ITEMS.officer}
    >
      {children}
    </DashboardLayout>
  );
}

export default function CreditOfficerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <PatoProvider>
      <CreditOfficerLayoutInner>{children}</CreditOfficerLayoutInner>
    </PatoProvider>
  );
}
