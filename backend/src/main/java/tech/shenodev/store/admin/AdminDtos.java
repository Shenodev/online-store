package tech.shenodev.store.admin;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AdminDtos {

    public record RegisterRequest(
            @NotBlank(message = "Store name is required")
            @Size(min = 2, max = 255, message = "Store name must be 2-255 characters")
            String storeName,

            @NotBlank(message = "Email is required")
            @Email(message = "Valid email required")
            @Size(max = 255)
            String email,

            @NotBlank(message = "Password is required")
            @Size(min = 8, max = 128, message = "Password must be 8-128 characters")
            String password) {}

    public record RegisterResponse(String token, String storeId, String adminId) {}

    public record InviteRequest(
            @NotBlank(message = "Email is required")
            @Email(message = "Valid email required")
            @Size(max = 255)
            String email) {}

    public record AcceptInviteRequest(
            @NotBlank(message = "Token is required") String token,
            @NotBlank(message = "Password is required")
            @Size(min = 8, max = 128, message = "Password must be 8-128 characters")
            String password) {}

    public record InviteResponse(String email, java.time.Instant expiresAt) {}
}
