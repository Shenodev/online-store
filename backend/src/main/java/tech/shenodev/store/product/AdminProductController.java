package tech.shenodev.store.product;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import tech.shenodev.store.common.TenantGuard;
import tech.shenodev.store.security.StorePrincipal;

import java.math.BigDecimal;
import java.util.List;

/**
 * Tenant-isolated product CRUD. Every handler resolves {@code storeId} from
 * the JWT principal and qualifies the repository call — the tenant never
 * comes from the request body.
 */
@RestController
@RequestMapping("/api/v1/admin/products")
@Validated
@PreAuthorize("hasRole('ADMIN')")
public class AdminProductController {

    public record CreateProductRequest(
            @NotBlank @Size(max = 255) String title,
            String description,
            @NotNull @DecimalMin("0.00") BigDecimal price,
            @Min(0) int stockQuantity,
            @Size(max = 255) String imageUrl) {}

    // Service wiring intentionally left to the service layer task.

    @GetMapping
    public List<?> list(@AuthenticationPrincipal StorePrincipal principal) {
        String storeId = TenantGuard.requireStoreId(principal.storeId());
        throw new UnsupportedOperationException("Not implemented yet for store " + storeId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void create(
            @AuthenticationPrincipal StorePrincipal principal,
            @RequestBody @Valid CreateProductRequest body) {
        TenantGuard.requireStoreId(principal.storeId());
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @PutMapping("/{id}")
    public void update(
            @AuthenticationPrincipal StorePrincipal principal,
            @PathVariable String id,
            @RequestBody @Valid CreateProductRequest body) {
        TenantGuard.requireStoreId(principal.storeId());
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @AuthenticationPrincipal StorePrincipal principal,
            @PathVariable String id) {
        TenantGuard.requireStoreId(principal.storeId());
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
