package tech.shenodev.store.order;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

/**
 * Tenant-scoped order access. Controllers must use the
 * {@code storeId}-qualified methods only.
 */
public interface OrderRepository extends JpaRepository<Order, String> {

    List<Order> findAllByStoreId(String storeId);

    Optional<Order> findByIdAndStoreId(String id, String storeId);
}
