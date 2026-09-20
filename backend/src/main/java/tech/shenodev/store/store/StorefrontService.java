package tech.shenodev.store.store;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import tech.shenodev.store.product.ProductDtos;
import tech.shenodev.store.product.ProductRepository;

/**
 * Public storefront reads (no authentication). Tenancy comes from the URL
 * path {@code storeId} and qualifies every product query, so catalogs stay
 * isolated even though the endpoints are open. Unknown stores and
 * cross-tenant product ids are indistinguishable 404s.
 */
@Service
public class StorefrontService {

    private final StoreRepository stores;
    private final ProductRepository products;

    public StorefrontService(StoreRepository stores, ProductRepository products) {
        this.stores = stores;
        this.products = products;
    }

    @Transactional(readOnly = true)
    public Page<StoreDtos.StoreResponse> listStores(Pageable pageable) {
        return stores.findAll(pageable).map(StoreDtos.StoreResponse::from);
    }

    @Transactional(readOnly = true)
    public Page<ProductDtos.ProductResponse> storeProducts(
            String storeId, String query, Pageable pageable) {
        requireStore(storeId);
        if (query == null || query.isBlank()) {
            return products.findByStoreId(storeId, pageable).map(ProductDtos.ProductResponse::from);
        }
        return products
                .findByStoreIdAndTitleContainingIgnoreCase(storeId, query.trim(), pageable)
                .map(ProductDtos.ProductResponse::from);
    }

    @Transactional(readOnly = true)
    public ProductDtos.ProductResponse productDetail(String storeId, String productId) {
        return products.findByIdAndStoreId(productId, storeId)
                .map(ProductDtos.ProductResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
    }

    private void requireStore(String storeId) {
        if (!stores.existsById(storeId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Store not found");
        }
    }
}
