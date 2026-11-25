import DashboardLayout from "@/components/layout/DashboardLayout";

const navItems = [
  { name: "Dashboard", href: "/system-admin/dashboard" },
  { name: "Users", href: "/system-admin/users" },
  { name: "Roles", href: "/system-admin/roles" },
  { name: "Audit Logs", href: "/system-admin/audit-logs" },
  { name: "Reports", href: "/system-admin/reports" },
  { name: "Backups", href: "/system-admin/backups" },
  { name: "Loan Products", href: "/system-admin/loan-products" },
];

export default function SystemAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardLayout
      title="System Administrator"
      subtitle="Platform Management"
      userName="SysAdmin"
      userRole="System Admin"
      navItems={navItems}
    >
      {children}
    </DashboardLayout>
  );
}