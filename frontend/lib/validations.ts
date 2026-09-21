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

export const inviteMemberSchema = z.object({
  email: z.string().email("Valid email required").max(255),
});

export const userSignupSchema = z.object({
  email: z.string().email("Valid email required").max(255),
  password: z.string().min(8, "Minimum 8 characters").max(128),
});

export const userLoginSchema = adminLoginSchema;

export const productSchema = z.object({
  title: z.string().min(2, "Title is required").max(255),
  description: z.string().max(5000).optional().or(z.literal("")),
  price: z.coerce.number().positive("Price must be positive"),
  stockQuantity: z.coerce.number().int().min(0, "Stock must be >= 0"),
  imageUrl: z.string().max(255).optional().or(z.literal("")),
});

export type RegisterStoreInput = z.infer<typeof registerStoreSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
export type UserSignupInput = z.infer<typeof userSignupSchema>;
export type UserLoginInput = z.infer<typeof userLoginSchema>;
export type ProductInput = z.infer<typeof productSchema>;
