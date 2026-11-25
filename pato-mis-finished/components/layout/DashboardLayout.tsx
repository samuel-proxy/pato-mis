import Sidebar, { NavItem } from "./Sidebar";import Header from "./Header";

interface DashboardLayoutProps {
  title: string;
  subtitle?: string;
  userName?: string;
  userRole?: string;
  navItems: NavItem[];
  children: React.ReactNode;
}

export default function DashboardLayout({
  title,
  subtitle,
  userName,
  userRole,
  navItems,
  children,
}: DashboardLayoutProps) {
  return (
    <main className="flex min-h-screen bg-slate-50">
      <Sidebar
        title="PATO SACCO"
        subtitle={title}
        items={navItems}
      />

      <div className="min-w-0 flex-1">
        <Header
          title={title}
          subtitle={subtitle}
          userName={userName}
          userRole={userRole}
        />
        <section className="p-6 md:p-10">{children}</section>
      </div>
    </main>
  );
}