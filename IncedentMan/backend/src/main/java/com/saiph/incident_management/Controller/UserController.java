package com.saiph.incident_management.Controller;

import com.saiph.incident_management.model.User;
import com.saiph.incident_management.model.LoginRequest;
import com.saiph.incident_management.service.JWTService;
import com.saiph.incident_management.service.UserService;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin  // Add this if you're calling from a different origin
public class UserController {
    private final UserService userService;
    private final JWTService jwtService;

    public UserController(UserService userService , JWTService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(userService.createUser(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser (@RequestBody LoginRequest loginRequest) {
        
        User user = userService.findByUsername(loginRequest.getUsername());

        // verify if user exist
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("User  not found");
        }

        
        if (!user.getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid password");
        }

        
        String token = jwtService.generateToken(user.getUsername());

        
        return ResponseEntity.ok(Map.of(
            "message", "Login successful",
            "token", token, 
            "role", user.getRole(),
            "username", user.getUsername()
        ));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        boolean deleted = userService.deleteUser(id);
        
        if (deleted) {
            return ResponseEntity.ok().body("User deleted successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody User user) {
        User updatedUser = userService.updateUser(id, user);
        
        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        User user = userService.getUserById(id); // You'll need to create this method in UserService
        if (user != null) {
            return ResponseEntity.ok(user); // Return 200 OK with the user object
        } else {
            return ResponseEntity.notFound().build(); // Return 404 Not Found if user is not found
    }
}
}