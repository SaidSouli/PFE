package com.saiph.incident_management.Controller;
import com.saiph.incident_management.model.User;
import com.saiph.incident_management.model.LoginRequest;
import com.saiph.incident_management.repository.UserRepository;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest){
        User user = userRepository.findByUsername(loginRequest.getUsername());
        if (user == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("user not found");
        }
        if (!user.getPassword().equals(loginRequest.getPassword())){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
        }
        return ResponseEntity.ok(Map.of(
        "message", "Login successful",
        "role", user.getRole(),
        "username", user.getUsername()
    ));
    }
}
