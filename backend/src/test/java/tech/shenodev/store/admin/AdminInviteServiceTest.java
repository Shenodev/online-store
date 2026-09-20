package tech.shenodev.store.admin;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;
import tech.shenodev.store.security.JwtService;

import java.lang.reflect.Field;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminInviteServiceTest {

    @Mock
    private AdminUserRepository admins;

    @Mock
    private AdminInviteRepository invites;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private InviteMailer mailer;

    private AdminInviteService service;

    @BeforeEach
    void setUp() {
        service = new AdminInviteService(admins, invites, passwordEncoder, jwtService, mailer, 72);
    }

    private AdminUser primary(String storeId) {
        return new AdminUser(storeId, "owner@example.com", "hash", AdminUser.RoleType.PRIMARY);
    }

    @Test
    void primaryInvitePersistsTokenAndSendsLink() {
        when(admins.findByIdAndStoreId("admin-1", "store-1"))
                .thenReturn(Optional.of(primary("store-1")));
        when(admins.findByEmail("new@example.com")).thenReturn(Optional.empty());
        when(invites.save(any(AdminInvite.class))).thenAnswer(i -> i.getArgument(0));

        AdminDtos.InviteResponse response =
                service.invite("admin-1", "store-1", new AdminDtos.InviteRequest("New@Example.com"));

        var captor = ArgumentCaptor.forClass(AdminInvite.class);
        verify(invites).save(captor.capture());
        AdminInvite saved = captor.getValue();
        assertThat(saved.getStoreId()).isEqualTo("store-1");
        assertThat(saved.getInvitedEmail()).isEqualTo("new@example.com");
        assertThat(saved.getToken()).hasSize(43);
        assertThat(saved.getExpiresAt()).isAfter(Instant.now().plus(71, ChronoUnit.HOURS));

        verify(mailer).sendInvite("new@example.com", saved.getToken());
        assertThat(response.email()).isEqualTo("new@example.com");
    }

    @Test
    void secondaryAdminCannotInvite() {
        var secondary = new AdminUser("store-1", "staff@example.com", "h", AdminUser.RoleType.SECONDARY);
        when(admins.findByIdAndStoreId("admin-2", "store-1")).thenReturn(Optional.of(secondary));

        assertThatThrownBy(() -> service.invite("admin-2", "store-1", new AdminDtos.InviteRequest("x@y.com")))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(e -> assertThat(((ResponseStatusException) e).getStatusCode())
                        .isEqualTo(HttpStatus.FORBIDDEN));
        verify(invites, never()).save(any());
    }

    @Test
    void acceptCreatesSecondaryOnIdenticalStoreAndConsumesToken() throws Exception {
        var invite = new AdminInvite("store-1", "new@example.com", "tok", Instant.now().plus(1, ChronoUnit.HOURS));
        when(invites.findByToken("tok")).thenReturn(Optional.of(invite));
        when(admins.findByEmail("new@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password123")).thenReturn("hashed");
        when(admins.save(any(AdminUser.class))).thenAnswer(i -> {
            AdminUser a = i.getArgument(0);
            Field id = AdminUser.class.getDeclaredField("id");
            id.setAccessible(true);
            id.set(a, "admin-9");
            return a;
        });
        when(jwtService.issueAdminToken("admin-9", "store-1")).thenReturn("jwt");

        AdminDtos.RegisterResponse response = service.accept("tok", "password123");

        var adminCaptor = ArgumentCaptor.forClass(AdminUser.class);
        verify(admins).save(adminCaptor.capture());
        AdminUser created = adminCaptor.getValue();
        assertThat(created.getStoreId()).isEqualTo("store-1");
        assertThat(created.getRoleType()).isEqualTo(AdminUser.RoleType.SECONDARY);
        assertThat(created.getPasswordHash()).isEqualTo("hashed");

        verify(invites).delete(invite);
        verify(jwtService).issueAdminToken("admin-9", "store-1");
        assertThat(response.storeId()).isEqualTo("store-1");
        assertThat(response.token()).isEqualTo("jwt");
    }

    @Test
    void expiredTokenIsRejectedAndRemoved() {
        var invite = new AdminInvite("store-1", "new@example.com", "tok", Instant.now().minus(1, ChronoUnit.HOURS));
        when(invites.findByToken("tok")).thenReturn(Optional.of(invite));

        assertThatThrownBy(() -> service.accept("tok", "password123"))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(e -> assertThat(((ResponseStatusException) e).getStatusCode())
                        .isEqualTo(HttpStatus.GONE));
        verify(invites).delete(invite);
        verify(admins, never()).save(any());
    }

    @Test
    void unknownTokenIsNotFound() {
        when(invites.findByToken("nope")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.accept("nope", "password123"))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(e -> assertThat(((ResponseStatusException) e).getStatusCode())
                        .isEqualTo(HttpStatus.NOT_FOUND));
    }
}
