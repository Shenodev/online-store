# UI/UX Design Brief: Shenostore

## 1. Design Vision & Core Philosophy
Shenostore features a modern, ultra-clean, "dark-mode first" aesthetic. The interface must feel sleek, highly responsive, and spacious. 

**Absolute Directives:**
- **Flat Design Only:** Absolutely NO 3D elements, bevels, inner shadows, or skeuomorphic styling.
- **Negative Space:** Elements must breathe. Use generous padding and margins (e.g., `p-6`, `p-8`, `gap-6` in Tailwind) to prevent clutter.
- **Uniformity:** Every card, modal, and button must strictly adhere to the defined border-radius.

## 2. Brand Identity
- **Project Name:** Shenostore
- **Logo:** The distinct "S" logo positioned to the left of the "Shenostore" wordmark in the Navbar.
- **Favicon:** The "S" logo must be used as the `<link rel="icon">` for all domains (`admin.*` and `store.*`).

## 3. Color Palette
The color system is strictly limited to ensure high contrast and a premium dark aesthetic.

*   **Primary Background (Deep Slate):** `#0F172A`
    *   *Usage:* The main `<body>` background for both the Admin Dashboard and the User Storefront.
*   **Component Surfaces (Surfaces):** `#1E293B`
    *   *Usage:* Cards, modals, dropdown menus, table backgrounds, and input fields. Creates visual hierarchy against the Deep Slate background.
*   **Primary Accent / Action (Electric Cyan):** `#06B6D4`
    *   *Usage:* Primary CTA buttons ("Add to Cart", "Create Store"), active states, focus rings, selected navigation links, and success indicators.
*   **Text Colors (Inferred for Contrast):**
    *   *Primary Text:* Pure White (`#FFFFFF`) or light slate (`#F8FAFC`) for maximum readability on dark backgrounds.
    *   *Secondary Text:* Muted slate (`#94A3B8`) for placeholders, timestamps, and secondary labels.

## 4. Typography System
Fonts must be imported via Google Fonts or `next/font`.

*   **Headings (h1 - h6):** `Sora`
    *   *Usage:* Page titles, section headers, product names, modal titles, and the Shenostore brand wordmark.
    *   *Weight:* Semibold (600) to Bold (700).
*   **Body & UI Text:** `Inter`
    *   *Usage:* Paragraphs, product descriptions, input labels, table data, buttons, and navigation links.
    *   *Weight:* Regular (400) for body, Medium (500) for buttons and labels.

## 5. UI Component Geometry & Styling (Tailwind Rules)
- **Border Radius:** `rounded-xl` MUST be applied to all structural UI elements. This includes:
  - Product image containers
  - Form inputs (`<input>`, `<select>`)
  - Buttons (`<button>`)
  - Cards and Dialog/Modal windows
- **Borders & Dividers:** Use subtle borders (e.g., `border-slate-700` or `border-slate-800`) rather than drop shadows to separate overlapping surfaces.
- **Focus States:** All interactive elements (inputs, buttons) must feature an Electric Cyan focus ring (e.g., `focus:ring-2 focus:ring-[#06B6D4] focus:outline-none`).

## 6. Layout Specifications

### 6.1 User Storefront (`store.shenodev.tech`)
- **Grid Layouts:** Use responsive CSS grids for product catalogs (1 column on mobile, 3-4 columns on desktop).
- **Navigation:** Top fixed navbar containing the S-logo brand, Search bar (centered), and Cart/User icons (right-aligned).
- **Product Cards:** Surface background (`#1E293B`), `rounded-xl`, with a high-quality product image at the top. The "Add to Cart" button sits at the bottom of the card, utilizing the Electric Cyan accent.

### 6.2 Admin Dashboard (`admin.store.shenodev.tech`)
- **Layout Structure:** Sidebar navigation (left) + Main content area (right).
- **Sidebar:** Fixed width, Surface color (`#1E293B`). Active tab highlighted with an Electric Cyan left-border or background tint.
- **Data Tables:** Used for Products, Orders, and Team sections. Minimal grid lines, Inter font for data rows, generous row padding (`py-4`).
- **Modals:** Slide-in drawers or centered overlays (with `rounded-xl` and Surface background) must be used for adding products or inviting team members, keeping the admin on the current context page.

## 7. UX Interactions & Feedback
- **Hover States:** Subtle transitions required (e.g., `transition-colors duration-200`). Buttons should slightly increase in brightness or opacity on hover.
- **Loading States:** No jarring layout shifts. Use skeleton loaders using the Surface color (`#1E293B` with an animation pulse) while fetching data from the Spring Boot API.
- **Toast Notifications:** Provide bottom-right toast notifications for all CRUD operations ("Product Added", "Invite Sent", "Added to Cart").