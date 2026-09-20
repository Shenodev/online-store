-- Shenostore V1: multi-tenant core schema (MySQL 8 / Aiven).
-- Strategy: shared database, shared schema. Every tenant row carries a
-- mandatory store_id FK to stores(id). Tenant isolation is enforced at
-- THREE layers: (1) FK constraints here, (2) store_id-qualified JPA
-- repositories, (3) JWT-derived storeId in services (never request body).
-- Hibernate ddl-auto MUST stay `validate` — this migration owns the DDL.

CREATE TABLE IF NOT EXISTS stores (
    id CHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    custom_domain VARCHAR(255) NULL UNIQUE,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admin_users (
    id CHAR(36) NOT NULL PRIMARY KEY,
    store_id CHAR(36) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_type VARCHAR(16) NOT NULL DEFAULT 'SECONDARY',
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_admin_users_store FOREIGN KEY (store_id)
        REFERENCES stores (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT uk_admin_users_email UNIQUE (email),
    CONSTRAINT chk_admin_users_role CHECK (role_type IN ('PRIMARY', 'SECONDARY')),
    INDEX idx_admin_users_store_id (store_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admin_invites (
    id CHAR(36) NOT NULL PRIMARY KEY,
    store_id CHAR(36) NOT NULL,
    invited_email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP(6) NOT NULL,
    CONSTRAINT fk_admin_invites_store FOREIGN KEY (store_id)
        REFERENCES stores (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT uk_admin_invites_token UNIQUE (token),
    INDEX idx_admin_invites_store_id (store_id),
    INDEX idx_admin_invites_token (token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS platform_users (
    id CHAR(36) NOT NULL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT uk_platform_users_email UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS products (
    id CHAR(36) NOT NULL PRIMARY KEY,
    store_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    image_url VARCHAR(255) NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_products_store FOREIGN KEY (store_id)
        REFERENCES stores (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_products_price CHECK (price >= 0),
    CONSTRAINT chk_products_stock CHECK (stock_quantity >= 0),
    INDEX idx_products_store_id (store_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS orders (
    id CHAR(36) NOT NULL PRIMARY KEY,
    store_id CHAR(36) NOT NULL,
    user_id CHAR(36) NULL,
    status VARCHAR(16) NOT NULL DEFAULT 'PENDING',
    total_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_orders_store FOREIGN KEY (store_id)
        REFERENCES stores (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id)
        REFERENCES platform_users (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_orders_status CHECK (status IN ('PENDING', 'PAID', 'SHIPPED', 'CANCELLED')),
    INDEX idx_orders_store_id (store_id),
    INDEX idx_orders_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_items (
    id CHAR(36) NOT NULL PRIMARY KEY,
    order_id CHAR(36) NOT NULL,
    product_id CHAR(36) NULL,
    quantity INT NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id)
        REFERENCES orders (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id)
        REFERENCES products (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_order_items_qty CHECK (quantity > 0),
    INDEX idx_order_items_order_id (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
