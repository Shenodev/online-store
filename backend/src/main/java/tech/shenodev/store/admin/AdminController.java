package tech.shenodev.store.admin;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import tech.shenodev.store.security.StorePrincipal;

@RestController
@RequestMapping("/api/v1/admin")
@Validated
public class AdminController {

    // Service wiring intentionally left to @BackendDev.

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void register(@RequestBody @Validated AdminDtos.RegisterRequest body) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @PostMapping("/invite")
    @ResponseStatus(HttpStatus.CREATED)
    public void invite(
            @AuthenticationPrincipal StorePrincipal principal,
            @RequestBody @Validated AdminDtos.InviteRequest body) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @PostMapping("/invite/accept")
    public void acceptInvite(@RequestBody @Validated AdminDtos.AcceptInviteRequest body) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
