package SpkTeam.exceptions;

public class invalidPasswordException extends RuntimeException {
  public invalidPasswordException(String message) {
    super(message);
  }
}
