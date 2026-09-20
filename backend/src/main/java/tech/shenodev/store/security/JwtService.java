package tech.shenodev.store.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Stateless JWT issuer/verifier (jjwt 0.12.x).
 *
 * <p>Roles: {@code ROLE_ADMIN} (store staff) and {@code ROLE_USER} (shoppers).
 * Admin tokens MUST carry the tenant in the {@code store_id} claim — the
 * backend never accepts a tenant identifier from request bodies, paths, or
 * query strings on admin endpoints. User tokens carry no tenant.
 */
@Component
public class JwtService {

    public static final String ROLE_ADMIN = "ROLE_ADMIN";
    public static final String ROLE_USER = "ROLE_USER";

    public static final String CLAIM_ROLE = "role";
    public static final String CLAIM_STORE_ID = "store_id";

    private final SecretKey key;
    private final long expirationMs;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-ms:86400000}") long expirationMs) {
        byte[] bytes = secret.getBytes(StandardCharsets.UTF_8);
        if (bytes.length < 32) {
            throw new IllegalStateException("app.jwt.secret must be at least 256 bits");
        }
        this.key = Keys.hmacShaKeyFor(bytes);
        this.expirationMs = expirationMs;
    }

    /** Issues an admin token bound to one store. */
    public String issueAdminToken(String userId, String storeId) {
        if (storeId == null || storeId.isBlank()) {
            throw new IllegalArgumentException("Admin token requires a store_id");
        }
        return build(userId, ROLE_ADMIN, storeId);
    }

    /** Issues a global shopper token (no tenant). */
    public String issueUserToken(String userId) {
        return build(userId, ROLE_USER, null);
    }

    private String build(String userId, String role, String storeId) {
        Date now = new Date();
        var builder = Jwts.builder()
                .subject(userId)
                .claim(CLAIM_ROLE, role)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expirationMs))
                .signWith(key);
        if (storeId != null) {
            builder.claim(CLAIM_STORE_ID, storeId);
        }
        return builder.compact();
    }

    /**
     * Verifies signature + expiry and maps claims to a principal.
     * Rejects admin tokens that lack {@code store_id}.
     *
     * @throws JwtException on any invalid, expired, or tenant-less admin token
     */
    public StorePrincipal authenticate(String token) throws JwtException {
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        String role = claims.get(CLAIM_ROLE, String.class);
        if (!ROLE_ADMIN.equals(role) && !ROLE_USER.equals(role)) {
            throw new JwtException("Unknown role claim");
        }
        String storeId = claims.get(CLAIM_STORE_ID, String.class);
        if (ROLE_ADMIN.equals(role) && (storeId == null || storeId.isBlank())) {
            throw new JwtException("Admin token missing store_id");
        }
        return new StorePrincipal(claims.getSubject(), storeId, role);
    }
}
