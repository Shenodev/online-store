export default function AdminTeamPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-sora text-3xl font-bold text-white">Team</h1>
      <p className="mt-2 text-slate-400">
        Invite secondary admins via POST /api/v1/admin/invite.
      </p>
      <div className="mt-8 rounded-xl bg-slate-800 p-8 text-slate-400">
        Team management scaffold.
      </div>
    </main>
  );
}
