package tech.shenodev.store.product;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository products;

    private ProductService service;

    @BeforeEach
    void setUp() {
        service = new ProductService(products);
    }

    private ProductDtos.UpsertProductRequest request() {
        return new ProductDtos.UpsertProductRequest(
                "Widget", "Desc", new BigDecimal("9.99"), 5, null);
    }

    private Product product(String storeId, String id) {
        Product p = new Product(storeId, "Widget", new BigDecimal("9.99"), 5);
        try {
            var field = Product.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(p, id);
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
        return p;
    }

    @Test
    void createStampsJwtStoreId() {
        when(products.save(any(Product.class))).thenAnswer(i -> i.getArgument(0));

        ProductDtos.ProductResponse response = service.create("store-1", request());

        var captor = ArgumentCaptor.forClass(Product.class);
        verify(products).save(captor.capture());
        assertThat(captor.getValue().getStoreId()).isEqualTo("store-1");
        assertThat(response.title()).isEqualTo("Widget");
    }

    @Test
    void listIsStoreQualified() {
        when(products.findAllByStoreId("store-1"))
                .thenReturn(List.of(product("store-1", "p-1")));

        assertThat(service.list("store-1")).hasSize(1);
        verify(products).findAllByStoreId("store-1");
    }

    @Test
    void crossTenantReadIsNotFound() {
        when(products.findByIdAndStoreId("p-1", "store-2")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.get("store-2", "p-1"))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(e -> assertThat(((ResponseStatusException) e).getStatusCode())
                        .isEqualTo(HttpStatus.NOT_FOUND));
    }

    @Test
    void updateLoadsWithinTenantOnly() {
        when(products.findByIdAndStoreId("p-1", "store-1"))
                .thenReturn(Optional.of(product("store-1", "p-1")));
        when(products.save(any(Product.class))).thenAnswer(i -> i.getArgument(0));

        ProductDtos.ProductResponse response = service.update("store-1", "p-1", request());

        verify(products).findByIdAndStoreId("p-1", "store-1");
        assertThat(response.price()).isEqualByComparingTo("9.99");
    }

    @Test
    void deleteRequiresTenantRow() {
        Product p = product("store-1", "p-1");
        when(products.findByIdAndStoreId("p-1", "store-1")).thenReturn(Optional.of(p));

        service.delete("store-1", "p-1");

        verify(products).delete(p);
    }

    @Test
    void deleteOfForeignProductIsNotFound() {
        when(products.findByIdAndStoreId("p-9", "store-1")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.delete("store-1", "p-9"))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(e -> assertThat(((ResponseStatusException) e).getStatusCode())
                        .isEqualTo(HttpStatus.NOT_FOUND));
    }
}
