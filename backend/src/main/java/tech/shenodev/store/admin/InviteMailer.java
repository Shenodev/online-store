package tech.shenodev.store.admin;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Invite delivery. Uses SMTP when {@code spring.mail.host} is configured;
 * otherwise logs the link as a mock send (dev/test). The link always points
 * at the admin host invite page with the raw token as query param.
 */
@Component
public class InviteMailer {

    private static final Logger log = LoggerFactory.getLogger(InviteMailer.class);

    private final Optional<JavaMailSender> mailSender;
    private final String adminBaseUrl;
    private final String from;

    public InviteMailer(
            Optional<JavaMailSender> mailSender,
            @Value("${app.admin-base-url:https://admin.store.shenodev.tech}") String adminBaseUrl,
            @Value("${spring.mail.from:no-reply@shenodev.tech}") String from) {
        this.mailSender = mailSender;
        this.adminBaseUrl = adminBaseUrl;
        this.from = from;
    }

    public String inviteLink(String token) {
        return adminBaseUrl + "/admin/invite?token=" + token;
    }

    public void sendInvite(String toEmail, String token) {
        String link = inviteLink(token);
        if (mailSender.isEmpty()) {
            log.info("MOCK invite email to {}: {}", toEmail, link);
            return;
        }
        try {
            var message = new SimpleMailMessage();
            message.setFrom(from);
            message.setTo(toEmail);
            message.setSubject("You are invited to join a Shenostore team");
            message.setText("Accept your admin invite here (expires): " + link);
            mailSender.get().send(message);
        } catch (MailException ex) {
            log.warn("SMTP invite send failed for {}, falling back to mock link: {}", toEmail, link);
        }
    }
}
