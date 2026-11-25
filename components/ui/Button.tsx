interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}

export default function Button({
  children,
  onClick,
  type = "button",
  className = "",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-blue-900 text-white px-4 py-2 rounded border border-blue-800 hover:bg-blue-800 transition-colors ${className}`.trim()}
    >
      {children}
    </button>
  );
}