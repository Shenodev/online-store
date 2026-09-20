package tech.shenodev.store.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtServiceTest {

    private static final String SECRET = "test-secret-that-is-at-least-32-bytes-long!";
    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(SECRET, 3_600_000);
    }

    @Test
    void adminTokenCarriesStoreId() {
        String token = jwtService.issueAdminToken("user-1", "store-1");
        StorePrincipal principal = jwtService.authenticate(token);

        assertThat(principal.userId()).isEqualTo("user-1");
        assertThat(principal.storeId()).isEqualTo("store-1");
        assertThat(principal.role()).isEqualTo(JwtService.ROLE_ADMIN);
    }

    @Test
    void userTokenHasNoTenant() {
        String token = jwtService.issueUserToken("shopper-1");
        StorePrincipal principal = jwtService.authenticate(token);

        assertThat(principal.role()).isEqualTo(JwtService.ROLE_USER);
        assertThat(principal.storeId()).isNull();
    }

    @Test
    void adminTokenWithoutStoreIdIsRejected() {
        SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
        Date now = new Date();
        String token = Jwts.builder()
                .subject("user-1")
                .claim(JwtService.CLAIM_ROLE, JwtService.ROLE_ADMIN)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + 3_600_000))
                .signWith(key)
                .compact();

        assertThatThrownBy(() -> jwtService.authenticate(token))
                .isInstanceOf(io.jsonwebtoken.JwtException.class)
                .hasMessageContaining("store_id");
    }

    @Test
    void tamperedTokenIsRejected() {
        String token = jwtService.issueUserToken("shopper-1") + "tampered";

        assertThatThrownBy(() -> jwtService.authenticate(token))
                .isInstanceOf(io.jsonwebtoken.JwtException.class);
    }
}
