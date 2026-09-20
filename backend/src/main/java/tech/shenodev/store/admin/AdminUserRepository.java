package tech.shenodev.store.admin;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AdminUserRepository extends JpaRepository<AdminUser, String> {
    Optional<AdminUser> findByEmail(String email);
    List<AdminUser> findAllByStoreId(String storeId);
}
