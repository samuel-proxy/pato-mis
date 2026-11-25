import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 text-slate-900">
      <div className="max-w-md text-center border border-slate-300 rounded p-6">
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-sm text-slate-600">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="mt-4 rounded border border-slate-400 px-4 py-2 text-sm hover:bg-slate-100"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}