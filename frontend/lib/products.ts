import { adminApi } from "./api";

export type Product = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  stockQuantity: number;
  imageUrl: string | null;
  createdAt: string;
};

export type ProductInput = {
  title: string;
  description?: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
};

export function listProducts(): Promise<Product[]> {
  return adminApi<Product[]>("products");
}

export function createProduct(input: ProductInput): Promise<Product> {
  return adminApi<Product>("products", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateProduct(id: string, input: ProductInput): Promise<Product> {
  return adminApi<Product>(`products/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function deleteProduct(id: string): Promise<void> {
  return adminApi<void>(`products/${id}`, { method: "DELETE" });
}
