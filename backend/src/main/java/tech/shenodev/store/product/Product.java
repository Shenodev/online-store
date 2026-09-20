package tech.shenodev.store.product;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import tech.shenodev.store.common.TenantEntity;
import tech.shenodev.store.store.Store;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Store catalog row. Tenant-isolated via {@code store_id}
 * (FK to {@code stores(id)}, indexed {@code idx_products_store_id}).
 */
@Entity
@Table(
    name = "products",
    indexes = @Index(name = "idx_products_store_id", columnList = "store_id")
)
public class Product extends TenantEntity {

    @Id
    @Column(length = 36, updatable = false)
    private String id;

    @NotBlank
    @Size(max = 255)
    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull
    @DecimalMin("0.00")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Min(0)
    @Column(name = "stock_quantity", nullable = false)
    private int stockQuantity;

    @Size(max = 255)
    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "store_id",
        referencedColumnName = "id",
        insertable = false,
        updatable = false,
        foreignKey = @ForeignKey(name = "fk_products_store")
    )
    private Store store;

    protected Product() {}

    public Product(String storeId, String title, BigDecimal price, int stockQuantity) {
        super(storeId);
        this.title = title;
        this.price = price;
        this.stockQuantity = stockQuantity;
    }

    @PrePersist
    void prePersist() {
        if (id == null) {
            id = UUID.randomUUID().toString();
        }
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    public String getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public int getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(int stockQuantity) { this.stockQuantity = stockQuantity; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public Store getStore() { return store; }
    public Instant getCreatedAt() { return createdAt; }
}
