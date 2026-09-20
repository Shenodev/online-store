import { z } from "zod";

export const registerStoreSchema = z.object({
  storeName: z.string().min(2, "Store name is required").max(255),
  email: z.string().email("Valid email required").max(255),
  password: z.string().min(8, "Minimum 8 characters").max(128),
});

export const adminLoginSchema = z.object({
  email: z.string().email("Valid email required").max(255),
  password: z.string().min(1, "Password is required").max(128),
});

export const productSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  stockQuantity: z.number().int().min(0),
});

export type RegisterStoreInput = z.infer<typeof registerStoreSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type ProductInput = z.infer<typeof productSchema>;
