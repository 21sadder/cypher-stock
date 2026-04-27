package SpkTeam.Dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class LoginRequest {
    @Email(message = "email must be valid")
    @NotBlank
    private String email;

    @NotBlank
    @Size(min = 8, message = "password must be at least 8 characters")
    private String password;

    public LoginRequest() {}

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}