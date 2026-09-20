package tech.shenodev.store.admin;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

/**
 * Tenant-scoped invite access. Token lookups are global by token (the token
 * itself is unguessable) but every write path re-qualifies by {@code storeId}.
 */
public interface AdminInviteRepository extends JpaRepository<AdminInvite, String> {

    Optional<AdminInvite> findByToken(String token);

    List<AdminInvite> findAllByStoreId(String storeId);

    void deleteByStoreIdAndInvitedEmail(String storeId, String invitedEmail);
}
