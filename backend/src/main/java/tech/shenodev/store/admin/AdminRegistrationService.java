package tech.shenodev.store.admin;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.server.ResponseStatusException;
import tech.shenodev.store.security.JwtService;
import tech.shenodev.store.store.Store;
import tech.shenodev.store.store.StoreRepository;

/**
 * Store provisioning flow (see AppFlow.md §1): create the {@code stores}
 * record FIRST, then the {@code admin_users} row linked to the new
 * {@code store_id} as PRIMARY, then return a JWT containing that
 * {@code store_id}. Single transaction — a failed admin insert rolls back
 * the store so no orphan tenant survives.
 */
@Service
@Validated
public class AdminRegistrationService {

    private final StoreRepository stores;
    private final AdminUserRepository admins;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AdminRegistrationService(
            StoreRepository stores,
            AdminUserRepository admins,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.stores = stores;
        this.admins = admins;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AdminDtos.RegisterResponse register(@Valid AdminDtos.RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        String storeName = request.storeName().trim();

        if (admins.findByEmail(email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        Store store = stores.save(new Store(storeName));

        AdminUser admin = admins.save(new AdminUser(
                store.getId(),
                email,
                passwordEncoder.encode(request.password()),
                AdminUser.RoleType.PRIMARY));

        String token = jwtService.issueAdminToken(admin.getId(), store.getId());
        return new AdminDtos.RegisterResponse(token, store.getId(), admin.getId());
    }
}
