package SpkTeam.service;

import SpkTeam.authDto.*;

import SpkTeam.exceptions.invalidPasswordException;
import SpkTeam.exceptions.userAlreadyExistExceptions;
import SpkTeam.exceptions.userNotFoundException;
import SpkTeam.jwtToken.JwtUtil;
import SpkTeam.repository.userRepository;
import SpkTeam.user.User;
import java.util.Optional;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicLong;

@Service
public class AuthService {

    //TODO connect database
    // private Map<String, User> users = new HashMap<>();
    private AtomicLong idGenerator = new AtomicLong();

    private final JwtUtil jwtUtil;

    private final userRepository userRepository;

    public AuthService(JwtUtil jwtUtil, userRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    public RegisterResponse register(RegisterRequest request) {
        User user = new User();

        // нормализация емайла для того чтобы не было пробелов в вводе и он был только з маленькими буквами
        String email = request.getEmail().trim().toLowerCase();
        String password = request.getPassword();
        String username = request.getUsername().trim().toLowerCase();

        // првоерка есть ли уже имейл в мапинге
        if(userRepository.existsByEmail(email)){
            throw new userAlreadyExistExceptions("this email already existing!");
        }

        // проверка что юзернейм существует только один такой
        if(userRepository.existsByUsername(username)){
            throw new userAlreadyExistExceptions("this username already existing!");
        }

        // хеширование пароля
        int logRounds = 12;
        String salt = BCrypt.gensalt(logRounds);
        String hash = BCrypt.hashpw(password, salt);

        // инкрементация айдишника
        long id = idGenerator.incrementAndGet();

        user.setId(id);
        user.setEmail(email);
        user.setPasswordHash(hash);
        user.setUsername(username);

        // влажуем юзера в базу даннных
        userRepository.save(user);

        return new RegisterResponse(id, email, username);
    }
    // ---> LOGIN PART
    public LoginResponse login(LoginRequest request){

        String email = request.getEmail().trim().toLowerCase();
        String password = request.getPassword();

        // checking if user with this email exists - return user, if no - return null.
        Optional<User> userOpt = userRepository.findByEmail(email);

        if(userOpt.isPresent()){
            User user = userOpt.get();

            if(BCrypt.checkpw(password, user.getPasswordHash())){
                String userToken = jwtUtil.generateToken(user.getEmail(), user.getUsername());
                return new LoginResponse(userToken, user.getId(), user.getEmail(), user.getUsername());
            }else{
                throw new invalidPasswordException("Wrong password for " + email +  ".");
            }
        }else{
            throw new userNotFoundException("Unknow email.");
        }
    }
}
