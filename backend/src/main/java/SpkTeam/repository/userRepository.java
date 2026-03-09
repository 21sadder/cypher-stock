package SpkTeam.repository;

import SpkTeam.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface userRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);

    Optional<User> findByEmail(String email);


}
