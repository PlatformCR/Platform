package com.platform.api.config;

import com.platform.api.user.Role;
import com.platform.api.user.RoleRepository;
import com.platform.api.user.User;
import com.platform.api.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashSet;
import java.util.UUID;

@Component
@Profile("local")
public class DataSeeder implements ApplicationRunner {

  private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);
  private static final String SEED_PERSONAL_ID = "platformadmin";
  private static final String SEED_EMAIL = "platformadmin@platform.local";
  private static final String SEED_PASSWORD = "platformadmin";

  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final PasswordEncoder passwordEncoder;

  public DataSeeder(
      UserRepository userRepository,
      RoleRepository roleRepository,
      PasswordEncoder passwordEncoder
  ) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  @Transactional
  public void run(ApplicationArguments args) {
    Role adminRole = roleRepository.findByCode("ADMIN")
        .orElseThrow(() -> new IllegalStateException("ADMIN role missing — run Flyway migrations"));

    userRepository.findByPersonalIdOrEmailIgnoreCase(SEED_PERSONAL_ID).ifPresentOrElse(
        existing -> {
          existing.setPasswordHash(passwordEncoder.encode(SEED_PASSWORD));
          existing.setEmail(SEED_EMAIL);
          existing.setEnabled(true);
          existing.getRoles().clear();
          existing.getRoles().add(adminRole);
          userRepository.save(existing);
          log.info("Updated local admin user personalId={}", SEED_PERSONAL_ID);
        },
        () -> {
          User admin = new User(
              UUID.randomUUID(),
              SEED_PERSONAL_ID,
              SEED_EMAIL,
              passwordEncoder.encode(SEED_PASSWORD),
              true,
              Instant.now()
          );
          admin.setRoles(new HashSet<>());
          admin.getRoles().add(adminRole);
          userRepository.save(admin);
          log.info("Seeded local admin user personalId={} email={}", SEED_PERSONAL_ID, SEED_EMAIL);
        }
    );
  }
}
