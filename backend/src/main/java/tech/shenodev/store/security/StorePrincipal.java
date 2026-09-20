package tech.shenodev.store.security;

public record StorePrincipal(String userId, String storeId, String role) {
}
