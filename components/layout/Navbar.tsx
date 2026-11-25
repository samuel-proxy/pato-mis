/** Public navigation bar for the landing page, with the SACCO logo. */
export default function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-slate-300 bg-white px-8 py-4">
      <a href="#home" className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo.png" alt="Pato Sacco logo" width={40} height={40} className="rounded" />
        <span className="text-xl font-bold text-slate-900">PATO SACCO</span>
      </a>

      <div className="hidden items-center gap-6 md:flex">
        <a href="#home" className="text-sm hover:underline">Home</a>
        <a href="#about" className="text-sm hover:underline">About</a>
        <a href="#services" className="text-sm hover:underline">Services</a>
        <a href="#contact" className="text-sm hover:underline">Contact</a>
      </div>

      <a
        href="/login"
        className="rounded border border-slate-400 px-4 py-2 text-sm hover:bg-slate-100"
      >
        Login
      </a>
    </nav>
  );
}
