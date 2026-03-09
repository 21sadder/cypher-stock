package SpkTeam.controller;

import SpkTeam.authDto.RegisterRequest;
import SpkTeam.authDto.RegisterResponse;
import SpkTeam.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

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
}
