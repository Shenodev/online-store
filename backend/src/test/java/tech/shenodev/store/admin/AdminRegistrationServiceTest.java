package tech.shenodev.store.admin;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;
import tech.shenodev.store.security.JwtService;
import tech.shenodev.store.store.Store;
import tech.shenodev.store.store.StoreRepository;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminRegistrationServiceTest {

    @Mock
    private StoreRepository stores;

    @Mock
    private AdminUserRepository admins;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AdminRegistrationService service;

    @Test
    void createsStoreFirstThenAdminAndReturnsTenantJwt() {
        var request = new AdminDtos.RegisterRequest(" Acme ", "Owner@Example.com", "password123");
        when(admins.findByEmail("owner@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password123")).thenReturn("hashed");

        // Mocks echo the entity back; ids resolve via @PrePersist in production.
        when(stores.save(any(Store.class))).thenAnswer(i -> {
            Store s = i.getArgument(0);
            setId(s, "store-1");
            return s;
        });
        when(admins.save(any(AdminUser.class))).thenAnswer(i -> {
            AdminUser a = i.getArgument(0);
            setId(a, "admin-1");
            return a;
        });
        when(jwtService.issueAdminToken("admin-1", "store-1")).thenReturn("jwt");

        AdminDtos.RegisterResponse response = service.register(request);

        var storeCaptor = ArgumentCaptor.forClass(Store.class);
        verify(stores).save(storeCaptor.capture());
        assertThat(storeCaptor.getValue().getName()).isEqualTo("Acme");

        var adminCaptor = ArgumentCaptor.forClass(AdminUser.class);
        verify(admins).save(adminCaptor.capture());
        AdminUser admin = adminCaptor.getValue();
        assertThat(admin.getStoreId()).isEqualTo("store-1");
        assertThat(admin.getEmail()).isEqualTo("owner@example.com");
        assertThat(admin.getPasswordHash()).isEqualTo("hashed");
        assertThat(admin.getRoleType()).isEqualTo(AdminUser.RoleType.PRIMARY);

        verify(jwtService).issueAdminToken("admin-1", "store-1");
        assertThat(response.token()).isEqualTo("jwt");
        assertThat(response.storeId()).isEqualTo("store-1");
    }

    @Test
    void duplicateEmailIsConflict() {
        when(admins.findByEmail("owner@example.com"))
                .thenReturn(Optional.of(new AdminUser("s", "owner@example.com", "h", AdminUser.RoleType.PRIMARY)));

        var request = new AdminDtos.RegisterRequest("Acme", "owner@example.com", "password123");

        assertThatThrownBy(() -> service.register(request))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("409");
    }

    private static void setId(Object entity, String id) throws Exception {
        var field = entity.getClass().getDeclaredField("id");
        field.setAccessible(true);
        field.set(entity, id);
    }
}
