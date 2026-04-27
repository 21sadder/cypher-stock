package SpkTeam.repository;

import SpkTeam.entity.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface portfolioRepository extends JpaRepository<Portfolio, Long> {
    List<Portfolio> findByUserEmail(String email);
}
