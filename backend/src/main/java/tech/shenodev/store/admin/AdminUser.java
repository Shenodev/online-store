package tech.shenodev.store.admin;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import tech.shenodev.store.common.TenantEntity;
import tech.shenodev.store.store.Store;
import java.time.Instant;
import java.util.UUID;

/**
 * Administrator bound to exactly one store.
 *
 * <p>Tenancy: {@code store_id} FK to {@code stores(id)}, indexed
 * ({@code idx_admin_users_store_id}). The {@code store} association is
 * read-only (insertable/updatable = false) so {@code storeId} remains the
 * single write path, always set from JWT claims in the service layer.
 */
@Entity
@Table(
    name = "admin_users",
    indexes = @Index(name = "idx_admin_users_store_id", columnList = "store_id"),
    uniqueConstraints = @UniqueConstraint(name = "uk_admin_users_email", columnNames = "email")
)
public class AdminUser extends TenantEntity {

    @Id
    @Column(length = 36, updatable = false)
    private String id;

    @Email
    @NotBlank
    @Size(max = 255)
    @Column(nullable = false, length = 255)
    private String email;

    @NotBlank
    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "role_type", nullable = false, length = 16)
    private RoleType roleType = RoleType.SECONDARY;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "store_id",
        referencedColumnName = "id",
        insertable = false,
        updatable = false,
        foreignKey = @ForeignKey(name = "fk_admin_users_store")
    )
    private Store store;

    public enum RoleType { PRIMARY, SECONDARY }

    protected AdminUser() {}

    public AdminUser(String storeId, String email, String passwordHash, RoleType roleType) {
        super(storeId);
        this.email = email;
        this.passwordHash = passwordHash;
        this.roleType = roleType;
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
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public RoleType getRoleType() { return roleType; }
    public void setRoleType(RoleType roleType) { this.roleType = roleType; }
    public Store getStore() { return store; }
    public Instant getCreatedAt() { return createdAt; }
}
