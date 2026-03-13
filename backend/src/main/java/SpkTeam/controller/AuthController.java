package SpkTeam.controller;

import SpkTeam.authDto.*;
import SpkTeam.service.AuthService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public RegisterResponse register(@RequestBody @Valid RegisterRequest registerRequest) throws Exception {
        return authService.register(registerRequest);
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest loginRequest) throws Exception {
        return authService.login(loginRequest);
    }

    @GetMapping("/values")
    public List<CoinsResponse> getCoins(@RequestParam String email) throws Exception {
        return authService.coinsInAccountToFrontend(email);
    }

}
