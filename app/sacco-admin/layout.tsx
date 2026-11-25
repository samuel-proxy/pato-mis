import DashboardLayout from "@/components/layout/DashboardLayout";

const navItems = [
  { name: "Dashboard", href: "/sacco-admin/dashboard" },
  { name: "Members", href: "/sacco-admin/members" },
  { name: "Loan Products", href: "/sacco-admin/loan-products" },
  { name: "Policies", href: "/sacco-admin/policies" },
  { name: "Feedback", href: "/sacco-admin/feedback" },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardLayout
      title="Administrator Portal"
      subtitle="SACCO Management"
      userName="Admin"
      userRole="Administrator"
      navItems={navItems}
    >
      {children}
    </DashboardLayout>
  );
}