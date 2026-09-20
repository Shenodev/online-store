package tech.shenodev.store.store;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import tech.shenodev.store.product.ProductDtos;

/**
 * Public storefront endpoints (permitAll in {@code SecurityConfig}).
 * Pagination is capped (max 50/page) to protect the Aiven connection pool;
 * {@code q} filters product titles case-insensitively within the path store.
 */
@RestController
@RequestMapping("/api/v1")
@Validated
public class PublicStoreController {

    private final StorefrontService storefront;

    public PublicStoreController(StorefrontService storefront) {
        this.storefront = storefront;
    }

    @GetMapping("/stores")
    public Page<StoreDtos.StoreResponse> listStores(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(50) int size) {
        return storefront.listStores(PageRequest.of(page, size, Sort.by("createdAt").descending()));
    }

    @GetMapping("/store/{storeId}/products")
    public Page<ProductDtos.ProductResponse> storeProducts(
            @PathVariable String storeId,
            @RequestParam(required = false) @Size(max = 100) String q,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(50) int size) {
        return storefront.storeProducts(
                storeId, q, PageRequest.of(page, size, Sort.by("createdAt").descending()));
    }

    @GetMapping("/store/{storeId}/product/{productId}")
    public ProductDtos.ProductResponse productDetail(
            @PathVariable String storeId,
            @PathVariable String productId) {
        return storefront.productDetail(storeId, productId);
    }
}
