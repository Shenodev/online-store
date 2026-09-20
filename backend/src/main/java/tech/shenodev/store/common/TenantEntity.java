package tech.shenodev.store.common;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;

/**
 * Base class for all tenant-owned entities.
 * SECURITY: storeId must come from the validated JWT, never from the request body.
 */
@MappedSuperclass
public abstract class TenantEntity {

    @Column(name = "store_id", nullable = false, updatable = false)
    private String storeId;

    public String getStoreId() {
        return storeId;
    }

    public void setStoreId(String storeId) {
        this.storeId = storeId;
    }
}
