type BadgeVariant = "default" | "success" | "danger";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

export default function Badge({ children, variant = "default" }: BadgeProps) {
  const colors = {
    default: "bg-slate-200 text-slate-800",
    success: "bg-green-100 text-green-800",
    danger: "bg-red-100 text-red-800",
  };

  return (
    <span className={`inline-block px-2 py-1 rounded-full text-xs ${colors[variant]}`}>
      {children}
    </span>
  );
}