package tech.shenodev.store.admin;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import tech.shenodev.store.common.TenantGuard;
import tech.shenodev.store.security.StorePrincipal;

/**
 * Store provisioning + team invites. Registration and invite-accept are
 * public (permitAll in {@code SecurityConfig}); every other method requires
 * {@code ROLE_ADMIN} and a JWT-bound {@code store_id}.
 */
@RestController
@RequestMapping("/api/v1/admin")
@Validated
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    // Service wiring intentionally left to the service layer task.

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("permitAll()")
    public void register(@RequestBody @Validated AdminDtos.RegisterRequest body) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @PostMapping("/invite")
    @ResponseStatus(HttpStatus.CREATED)
    public void invite(
            @AuthenticationPrincipal StorePrincipal principal,
            @RequestBody @Validated AdminDtos.InviteRequest body) {
        String storeId = TenantGuard.requireStoreId(principal.storeId());
        throw new UnsupportedOperationException("Not implemented yet for store " + storeId);
    }

    @PostMapping("/invite/accept")
    @PreAuthorize("permitAll()")
    public void acceptInvite(@RequestBody @Validated AdminDtos.AcceptInviteRequest body) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
