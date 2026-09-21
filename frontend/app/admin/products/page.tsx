"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import {
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct,
  type Product,
} from "@/lib/products";
import { productSchema } from "@/lib/validations";

type ModalState = { mode: "add" } | { mode: "edit"; product: Product } | null;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setProducts(await listProducts());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onSubmit(formData: FormData) {
    setFormError(null);
    const parsed = productSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description") || undefined,
      price: formData.get("price"),
      stockQuantity: formData.get("stockQuantity"),
      imageUrl: formData.get("imageUrl") || undefined,
    });
    if (!parsed.success) {
      setFormError(parsed.error.errors[0]?.message ?? "Invalid input");
      return;
    }
    if (!modal) return;
    setSaving(true);
    try {
      if (modal.mode === "add") {
        await createProduct(parsed.data);
        setStatus("Product added.");
      } else {
        await updateProduct(modal.product.id, parsed.data);
        setStatus("Product updated.");
      }
      setModal(null);
      await load();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      return;
    }
    setConfirmDeleteId(null);
    setStatus(null);
    try {
      await deleteProduct(id);
      setStatus("Product deleted.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  const editing = modal?.mode === "edit" ? modal.product : null;

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-sora text-3xl font-bold text-white">Products</h1>
          <p className="mt-2 text-slate-400">
            Your store catalog. All changes are scoped to your store.
          </p>
        </div>
        <Button onClick={() => { setFormError(null); setModal({ mode: "add" }); }}>
          Add Product
        </Button>
      </div>

      {status && (
        <div role="status" className="mt-6 rounded-xl border border-[#06B6D4] p-4 text-sm text-slate-200">
          {status}
        </div>
      )}
      {error && (
        <div role="alert" className="mt-6 rounded-xl border border-red-500/50 p-4 text-sm text-red-300">
          {error}{" "}
          <button onClick={load} className="underline hover:text-red-200">
            Retry
          </button>
        </div>
      )}

      <div className="card mt-8 overflow-x-auto !p-0">
        {loading ? (
          <div className="flex flex-col gap-3 p-6" aria-label="Loading products">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton h-12 w-full" />
            ))}
          </div>
        ) : products.length === 0 && !error ? (
          <p className="p-8 text-center text-slate-400">
            No products yet. Click “Add Product” to create your first one.
          </p>
        ) : (
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400">
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Created</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="table-row font-inter text-slate-200">
                  <td className="px-6 py-4 font-medium text-white">{p.title}</td>
                  <td className="px-6 py-4">${p.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={p.stockQuantity === 0 ? "badge" : "badge-accent"}>
                      {p.stockQuantity === 0 ? "Out of stock" : `${p.stockQuantity} in stock`}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => { setFormError(null); setModal({ mode: "edit", product: p }); }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onDelete(p.id)}
                        className={
                          confirmDeleteId === p.id
                            ? "!border-red-500 !text-red-300"
                            : ""
                        }
                      >
                        {confirmDeleteId === p.id ? "Confirm?" : "Delete"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        open={modal !== null}
        title={modal?.mode === "edit" ? "Edit product" : "Add product"}
        onClose={() => setModal(null)}
      >
        <form action={onSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="p-title" className="label">Title</label>
            <input id="p-title" name="title" defaultValue={editing?.title ?? ""} className="input" />
          </div>
          <div>
            <label htmlFor="p-desc" className="label">Description</label>
            <textarea
              id="p-desc"
              name="description"
              rows={3}
              defaultValue={editing?.description ?? ""}
              className="input"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="p-price" className="label">Price (USD)</label>
              <input
                id="p-price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                defaultValue={editing?.price ?? ""}
                className="input"
              />
            </div>
            <div>
              <label htmlFor="p-stock" className="label">Stock</label>
              <input
                id="p-stock"
                name="stockQuantity"
                type="number"
                min="0"
                step="1"
                defaultValue={editing?.stockQuantity ?? 0}
                className="input"
              />
            </div>
          </div>
          <div>
            <label htmlFor="p-image" className="label">Image URL (optional)</label>
            <input
              id="p-image"
              name="imageUrl"
              type="url"
              defaultValue={editing?.imageUrl ?? ""}
              className="input"
            />
          </div>
          {formError && (
            <p role="alert" className="text-sm text-red-400">{formError}</p>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setModal(null)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : modal?.mode === "edit" ? "Save changes" : "Add product"}
            </Button>
          </div>
        </form>
      </Modal>
    </main>
  );
}
