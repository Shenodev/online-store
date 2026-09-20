package tech.shenodev.store.common;

import org.springframework.security.access.AccessDeniedException;

/**
 * Central tenant-enforcement helper. Services resolve the caller's
 * {@code storeId} from the validated JWT ({@code StorePrincipal}) and pass
 * it into every repository call via {@code *ByIdAndStoreId} /
 * {@code *AllByStoreId} methods.
 *
 * <p>Rules:
 * <ul>
 *   <li>Admin {@code storeId} comes from JWT claims only — never from the
 *       request body, path, or query string.</li>
 *   <li>Public storefront reads take {@code storeId} from the URL path and
 *       qualify every query with it.</li>
 *   <li>Write paths set {@code entity.setStoreId(jwtStoreId)} explicitly
 *       before {@code save()}.</li>
 * </ul>
 */
public final class TenantGuard {

    private TenantGuard() {}

    public static String requireStoreId(String storeId) {
        if (storeId == null || storeId.isBlank()) {
            throw new AccessDeniedException("Missing tenant context");
        }
        return storeId;
    }

    public static void requireMatch(String jwtStoreId, String entityStoreId) {
        requireStoreId(jwtStoreId);
        if (!jwtStoreId.equals(entityStoreId)) {
            throw new AccessDeniedException("Cross-tenant access denied");
        }
    }
}
