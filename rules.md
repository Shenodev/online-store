# Rules.md

## 1. Coding Standards (No Vibe Coding)
- Enforce strict typing (TypeScript for frontend, Java strongly typed for backend).
- Separate business logic from controllers in Spring Boot.
- Use repository pattern for MySQL data access.
- Modularize Next.js components; keep server components and client components strictly separated.

## 2. Design System & UI/UX
- **Typography:** 'Sora' for all Headings (h1-h6), 'Inter' for Body text, inputs, and labels.
- **Color Palette:** 
  - Primary Backgrounds/Surfaces: Deep Slate (`#0F172A`), Secondary Surfaces (`#1E293B`).
  - Accents/Buttons/Highlights: Electric Cyan (`#06B6D4`).
- **Styling Rules:** Use Tailwind CSS exclusively. Apply `rounded-xl` for cards, buttons, and dialogs. Maintain wide, clean negative space (padding/margins). Absolutely no 3D elements, bevels, or heavy drop-shadows. Flat, sleek, modern UI.
- **Branding:** Use the Shenostore S-logo as the favicon and navbar brand.

## 3. Security & Validation
- Prevent SQL Injection using parameterized queries/JPA in Spring Boot.
- Prevent XSS by escaping user inputs and using React's default DOM sanitization.
- Implement CSRF protection.
- Validate all incoming API payloads (using Zod on the frontend, `jakarta.validation` on the backend).
- Ensure row-level security logic: An admin of `store_id = 1` must never be able to query or mutate data for `store_id = 2`.