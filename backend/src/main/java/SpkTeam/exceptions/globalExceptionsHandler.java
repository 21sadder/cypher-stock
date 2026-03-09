package SpkTeam.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class globalExceptionsHandler {

    @ExceptionHandler(userAlreadyExistExceptions.class)
    public ResponseEntity<String> handleUserExists(userAlreadyExistExceptions ex){
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ex.getMessage());
    }
}
