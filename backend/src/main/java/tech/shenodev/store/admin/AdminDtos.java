package tech.shenodev.store.admin;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AdminDtos {

    public record RegisterRequest(
            @NotBlank String storeName,
            @Email @NotBlank String email,
            @Size(min = 8) String password) {}

    public record InviteRequest(@Email @NotBlank String email) {}

    public record AcceptInviteRequest(
            @NotBlank String token,
            @Size(min = 8) String password) {}
}
