package SpkTeam.authDto;

public class RegisterResponse {
    private long id;
    private String email;
    private String username;

    public RegisterResponse(long id, String email, String username){
        this.email = email;
        this.id = id;
        this.username = username;
    }

    public long getId(){
        return id;
    }

    public String getEmail(){
        return email;
    }

    public String getUsername(){ return username; }
}
