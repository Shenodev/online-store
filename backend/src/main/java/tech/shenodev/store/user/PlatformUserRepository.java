package tech.shenodev.store.user;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * Global customer lookup — platform users are NOT tenant-scoped,
 * so this repository intentionally has no storeId methods.
 */
public interface PlatformUserRepository extends JpaRepository<PlatformUser, String> {

    Optional<PlatformUser> findByEmail(String email);
}
