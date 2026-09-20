package tech.shenodev.store.order;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import tech.shenodev.store.common.TenantEntity;
import tech.shenodev.store.store.Store;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Customer order, tenant-scoped via {@code store_id}
 * (FK to {@code stores(id)}, indexed {@code idx_orders_store_id}).
 */
@Entity
@Table(
    name = "orders",
    indexes = @Index(name = "idx_orders_store_id", columnList = "store_id")
)
public class Order extends TenantEntity {

    @Id
    @Column(length = 36, updatable = false)
    private String id;

    @Size(max = 36)
    @Column(name = "user_id", length = 36)
    private String userId;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private Status status = Status.PENDING;

    @NotNull
    @DecimalMin("0.00")
    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "store_id",
        referencedColumnName = "id",
        insertable = false,
        updatable = false,
        foreignKey = @ForeignKey(name = "fk_orders_store")
    )
    private Store store;

    public enum Status { PENDING, PAID, SHIPPED, CANCELLED }

    protected Order() {}

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
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public Store getStore() { return store; }
    public Instant getCreatedAt() { return createdAt; }
}
