"use client";

import { PatoProvider } from "@/hooks/usePato";
import { useSession } from "@/hooks/useAuth";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { NAV_ITEMS, ROLE_LABEL } from "@/lib/constants";

function AdminLayoutInner({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user } = useSession();
  return (
    <DashboardLayout
      title="Administrator Portal"
      subtitle="SACCO Management"
      userName={user?.name}
      userRole={user ? ROLE_LABEL[user.role] : "Administrator"}
      navItems={NAV_ITEMS.sacco_admin}
    >
      {children}
    </DashboardLayout>
  );
}

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <PatoProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </PatoProvider>
  );
}
