package tech.shenodev.store.product;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.Instant;

public class ProductDtos {

    /**
     * No {@code storeId} field by design — the tenant always comes from the
     * JWT principal in the controller, never from the request body.
     */
    public record UpsertProductRequest(
            @NotBlank(message = "Title is required")
            @Size(max = 255)
            String title,

            String description,

            @NotNull(message = "Price is required")
            @DecimalMin(value = "0.00", message = "Price must be >= 0")
            BigDecimal price,

            @Min(value = 0, message = "Stock must be >= 0")
            int stockQuantity,

            @Size(max = 255)
            String imageUrl) {}

    public record ProductResponse(
            String id,
            String title,
            String description,
            BigDecimal price,
            int stockQuantity,
            String imageUrl,
            Instant createdAt) {

        public static ProductResponse from(Product p) {
            return new ProductResponse(
                    p.getId(), p.getTitle(), p.getDescription(), p.getPrice(),
                    p.getStockQuantity(), p.getImageUrl(), p.getCreatedAt());
        }
    }
}
