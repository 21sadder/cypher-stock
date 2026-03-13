package SpkTeam.repository;

import SpkTeam.portfolio.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface portfolioRepository extends JpaRepository<Portfolio, Long> {
    List<Portfolio> findByUserEmail(String email);
}
