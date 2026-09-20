package tech.shenodev.store.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

/**
 * Standard error envelope (see AppFlow.md §7):
 * {@code { "error": string, "code": number }}.
 * 401 = missing/invalid/expired token; 403 = valid token, wrong role/tenant.
 */
@Component
public class SecurityExceptionHandlers {

    private static final ObjectMapper mapper = new ObjectMapper();

    @Component
    public static class EntryPoint implements AuthenticationEntryPoint {
        @Override
        public void commence(
                HttpServletRequest request,
                HttpServletResponse response,
                AuthenticationException ex) throws IOException {
            write(response, HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
        }
    }

    @Component
    public static class DeniedHandler implements AccessDeniedHandler {
        @Override
        public void handle(
                HttpServletRequest request,
                HttpServletResponse response,
                AccessDeniedException ex) throws IOException {
            write(response, HttpServletResponse.SC_FORBIDDEN, "Forbidden");
        }
    }

    private static void write(HttpServletResponse response, int code, String error) throws IOException {
        response.setStatus(code);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        mapper.writeValue(response.getOutputStream(), Map.of("error", error, "code", code));
    }
}
