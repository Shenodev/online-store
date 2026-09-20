import Link from "next/link";

export type Product = {
  id: string;
  title: string;
  price: number;
  imageUrl?: string;
};

export function ProductCard({
  storeId,
  product,
}: {
  storeId: string;
  product: Product;
}) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-6">
      <div className="rounded-xl bg-slate-900 p-8 text-center text-slate-500">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.title}
            className="mx-auto rounded-xl"
          />
        ) : (
          "No image"
        )}
      </div>
      <h3 className="mt-4 font-sora text-lg font-semibold text-white">
        {product.title}
      </h3>
      <p className="mt-1 text-slate-400">${product.price.toFixed(2)}</p>
      <div className="mt-4 flex gap-2">
        <Link
          href={`/store/${storeId}/product/${product.id}`}
          className="flex-1 rounded-xl border border-slate-700 px-4 py-2 text-center text-white transition-colors duration-200 hover:border-cyan-500"
        >
          View
        </Link>
        <button className="flex-1 rounded-xl bg-cyan-500 px-4 py-2 font-medium text-slate-900 transition-colors duration-200 hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
