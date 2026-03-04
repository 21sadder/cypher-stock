package SpkTeam.auth;

import SpkTeam.auth_dto.RegisterRequest;
import SpkTeam.auth_dto.RegisterResponse;
import SpkTeam.user.User;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class AuthService {
    private Map<String, User> users = new HashMap<>();
    private AtomicLong idGenerator = new AtomicLong();

    public RegisterResponse register(RegisterRequest request) throws Exception{
        // нормализация емайла для того чтобы не было пробелов в вводе и он был только з маленькими буквами
        String email = request.getEmail().trim().toLowerCase();
        String password = request.getPassword();

        // првоерка есть ли уже имейл в мапинге
        if(users.containsKey(email)){
            throw new Exception("this email already existing!");
        }

        // хеширование пароля
        int logRounds = 12;
        String salt = BCrypt.gensalt(logRounds);
        String hash = BCrypt.hashpw(password, salt);

        // инкрементация айдишника
        long id = idGenerator.incrementAndGet();

        // влажуем нормализованый имейл как ключ и юзера как значение, хранение в мапе такое -> Map(ключ:значение)
        users.put(email, new User(id, email, hash));

        return new RegisterResponse(id, email);
    }
}
