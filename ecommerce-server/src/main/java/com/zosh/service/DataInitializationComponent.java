package com.zosh.service;

import com.zosh.modal.User;
import com.zosh.repository.UserRepository;
import com.zosh.user.domain.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializationComponent implements CommandLineRunner {

    private final UserRepository userRepository;

    private CartService cartService;
    private PasswordEncoder passwordEncoder;

    @Autowired
    public DataInitializationComponent(UserRepository userRepository,
                                       PasswordEncoder passwordEncoder,
                                       CartService cartService) {
        this.userRepository = userRepository;
        this.passwordEncoder=passwordEncoder;
        this.cartService=cartService;
    }

    @Override
    public void run(String... args) {
        initializeAdminUser();
    }

    private void initializeAdminUser() {
        // Seed default admin (original)
        seedAdmin("codewithzosh@gmail.com", "codewithzosh", "zosh", "code");
        // Seed admin from credential file
        seedAdmin("shelkerohan2001@gmail.com", "Rohan@12", "Rohan", "Shelke");
    }

    private void seedAdmin(String email, String rawPassword, String firstName, String lastName) {
        if (userRepository.findByEmail(email) == null) {
            User adminUser = new User();
            adminUser.setPassword(passwordEncoder.encode(rawPassword));
            adminUser.setFirstName(firstName);
            adminUser.setLastName(lastName);
            adminUser.setEmail(email);
            adminUser.setRole(UserRole.ROLE_ADMIN.toString());
            User admin = userRepository.save(adminUser);
            cartService.createCart(admin);
            System.out.println("Seeded admin: " + email);
        }
    }

}
