"use client";

export default function Error({
  reset,
}: {
  reset?: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 text-slate-900">
      <div className="max-w-md text-center border border-slate-300 rounded p-6">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-sm text-slate-600">
          An unexpected error has occurred.
        </p>
        <button
          onClick={reset}
          className="mt-4 rounded border border-slate-400 px-4 py-2 text-sm hover:bg-slate-100"
        >
          Try again
        </button>
      </div>
    </main>
  );
}