package SpkTeam.auth_dto;

public class RegisterResponse {
    private long id;
    private String email;

    public RegisterResponse(long id, String email){
        this.email = email;
        this.id = id;
    }

    public long getId(){
        return id;
    }

    public String getEmail(){
        return email;
    }
}
