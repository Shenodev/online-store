package tech.shenodev.store.admin;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import tech.shenodev.store.common.TenantEntity;
import tech.shenodev.store.store.Store;
import java.time.Instant;
import java.util.UUID;

/**
 * Pending secondary-admin invitation, bound to the inviter's store.
 * Token lookup must always be paired with an expiry check.
 */
@Entity
@Table(
    name = "admin_invites",
    indexes = @Index(name = "idx_admin_invites_store_id", columnList = "store_id"),
    uniqueConstraints = @UniqueConstraint(name = "uk_admin_invites_token", columnNames = "token")
)
public class AdminInvite extends TenantEntity {

    @Id
    @Column(length = 36, updatable = false)
    private String id;

    @Email
    @NotBlank
    @Size(max = 255)
    @Column(name = "invited_email", nullable = false, length = 255)
    private String invitedEmail;

    @NotBlank
    @Size(max = 255)
    @Column(nullable = false, length = 255)
    private String token;

    @Future
    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "store_id",
        referencedColumnName = "id",
        insertable = false,
        updatable = false,
        foreignKey = @ForeignKey(name = "fk_admin_invites_store")
    )
    private Store store;

    protected AdminInvite() {}

    public AdminInvite(String storeId, String invitedEmail, String token, Instant expiresAt) {
        super(storeId);
        this.invitedEmail = invitedEmail;
        this.token = token;
        this.expiresAt = expiresAt;
    }

    @PrePersist
    void prePersist() {
        if (id == null) {
            id = UUID.randomUUID().toString();
        }
    }

    public String getId() { return id; }
    public String getInvitedEmail() { return invitedEmail; }
    public String getToken() { return token; }
    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }
    public Store getStore() { return store; }
}
