export default function OrderSuccessPage({
  params,
}: {
  params: { storeId: string };
}) {
  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <div className="rounded-xl bg-slate-800 p-8 text-center">
        <h1 className="font-sora text-2xl font-bold text-white">
          Order confirmed
        </h1>
        <p className="mt-2 text-slate-400">Store {params.storeId}</p>
      </div>
    </main>
  );
}
