package SpkTeam.user;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    private long id;

    @Id
    private String email;

    private String passwordHash;

    private String username;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public User(){}

    public User(long id, String email, String passwordHash, String username){
        this.id = id;
        this.email = email;
        this.passwordHash = passwordHash;
        this.username = username;
    }


    public long getId(){
        return id;
    }

    public String getEmail(){
        return email;
    }

    public String getPasswordHash(){
        return passwordHash;
    }

    public String getUsername(){ return username; }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setId(long id) {
        this.id = id;
    }
}
