package tech.shenodev.store.admin;

import jakarta.persistence.*;
import tech.shenodev.store.common.TenantEntity;
import java.time.Instant;

@Entity
@Table(name = "admin_invites")
public class AdminInvite extends TenantEntity {

    @Id
    private String id;

    @Column(name = "invited_email", nullable = false)
    private String invitedEmail;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getInvitedEmail() { return invitedEmail; }
    public void setInvitedEmail(String invitedEmail) { this.invitedEmail = invitedEmail; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }
}
