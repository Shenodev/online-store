"use client";

export default function AdminProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="card text-center">
        <h1 className="font-sora text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-sm text-slate-400">
          {error.message || "The products view failed to load."}
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={reset} className="btn-primary">
            Try again
          </button>
        </div>
      </div>
    </main>
  );
}
