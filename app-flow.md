# AppFlow.md

## Overview
This document outlines the step-by-step application flows and user journeys for Shenostore v1.0. It bridges the gap between the user interface (`admin.store.shenodev.tech` / `store.shenodev.tech`) and the backend API gateway (`api.store.shenodev.tech`), detailing how state transitions and API calls occur.

---

## 1. Admin Onboarding & Store Provisioning (Primary Admin)
**Domain:** `admin.store.shenodev.tech`

1. **Landing/Registration:** 
   - **UI:** The user navigates to `/register`. Clean Deep Slate (`#0F172A`) background with a centered, `rounded-xl` form card (Surface: `#1E293B`).
   - **Action:** User enters Store Name, Email, and Password. Clicks "Create Store" (Electric Cyan button).
   - **API:** `POST api.store.shenodev.tech/api/v1/admin/register`
   - **Backend Logic:** Creates `stores` record -> Creates `admin_users` record -> Generates JWT containing the new `store_id`.
2. **First Login & Setup:**
   - **Action:** JWT is stored securely (HTTP-only cookie or memory/local storage depending on architect config).
   - **UI Routing:** Redirects to `/dashboard`.
   - **State:** Global Admin Context initializes with `store_id` and user details.

## 2. Store Configuration (v1.0 Setup)
**Domain:** `admin.store.shenodev.tech/settings`

1. **Domain Mapping:**
   - **UI:** Admin inputs a custom domain (e.g., `shop.example.com`).
   - **API:** `POST /api/v1/admin/settings/domain` -> Saves to `stores` table.
2. **Payment & Shipping Integration:**
   - **UI:** Admin configures Stripe/PayPal keys and connects shipping carrier APIs.
   - **API:** `PUT /api/v1/admin/settings/integrations`.

## 3. Team Management (Secondary Admin Flow)
**Domain:** `admin.store.shenodev.tech/team`

1. **Inviting a Member:**
   - **UI:** Primary admin clicks "Invite Member". A sleek `rounded-xl` modal opens. Enters email address.
   - **API:** `POST /api/v1/admin/invite` (Payload: `{ "email": "..." }`).
   - **Backend Logic:** Generates a secure invite token tied to the primary admin's `store_id`. Mocks/sends email.
2. **Accepting an Invite:**
   - **Action:** Invitee clicks link in email -> routes to `admin.store.shenodev.tech/invite?token=XYZ`.
   - **UI:** Displays password creation form.
   - **API:** `POST /api/v1/admin/invite/accept` (Consumes token, creates `admin_users` record for the same `store_id`).

## 4. Advanced Inventory & Product Management
**Domain:** `admin.store.shenodev.tech/products`

1. **Viewing Products:**
   - **UI:** Data table listing products. Typography uses 'Sora' for headers, 'Inter' for row data.
   - **API:** `GET /api/v1/admin/products` (Backend extracts `store_id` from JWT, filters database).
2. **Adding a Product:**
   - **UI:** Admin clicks "Add Product". A form handles basic info, variants (size/color), and stock levels (Advanced Inventory v1.0).
   - **API:** `POST /api/v1/admin/products`.
   - **Validation:** Frontend Zod validation -> Backend Jakarta validation -> MySQL Insert.

## 5. Customer Shopping Experience
**Domain:** `store.shenodev.tech` (or mapped custom domain)

1. **Global Landing (if accessed via root domain):**
   - **UI:** Displays a list of available stores.
   - **API:** `GET /api/v1/stores`.
   - **Action:** User clicks a store card -> routes to `/store/[storeId]`.
2. **Storefront Browsing:**
   - **UI:** Displays the specific store's catalog. Clean negative space, Electric Cyan highlights for "Add to Cart" interactions.
   - **API:** `GET /api/v1/store/{storeId}/products`.
3. **Product Details:**
   - **UI:** User navigates to `/store/[storeId]/product/[productId]`. Views images, selects variants.
   - **API:** `GET /api/v1/store/{storeId}/product/{productId}`.

## 6. Cart & Checkout Flow (Customer)
**Domain:** `store.shenodev.tech/checkout`

1. **Cart Management (Client-Side):**
   - **State:** Managed via Zustand or React Context. Cart data is strictly namespaced by `storeId` (e.g., `cart_store_1`, `cart_store_2`) to prevent mixing items from different tenants.
   - **UI:** Sliding drawer or `/cart` page.
2. **Checkout & Order Creation:**
   - **UI:** User enters shipping info and payment details (Stripe Element / PayPal SDK).
   - **API:** `POST /api/v1/user/orders` (Payload includes items, shipping info, and payment intent token).
   - **Backend Logic:** 
     1. Validates inventory levels.
     2. Processes payment via gateway.
     3. Calculates shipping via integrations.
     4. Saves to `orders` table (with `store_id`).
     5. Decrements stock in `products` table.
3. **Confirmation:**
   - **UI:** Redirects to `/store/[storeId]/order-success`. Displays order number.

---

## 7. Data Flow & Security Checkpoints

- **Request Origin:** Every API request passes through Spring Security CORS filters.
- **Tenant Verification:** 
  - Admin endpoints: `store_id` is NEVER read from the request body. It is decoded from the authenticated JWT.
  - User endpoints: `store_id` is read from the URL path (`/store/{storeId}/...`) and used to query isolated data.
- **Error Handling:** All errors return a standard JSON structure (`{ error: string, code: number }`) to be caught by Next.js Error Boundaries and displayed elegantly without breaking the UI.