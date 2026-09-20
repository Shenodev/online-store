package tech.shenodev.store.security;

/**
 * Authenticated caller. For {@code ROLE_ADMIN} the {@code storeId} comes from
 * the verified JWT {@code store_id} claim and is the SOLE tenant source for
 * admin reads/writes. For {@code ROLE_USER} it is {@code null} (shoppers are
 * global; tenancy comes from the URL path on storefront endpoints).
 *
 * @param userId  JWT subject
 * @param storeId tenant claim (admin only, never null for admins)
 * @param role    {@code ROLE_ADMIN} or {@code ROLE_USER}
 */
public record StorePrincipal(String userId, String storeId, String role) {

    public boolean isAdmin() {
        return JwtService.ROLE_ADMIN.equals(role);
    }
}
