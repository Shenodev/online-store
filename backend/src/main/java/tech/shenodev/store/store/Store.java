package tech.shenodev.store.store;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.UUID;

/**
 * Root tenant record. Every tenant-owned table references this via
 * {@code store_id} (FK, indexed). No {@code store_id} column here by design.
 */
@Entity
@Table(name = "stores")
public class Store {

    @Id
    @Column(length = 36, updatable = false)
    private String id;

    @NotBlank
    @Size(max = 255)
    @Column(nullable = false, length = 255)
    private String name;

    @Size(max = 255)
    @Column(name = "custom_domain", unique = true, length = 255)
    private String customDomain;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected Store() {}

    public Store(String name) {
        this.name = name;
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
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCustomDomain() { return customDomain; }
    public void setCustomDomain(String customDomain) { this.customDomain = customDomain; }
    public Instant getCreatedAt() { return createdAt; }
}
