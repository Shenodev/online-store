package tech.shenodev.store.product;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * Tenant-isolated product management. Every method takes the caller's
 * {@code storeId} (resolved from the JWT in the controller) and every query
 * is store-qualified — {@code WHERE store_id = ?} is appended by the derived
 * repository methods, so a caller can never read or mutate another tenant's
 * rows. Unknown ids and cross-tenant ids are indistinguishable 404s.
 */
@Service
@Validated
public class ProductService {

    private final ProductRepository products;

    public ProductService(ProductRepository products) {
        this.products = products;
    }

    @Transactional(readOnly = true)
    public List<ProductDtos.ProductResponse> list(String storeId) {
        return products.findAllByStoreId(storeId).stream()
                .map(ProductDtos.ProductResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductDtos.ProductResponse get(String storeId, String id) {
        return ProductDtos.ProductResponse.from(require(storeId, id));
    }

    @Transactional
    public ProductDtos.ProductResponse create(
            String storeId, @Valid ProductDtos.UpsertProductRequest request) {
        Product product = new Product(
                storeId, request.title().trim(), request.price(), request.stockQuantity());
        product.setDescription(request.description());
        product.setImageUrl(request.imageUrl());
        return ProductDtos.ProductResponse.from(products.save(product));
    }

    @Transactional
    public ProductDtos.ProductResponse update(
            String storeId, String id, @Valid ProductDtos.UpsertProductRequest request) {
        Product product = require(storeId, id);
        product.setTitle(request.title().trim());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setStockQuantity(request.stockQuantity());
        product.setImageUrl(request.imageUrl());
        return ProductDtos.ProductResponse.from(products.save(product));
    }

    @Transactional
    public void delete(String storeId, String id) {
        products.delete(require(storeId, id));
    }

    private Product require(String storeId, String id) {
        return products.findByIdAndStoreId(id, storeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
    }
}
