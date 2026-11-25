interface HeaderProps {
  title: string;
  subtitle?: string;
  userName?: string;
  userRole?: string;
}

export default function Header({
  title,
  subtitle,
  userName,
  userRole,
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-slate-300 bg-white px-6 py-4 md:px-10">
      <div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
        )}
      </div>

      {userName && (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
            {userName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">{userName}</p>
            {userRole && (
              <p className="text-xs text-slate-500">{userRole}</p>
            )}
          </div>
        </div>
      )}
    </header>
  );
}