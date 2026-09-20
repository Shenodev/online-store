export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-sora text-3xl font-bold text-white">Checkout</h1>
      <p className="mt-2 text-slate-400">
        POST /api/v1/user/orders with Stripe/PayPal token.
      </p>
    </main>
  );
}
