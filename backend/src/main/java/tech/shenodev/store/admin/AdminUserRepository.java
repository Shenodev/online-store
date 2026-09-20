package tech.shenodev.store.admin;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

/**
 * Tenant-scoped admin access. The ONLY login lookup is global by email;
 * every other query MUST include {@code storeId} so a caller can never
 * reach across tenants. Never expose {@code findById} to controllers —
 * use {@code findByIdAndStoreId}.
 */
public interface AdminUserRepository extends JpaRepository<AdminUser, String> {

    Optional<AdminUser> findByEmail(String email);

    List<AdminUser> findAllByStoreId(String storeId);

    Optional<AdminUser> findByIdAndStoreId(String id, String storeId);
}
