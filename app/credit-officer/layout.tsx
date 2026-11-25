import DashboardLayout from "@/components/layout/DashboardLayout";

const navItems = [
  { name: "Dashboard", href: "/credit-officer/dashboard" },
  { name: "Loan Applications", href: "/credit-officer/loan-applications" },
  { name: "Disbursements", href: "/credit-officer/disbursements" },
  { name: "Repayments", href: "/credit-officer/repayments" },
  { name: "Members", href: "/credit-officer/members" },
];

export default function CreditOfficerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardLayout
      title="Credit Officer Portal"
      subtitle="Loan Management"
      userName="Officer"
      userRole="Credit Officer"
      navItems={navItems}
    >
      {children}
    </DashboardLayout>
  );
}