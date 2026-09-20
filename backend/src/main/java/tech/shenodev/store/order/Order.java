package tech.shenodev.store.order;

import jakarta.persistence.*;
import tech.shenodev.store.common.TenantEntity;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "orders")
public class Order extends TenantEntity {

    @Id
    private String id;

    @Column(name = "user_id")
    private String userId;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();

    public enum Status { PENDING, PAID, SHIPPED, CANCELLED }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
}
