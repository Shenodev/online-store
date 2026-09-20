export default function AdminInvitePage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <div className="rounded-xl bg-slate-800 p-8">
        <h1 className="font-sora text-2xl font-bold text-white">
          Accept invite
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Token: {searchParams.token ?? "missing"}
        </p>
      </div>
    </main>
  );
}
