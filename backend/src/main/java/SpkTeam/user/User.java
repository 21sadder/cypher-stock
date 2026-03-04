package SpkTeam.user;

public class User {
    private long id;
    private String email;
    private String passwordHash;

    public User(long id, String email, String passwordHash){
        this.id = id;
        this.email = email;
        this.passwordHash = passwordHash;
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
}
