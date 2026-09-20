import { z } from "zod";

export const registerStoreSchema = z.object({
  storeName: z.string().min(2, "Store name is required"),
  email: z.string().email("Valid email required"),
  password: z.string().min(8, "Minimum 8 characters"),
});

export const productSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  stockQuantity: z.number().int().min(0),
});

export type RegisterStoreInput = z.infer<typeof registerStoreSchema>;
export type ProductInput = z.infer<typeof productSchema>;
