# AgentRoles.md

## 1. @LeadArchitect
- **Responsibilities:** Oversees the structural integrity of the Next.js monorepo and Spring Boot backend. Ensures Vercel routing configurations (`vercel.json`) correctly map the subdomains.

## 2. @BackendDev (Spring Boot / MySQL)
- **Responsibilities:** Constructs robust, secure REST APIs. Manages Aiven MySQL connection pooling. Implements the multi-tenant JWT authentication and the email service for admin invites. 

## 3. @FrontendDev (Next.js / Tailwind)
- **Responsibilities:** Implements pixel-perfect UIs based strictly on `Rules.md`. Handles state management, API data fetching, and Next.js App Router file structures for both `store.*` and `admin.*` subdomains.

## 4. @SecurityAuditor
- **Responsibilities:** Reviews all database queries for tenant leakage. Checks API endpoints for proper authorization scopes. Audits Next.js middleware for route protection.