interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-white border border-slate-300 rounded p-4 ${className}`.trim()}>
      {children}
    </div>
  );
}