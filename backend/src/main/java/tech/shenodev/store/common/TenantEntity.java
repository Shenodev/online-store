package tech.shenodev.store.common;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Base class for every tenant-owned row.
 *
 * <p>Single-database / shared-schema multi-tenancy: each row carries a
 * mandatory {@code store_id} FK to {@code stores(id)}.
 *
 * <p><b>Security contract (see backemd-schema.md):</b> the application layer
 * must populate {@code storeId} exclusively from the validated JWT claims.
 * It is {@code updatable = false} so a tenant can never be reassigned, and
 * request bodies must never bind it (services set it explicitly from the
 * security context).
 */
@MappedSuperclass
public abstract class TenantEntity {

    @NotBlank
    @Size(max = 36)
    @Column(name = "store_id", nullable = false, updatable = false, length = 36)
    private String storeId;

    protected TenantEntity() {}

    protected TenantEntity(String storeId) {
        this.storeId = storeId;
    }

    public String getStoreId() {
        return storeId;
    }

    public void setStoreId(String storeId) {
        this.storeId = storeId;
    }
}
