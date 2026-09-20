package tech.shenodev.store.store;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import tech.shenodev.store.product.Product;
import tech.shenodev.store.product.ProductDtos;
import tech.shenodev.store.product.ProductRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StorefrontServiceTest {

    @Mock
    private StoreRepository stores;

    @Mock
    private ProductRepository products;

    private StorefrontService service;
    private final Pageable pageable = PageRequest.of(0, 20);

    @BeforeEach
    void setUp() {
        service = new StorefrontService(stores, products);
    }

    @Test
    void listsStores() {
        var store = new Store("Acme");
        when(stores.findAll(any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(store)));

        assertThat(service.listStores(pageable)).hasSize(1);
    }

    @Test
    void productsWithoutQueryUsesUnfilteredTenantQuery() {
        var product = new Product("store-1", "Widget", new BigDecimal("9.99"), 5);
        when(stores.existsById("store-1")).thenReturn(true);
        when(products.findByStoreId(eq("store-1"), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(product)));

        var page = service.storeProducts("store-1", null, pageable);

        assertThat(page.getContent()).hasSize(1);
        assertThat(page.getContent().get(0).title()).isEqualTo("Widget");
    }

    @Test
    void productsWithQuerySearchesTitlesWithinTenant() {
        var product = new Product("store-1", "Widget", new BigDecimal("9.99"), 5);
        when(stores.existsById("store-1")).thenReturn(true);
        when(products.findByStoreIdAndTitleContainingIgnoreCase(
                        eq("store-1"), eq("wid"), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(product)));

        var page = service.storeProducts("store-1", "wid", pageable);

        assertThat(page.getContent()).hasSize(1);
        verify(products).findByStoreIdAndTitleContainingIgnoreCase(
                eq("store-1"), eq("wid"), any(Pageable.class));
    }

    @Test
    void unknownStoreIsNotFound() {
        when(stores.existsById("ghost")).thenReturn(false);

        assertThatThrownBy(() -> service.storeProducts("ghost", null, pageable))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(e -> assertThat(((ResponseStatusException) e).getStatusCode())
                        .isEqualTo(HttpStatus.NOT_FOUND));
    }

    @Test
    void crossTenantProductDetailIsNotFound() {
        when(products.findByIdAndStoreId("p-1", "store-2")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.productDetail("store-2", "p-1"))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(e -> assertThat(((ResponseStatusException) e).getStatusCode())
                        .isEqualTo(HttpStatus.NOT_FOUND));
    }

    @Test
    void productDetailReturnsTenantRow() {
        var product = new Product("store-1", "Widget", new BigDecimal("9.99"), 5);
        when(products.findByIdAndStoreId("p-1", "store-1")).thenReturn(Optional.of(product));

        ProductDtos.ProductResponse response = service.productDetail("store-1", "p-1");

        assertThat(response.title()).isEqualTo("Widget");
    }
}
