package tech.shenodev.store.admin;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.server.ResponseStatusException;
import tech.shenodev.store.security.JwtService;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;

/**
 * Secondary-admin onboarding (see AppFlow.md §3).
 *
 * <ul>
 *   <li>{@code invite} — PRIMARY admins only (verified against the DB row,
 *       not the JWT, since both roles share {@code ROLE_ADMIN}). Generates a
 *       256-bit URL-safe token, replaces any pending invite for the same
 *       email in the same store, persists with a TTL, and sends the link.</li>
 *   <li>{@code accept} — public. Consumes the token exactly once: expired or
 *       unknown tokens are rejected, and the new {@code admin_users} row is
 *       created as SECONDARY with the <b>identical</b> {@code store_id} taken
 *       from the invite row — never from the request.</li>
 * </ul>
 */
@Service
@Validated
public class AdminInviteService {

    private final AdminUserRepository admins;
    private final AdminInviteRepository invites;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final InviteMailer mailer;
    private final long expirationHours;
    private final SecureRandom random = new SecureRandom();

    public AdminInviteService(
            AdminUserRepository admins,
            AdminInviteRepository invites,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            InviteMailer mailer,
            @Value("${app.invite.expiration-hours:72}") long expirationHours) {
        this.admins = admins;
        this.invites = invites;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.mailer = mailer;
        this.expirationHours = expirationHours;
    }

    @Transactional
    public AdminDtos.InviteResponse invite(
            String inviterUserId, String storeId, @Valid AdminDtos.InviteRequest request) {
        AdminUser inviter = admins.findByIdAndStoreId(inviterUserId, storeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden"));
        if (inviter.getRoleType() != AdminUser.RoleType.PRIMARY) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only primary admins can invite");
        }

        String email = request.email().trim().toLowerCase();
        if (admins.findByEmail(email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        // Re-invite replaces the pending invite so only one live token exists.
        invites.deleteByStoreIdAndInvitedEmail(storeId, email);

        String token = generateToken();
        AdminInvite invite = invites.save(new AdminInvite(
                storeId, email, token, Instant.now().plus(expirationHours, ChronoUnit.HOURS)));

        mailer.sendInvite(email, token);
        return new AdminDtos.InviteResponse(email, invite.getExpiresAt());
    }

    @Transactional
    public AdminDtos.RegisterResponse accept(@NotBlank String token, @NotBlank String password) {
        AdminInvite invite = invites.findByToken(token.trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid invite token"));
        if (invite.getExpiresAt().isBefore(Instant.now())) {
            invites.delete(invite);
            throw new ResponseStatusException(HttpStatus.GONE, "Invite token expired");
        }
        if (admins.findByEmail(invite.getInvitedEmail()).isPresent()) {
            invites.delete(invite);
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        AdminUser admin = admins.save(new AdminUser(
                invite.getStoreId(),
                invite.getInvitedEmail(),
                passwordEncoder.encode(password),
                AdminUser.RoleType.SECONDARY));
        invites.delete(invite);

        String jwt = jwtService.issueAdminToken(admin.getId(), invite.getStoreId());
        return new AdminDtos.RegisterResponse(jwt, invite.getStoreId(), admin.getId());
    }

    /** 256-bit cryptographically secure URL-safe token (43 chars, no padding). */
    String generateToken() {
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
