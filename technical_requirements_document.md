# Technical Requirements Document (TRD)

**Project Name:** Shenostore
**Version:** 1.0
**Date:** September 2026

## 1. System Architecture

Shenostore follows a decoupled, microservices-inspired architecture tailored for a serverless deployment model. 

### 1.1 Components
*   **User Storefront (`store.shenodev.tech`):** Client-facing Next.js application. Handles product discovery, cart management, and checkout.
*   **Admin Dashboard (`admin.store.shenodev.tech`):** Admin-facing Next.js application. Handles store provisioning, team management, and product CRUD.
*   **Backend API (`api.store.shenodev.tech`):** Spring Boot REST API that serves as the single source of truth, enforcing multi-tenancy and business logic.
*   **Database:** Single-instance Aiven MySQL database utilizing logical separation (tenant columns) for multi-tenancy.

## 2. Technology Stack

*   **Frontend Framework:** Next.js (App Router), React, TypeScript.
*   **Styling:** Tailwind CSS.
*   **Backend Framework:** Java Spring Boot (compiled/configured for stateless serverless execution where applicable on Vercel).
*   **Data Persistence:** MySQL (Aiven) via Spring Data JPA / Hibernate.
*   **Authentication:** Spring Security with JSON Web Tokens (JWT).
*   **Infrastructure/Hosting:** Vercel (Frontends & Backend endpoints), Aiven (Database).

## 3. Database Schema & Multi-Tenancy Strategy

Shenostore uses a **Shared Database, Shared Schema** approach for multi-tenancy. 

### 3.1 Tenant Isolation Rule
*   All operational tables (`products`, `orders`, `admin_users`, `categories`) **MUST** include a `store_id` column as a foreign key referencing the `stores` table.
*   Application-level enforcement: Hibernate/JPA filters or aspect-oriented programming (AOP) must automatically append `WHERE store_id = :tenantId` to all queries based on the authenticated user's context.

### 3.2 Core Tables (Abridged)
*   **`stores`**: `id` (PK), `name`, `subdomain`, `custom_domain`, `created_at`
*   **`users`**: `id` (PK), `email`, `password_hash`, `role` (ADMIN/USER), `store_id` (FK, nullable for platform users), `created_at`
*   **`products`**: `id` (PK), `store_id` (FK), `title`, `description`, `price`, `stock_count`, `created_at`
*   **`orders`**: `id` (PK), `store_id` (FK), `user_id` (FK), `total_amount`, `status`, `created_at`

## 4. API & Integration Specifications

### 4.1 REST API Standards
*   All endpoints must be prefixed with `/api/v1/`.
*   Payloads and responses must be in JSON format.
*   Use standard HTTP status codes (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Error).

### 4.2 Security Constraints
*   **Admin Endpoints (`/api/v1/admin/**`):** Require a valid JWT with `ROLE_ADMIN`. The `store_id` is extracted *strictly* from the JWT claims, never from the request body, to prevent cross-tenant parameter tampering.
*   **User Endpoints (`/api/v1/user/**`):** Require a valid JWT with `ROLE_USER`.
*   **Public Endpoints (`/api/v1/public/**`):** Open access for store catalog viewing.

### 4.3 Payment Gateway Integration (v1.0 Scope)
*   Integration with Stripe/PayPal via backend webhooks.
*   Frontend utilizes official SDKs (e.g., Stripe Elements) to tokenize cards securely. Raw credit card data must NEVER touch the Shenostore backend.

## 5. UI/UX Design System Implementation

The frontend must strictly adhere to the following Tailwind configuration:
*   **Fonts:** 
    *   Headings (h1-h6): `font-family: 'Sora', sans-serif;`
    *   Body/Inputs: `font-family: 'Inter', sans-serif;`
*   **Colors:**
    *   `bg-slate-900` (`#0F172A`) for main backgrounds.
    *   `bg-slate-800` (`#1E293B`) for cards/surfaces.
    *   `text-cyan-500` / `bg-cyan-500` (`#06B6D4`) for primary actions/accents.
*   **Structural CSS:**
    *   All interactive elements (buttons, inputs, cards) must use `rounded-xl`.
    *   Avoid utility classes like `shadow-lg` or `drop-shadow` that create 3D depth. Use borders (e.g., `border border-slate-700`) to separate overlapping surfaces.

## 6. Infrastructure & Deployment (Vercel)

### 6.1 Routing & Multi-Zone Setup
*   The project will use Vercel's Edge Middleware to inspect the `Host` header.
*   If `Host` matches `admin.store.shenodev.tech`, rewrite to the Admin Next.js application.
*   If `Host` matches `store.shenodev.tech` or a registered custom domain, rewrite to the User Next.js application.
*   If `Host` matches `api.store.shenodev.tech`, route to the Spring Boot serverless functions.

### 6.2 Backend Deployment Configuration
*   Since Spring Boot traditionally runs as a persistent server, it must be adapted for Vercel's serverless environment using tools like AWS Serverless Java Container or by utilizing Vercel's Edge/Serverless functions as a proxy to a containerized Aiven/other host if the cold-start times are unacceptable for the UX. 
*   Connection pooling (e.g., HikariCP) must be carefully configured to avoid exhausting Aiven MySQL connections during serverless cold starts.

## 7. Security Standards
*   **CORS:** Strictly whitelist `*.shenodev.tech` and dynamically queried custom domains.
*   **Input Validation:** Implement `jakarta.validation` on all Spring Boot DTOs and `zod` schemas on Next.js forms.
*   **CSRF:** Implement stateless CSRF protection for non-GET requests if session cookies are used.