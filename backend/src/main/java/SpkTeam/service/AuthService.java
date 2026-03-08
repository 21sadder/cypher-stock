package SpkTeam.service;

import SpkTeam.authDto.RegisterRequest;
import SpkTeam.authDto.RegisterResponse;
import SpkTeam.exceptions.userAlreadyExistExceptions;
import SpkTeam.user.User;

import com.sun.jdi.InvalidLineNumberException;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class AuthService {
    //TODO connect database
    private Map<String, User> users = new HashMap<>();
    private AtomicLong idGenerator = new AtomicLong();

    public RegisterResponse register(RegisterRequest request) throws Exception{
        // нормализация емайла для того чтобы не было пробелов в вводе и он был только з маленькими буквами
        String email = request.getEmail().trim().toLowerCase();
        String password = request.getPassword();
        String username = request.getUsername().trim().toLowerCase();

        // првоерка есть ли уже имейл в мапинге
        if(users.containsKey(email)){
            throw new userAlreadyExistExceptions("this email already existing!");
        }

        // проверка что юзернейм существует только один такой
        for(User user : users.values()){
            if(user != null && user.getUsername() != null && user.getUsername().equals(username)){
                throw new userAlreadyExistExceptions("this username already existing!");
            }
        }

        // хеширование пароля
        int logRounds = 12;
        String salt = BCrypt.gensalt(logRounds);
        String hash = BCrypt.hashpw(password, salt);

        // инкрементация айдишника
        long id = idGenerator.incrementAndGet();

        // влажуем нормализованый имейл как ключ и юзера как значение, хранение в мапе такое -> Map(ключ:значение)
        users.put(email, new User(id, email, hash, request.getUsername()));

        return new RegisterResponse(id, email, username);
    }
}
