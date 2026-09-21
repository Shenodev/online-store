import Link from "next/link";
import type { StorefrontProduct } from "@/lib/storefront";

export function ProductCard({
  storeId,
  product,
}: {
  storeId: string;
  product: StorefrontProduct;
}) {
  return (
    <div className="card flex !p-6 flex-col">
      <div className="rounded-xl bg-slate-900 p-8 text-center text-slate-500">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.title}
            loading="lazy"
            className="mx-auto max-h-48 rounded-xl object-cover"
          />
        ) : (
          "No image"
        )}
      </div>
      <h3 className="mt-4 font-sora text-lg font-semibold leading-snug">
        {product.title}
      </h3>
      <div className="mt-2 flex items-center justify-between gap-2">
        <p className="font-inter text-lg font-medium text-white">
          ${product.price.toFixed(2)}
        </p>
        {product.stockQuantity === 0 ? (
          <span className="badge">Out of stock</span>
        ) : (
          <span className="badge-accent">In stock</span>
        )}
      </div>
      <Link
        href={`/store/${storeId}/product/${product.id}`}
        className="btn-secondary mt-4 w-full"
      >
        View product
      </Link>
    </div>
  );
}
