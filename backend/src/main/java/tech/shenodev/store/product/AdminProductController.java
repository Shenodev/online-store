package tech.shenodev.store.product;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import tech.shenodev.store.common.TenantGuard;
import tech.shenodev.store.security.StorePrincipal;

import java.util.List;

/**
 * Tenant-isolated product CRUD at {@code /api/v1/admin/products}.
 * The {@code storeId} is resolved from the JWT principal on every request —
 * it never comes from the request body, path, or query string.
 */
@RestController
@RequestMapping("/api/v1/admin/products")
@Validated
@PreAuthorize("hasRole('ADMIN')")
public class AdminProductController {

    private final ProductService service;

    public AdminProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping
    public List<ProductDtos.ProductResponse> list(
            @AuthenticationPrincipal StorePrincipal principal) {
        return service.list(TenantGuard.requireStoreId(principal.storeId()));
    }

    @GetMapping("/{id}")
    public ProductDtos.ProductResponse get(
            @AuthenticationPrincipal StorePrincipal principal,
            @PathVariable String id) {
        return service.get(TenantGuard.requireStoreId(principal.storeId()), id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductDtos.ProductResponse create(
            @AuthenticationPrincipal StorePrincipal principal,
            @RequestBody @Valid ProductDtos.UpsertProductRequest body) {
        return service.create(TenantGuard.requireStoreId(principal.storeId()), body);
    }

    @PutMapping("/{id}")
    public ProductDtos.ProductResponse update(
            @AuthenticationPrincipal StorePrincipal principal,
            @PathVariable String id,
            @RequestBody @Valid ProductDtos.UpsertProductRequest body) {
        return service.update(TenantGuard.requireStoreId(principal.storeId()), id, body);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @AuthenticationPrincipal StorePrincipal principal,
            @PathVariable String id) {
        service.delete(TenantGuard.requireStoreId(principal.storeId()), id);
    }
}
