package tech.shenodev.store.admin;

import jakarta.persistence.*;
import tech.shenodev.store.common.TenantEntity;
import java.time.Instant;

@Entity
@Table(name = "admin_users")
public class AdminUser extends TenantEntity {

    @Id
    private String id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "role_type", nullable = false)
    private RoleType roleType = RoleType.SECONDARY;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();

    public enum RoleType { PRIMARY, SECONDARY }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public RoleType getRoleType() { return roleType; }
    public void setRoleType(RoleType roleType) { this.roleType = roleType; }
}
