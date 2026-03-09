package SpkTeam.authDto;

public class LoginResponse {
    private String token;
    private long id;
    private String email;
    private String username;

    public LoginResponse(String token, long id, String email, String username){
        this.token = token;
        this.id = id;
        this.email = email;
        this.username = username;
    }


    public String getToken() {
        return token;
    }

    public long getId(){
        return id;
    }

    public String getEmail(){
        return email;
    }

    public String getUsername() {
        return username;
    }


}
