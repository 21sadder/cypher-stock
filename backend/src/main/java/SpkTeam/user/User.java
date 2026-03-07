package SpkTeam.user;

public class User {
    private long id;
    private String email;
    private String passwordHash;
    private String username;

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
}
