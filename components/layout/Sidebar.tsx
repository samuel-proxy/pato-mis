export interface NavItem {
  name: string;
  href: string;
}

interface SidebarProps {
  title: string;
  subtitle: string;
  items: NavItem[];
}

export default function Sidebar({ title, subtitle, items }: SidebarProps) {
  return (
    <aside className="hidden w-64 flex-col bg-slate-100 border-r border-slate-300 md:flex">
      <div className="border-b border-slate-300 px-6 py-6">
        <h1 className="text-lg font-bold text-slate-900">{title}</h1>
        <p className="mt-1 text-xs text-slate-600">{subtitle}</p>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-4">
        {items.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="block px-3 py-2 text-sm text-slate-800 rounded hover:bg-slate-200"
          >
            {item.name}
          </a>
        ))}
      </nav>

      <div className="border-t border-slate-300 p-4">
        <a
          href="/login"
          className="block px-3 py-2 text-sm text-slate-700 rounded hover:bg-slate-200"
        >
          Sign Out
        </a>
      </div>
    </aside>
  );
}