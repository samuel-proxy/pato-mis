"use client";

import { PatoProvider } from "@/hooks/usePato";
import { useSession } from "@/hooks/useAuth";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { NAV_ITEMS, ROLE_LABEL } from "@/lib/constants";

function SystemAdminLayoutInner({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user } = useSession();
  return (
    <DashboardLayout
      title="System Administrator"
      subtitle="Platform Management"
      userName={user?.name}
      userRole={user ? ROLE_LABEL[user.role] : "System Admin"}
      navItems={NAV_ITEMS.sysadmin}
    >
      {children}
    </DashboardLayout>
  );
}

export default function SystemAdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <PatoProvider>
      <SystemAdminLayoutInner>{children}</SystemAdminLayoutInner>
    </PatoProvider>
  );
}
