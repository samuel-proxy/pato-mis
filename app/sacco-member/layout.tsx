import DashboardLayout from "@/components/layout/DashboardLayout";

const navItems = [
  { name: "Dashboard", href: "/sacco-member/dashboard" },
  { name: "My Savings", href: "/sacco-member/savings" },
  { name: "Loans", href: "/sacco-member/loans" },
  { name: "Withdrawals", href: "/sacco-member/withdrawals" },
  { name: "Statements", href: "/sacco-member/statements" },
  { name: "My Profile", href: "/sacco-member/profile" },
];

export default function MemberLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardLayout
      title="Member Portal"
      subtitle="Savings & Loans"
      userName="Samuel Musyoka"
      userRole="Member"
      navItems={navItems}
    >
      {children}
    </DashboardLayout>
  );
}