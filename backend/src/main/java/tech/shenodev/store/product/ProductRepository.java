package tech.shenodev.store.product;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

/**
 * Tenant-scoped product access. All reads/writes go through
 * {@code storeId}-qualified methods. Controllers must never call
 * {@code findById} — use {@code findByIdAndStoreId}.
 */
public interface ProductRepository extends JpaRepository<Product, String> {

    List<Product> findAllByStoreId(String storeId);

    Optional<Product> findByIdAndStoreId(String id, String storeId);

    void deleteByIdAndStoreId(String id, String storeId);
}
