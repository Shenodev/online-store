# BackendSchema.md

## 1. Database Architecture & Multi-Tenancy Strategy
**Database:** MySQL (Hosted on Aiven)
**Strategy:** Single Database, Column-Level Isolation. Every tenant (Store) shares the same database, but all tenant-specific tables possess a mandatory `store_id` foreign key.

**CRITICAL SECURITY RULE:** The application layer (Spring Boot) MUST enforce the `store_id` filter on every read/write operation. The `store_id` for admin actions must be extracted from the validated JWT claims, never from the request body.

---

## 2. Core Schema Definitions

### 2.1 Table: `stores`
The root tenant record.
- `id` (VARCHAR/UUID, Primary Key)
- `name` (VARCHAR 255, Not Null)
- `custom_domain` (VARCHAR 255, Nullable, Unique)
- `created_at` (TIMESTAMP, Default CURRENT_TIMESTAMP)

### 2.2 Table: `admin_users`
Administrators managing a specific store.
- `id` (VARCHAR/UUID, Primary Key)
- `store_id` (VARCHAR/UUID, Foreign Key -> stores(id), Indexed)
- `email` (VARCHAR 255, Not Null, Unique)
- `password_hash` (VARCHAR 255, Not Null)
- `role_type` (ENUM: 'PRIMARY', 'SECONDARY') - *Primary can invite others.*
- `created_at` (TIMESTAMP)

### 2.3 Table: `admin_invites`
Stores active invitation tokens for secondary admins.
- `id` (VARCHAR/UUID, Primary Key)
- `store_id` (VARCHAR/UUID, Foreign Key -> stores(id), Indexed)
- `invited_email` (VARCHAR 255, Not Null)
- `token` (VARCHAR 255, Not Null, Unique)
- `expires_at` (TIMESTAMP, Not Null)

### 2.4 Table: `platform_users` (Customers)
End-users who purchase from stores. Registered globally.
- `id` (VARCHAR/UUID, Primary Key)
- `email` (VARCHAR 255, Not Null, Unique)
- `password_hash` (VARCHAR 255, Not Null)
- `created_at` (TIMESTAMP)

### 2.5 Table: `products`
The inventory for each store.
- `id` (VARCHAR/UUID, Primary Key)
- `store_id` (VARCHAR/UUID, Foreign Key -> stores(id), Indexed)
- `title` (VARCHAR 255, Not Null)
- `description` (TEXT)
- `price` (DECIMAL 10,2, Not Null)
- `stock_quantity` (INT, Default 0)
- `image_url` (VARCHAR 255)
- `created_at` (TIMESTAMP)

### 2.6 Table: `orders` & `order_items`
**orders**
- `id` (VARCHAR/UUID, Primary Key)
- `store_id` (VARCHAR/UUID, Foreign Key -> stores(id), Indexed)
- `user_id` (VARCHAR/UUID, Foreign Key -> platform_users(id))
- `status` (ENUM: 'PENDING', 'PAID', 'SHIPPED', 'CANCELLED')
- `total_amount` (DECIMAL 10,2, Not Null)
- `created_at` (TIMESTAMP)

**order_items**
- `id` (VARCHAR/UUID, Primary Key)
- `order_id` (VARCHAR/UUID, Foreign Key -> orders(id), Indexed)
- `product_id` (VARCHAR/UUID, Foreign Key -> products(id))
- `quantity` (INT, Not Null)
- `price_at_purchase` (DECIMAL 10,2, Not Null)

---

## 3. Spring Boot JPA & Security Guidelines

### 3.1 Entity Design
All entities belonging to a store (Products, Orders, AdminUsers) must extend a mapped superclass to ensure they always contain the `store_id`.

```java
@MappedSuperclass
public abstract class TenantEntity {
    @Column(name = "store_id", nullable = false, updatable = false)
    private String storeId;
    
    // Getters and Setters
}