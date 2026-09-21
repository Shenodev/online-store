import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Navbar } from "@/components/Navbar";
import { getStoreProduct } from "@/lib/storefront";

export default async function ProductDetailPage({
  params,
}: {
  params: { storeId: string; productId: string };
}) {
  const product = await getStoreProduct(params.storeId, params.productId);
  if (!product) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <Link
          href={`/store/${params.storeId}`}
          className="text-sm text-slate-400 transition-colors duration-200 hover:text-[#06B6D4]"
        >
          ← Back to store
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="card flex !p-8 items-center justify-center text-slate-500">
            {product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.imageUrl}
                alt={product.title}
                className="max-h-96 rounded-xl object-cover"
              />
            ) : (
              "No image"
            )}
          </div>

          <div className="card">
            <div>
              {product.stockQuantity === 0 ? (
                <span className="badge">Out of stock</span>
              ) : (
                <span className="badge-accent">
                  {product.stockQuantity} in stock
                </span>
              )}
            </div>
            <h1 className="mt-4 font-sora text-3xl font-bold leading-tight md:text-4xl">
              {product.title}
            </h1>
            <p className="mt-3 font-inter text-2xl font-medium text-[#06B6D4]">
              ${product.price.toFixed(2)}
            </p>
            {product.description && (
              <p className="mt-6 font-inter leading-relaxed text-slate-300">
                {product.description}
              </p>
            )}
            <div className="mt-8">
              <AddToCartButton storeId={params.storeId} product={product} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
