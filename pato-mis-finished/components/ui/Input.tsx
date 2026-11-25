interface InputProps {
  type?: string;
  placeholder?: string;
  id?: string;
  name?: string;
  required?: boolean;
}

export default function Input({
  type = "text",
  placeholder,
  id,
  name,
  required = false,
}: InputProps) {
  return (
    <input
      type={type}
      id={id}
      name={name}
      placeholder={placeholder}
      required={required}
      className="w-full px-3 py-2 border border-slate-400 rounded bg-white text-black outline-none focus:border-blue-900"
    />
  );
}