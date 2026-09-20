package tech.shenodev.store.store;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "stores")
public class Store {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(name = "custom_domain", unique = true)
    private String customDomain;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCustomDomain() { return customDomain; }
    public void setCustomDomain(String customDomain) { this.customDomain = customDomain; }
    public Instant getCreatedAt() { return createdAt; }
}
