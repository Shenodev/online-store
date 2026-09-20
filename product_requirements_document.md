# Product Requirements Document (PRD)

**Project Name:** Shenostore
**Document Version:** 1.0
**Date:** September 2026

## 1. Executive Summary

Shenostore is a multi-tenant e-commerce SaaS platform designed to allow independent merchants to manage their own online storefronts under a centralized infrastructure. The platform provides a dedicated administrative dashboard for store owners and a unified storefront interface for end-users to discover and purchase products from specific stores.

## 2. Objectives & Goals

* **Empower Merchants:** Provide a seamless, isolated environment for merchants to manage products, view analytics, and collaborate with team members.

* **Unified User Experience:** Offer shoppers a single platform to browse multiple independent stores with a consistent, modern, and high-performance user interface.

* **Scalable Architecture:** Build a robust, multi-tenant system using Next.js and Spring Boot, deployed on Vercel, capable of scaling across multiple domains and tenants securely.

## 3. Target Audience

1. **Primary Admins (Store Owners):** Entrepreneurs looking to start or migrate their online store without managing underlying infrastructure.

2. **Secondary Admins (Staff):** Employees or managers invited by the store owner to help manage products and operations.

3. **End Users (Shoppers):** Customers who want to browse catalogs, add items to their cart, and securely checkout from specific Shenostore merchants.

## 4. Key Features & Requirements

### 4.1. Admin Dashboard (`admin.store.shenodev.tech`)

* **Store Provisioning:** Registering an account automatically provisions a new isolated store environment (tenant).

* **Authentication:** Secure login via JWT.

* **Team Management:** Primary admins can invite secondary users via email. Invited users must be securely bound to the primary admin's `store_id`.

* **Product Management:** Full CRUD (Create, Read, Update, Delete) capabilities for products. All database interactions must strictly enforce tenant isolation (`store_id`).

* **Analytics/Overview:** A dashboard displaying basic store metrics.

* **Custom Domain Mapping:** Provide admins the ability to link their own custom domain (e.g., `www.mystore.com`) to their Shenostore storefront instead of relying on the default subdomain.

### 4.2. User Storefront (`store.shenodev.tech` or Custom Domain)

* **Global Authentication:** Users can register and log in to the main Shenostore platform.

* **Store Selector:** A landing page displaying all available active stores on the platform (applicable on the main domain).

* **Dynamic Store Navigation:** Routing users to specific stores to view that merchant's isolated catalog.

* **Shopping Cart:** Client-side cart management that isolates sessions by `storeId` (preventing mixed-store checkouts).

* **Checkout Flow & Payment Gateway Integrations:** Secure order processing integrating with major payment gateways (e.g., Stripe, PayPal) to handle transactions directly within the v1.0 release.

## 5. Technical Requirements

### 5.1. Tech Stack

* **Frontend:** Next.js (App Router), React, TypeScript.

* **Backend:** Java Spring Boot (built for serverless/lightweight Vercel deployment).

* **Database:** MySQL, hosted on Aiven.

* **Deployment:** Vercel (Frontend, Backend Gateway, Routing, and Edge functions for Custom Domain mapping).

### 5.2. Design System & UI/UX

* **Typography:**

  * Headings: 'Sora'

  * Body/Inputs/Labels: 'Inter'

* **Color Palette:**

  * Background: Deep Slate (`#0F172A`)

  * Surfaces: Secondary Slate (`#1E293B`)

  * Accents: Electric Cyan (`#06B6D4`)

* **Styling Rules:** Tailwind CSS exclusively. Components must use `rounded-xl` corners. Abundant, clean negative space. **Strictly NO 3D elements, bevels, or heavy shadows.** Flat, modern design.

* **Branding:** Shenostore 'S' logo to be used as the favicon and primary brand mark.

### 5.3. Security & Multi-Tenancy

* **Tenant Isolation:** Every core database table must include a `store_id`. Backend queries must explicitly filter by the JWT-provided `store_id`. Client payloads must never dictate the `store_id` for admin mutations.

* **Authentication:** Stateless JWT stored securely (HTTP-only cookies preferred, or strict Authorization headers).

* **CORS:** API must only accept requests from `store.shenodev.tech`, `admin.store.shenodev.tech`, and dynamically approved custom domains.

## 6. Future Considerations (Out of Scope for v1.0)

* (Placeholder for future phases, e.g., AI-driven product recommendations, native mobile applications, global multi-currency support).