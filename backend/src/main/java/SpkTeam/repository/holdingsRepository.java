package SpkTeam.repository;

import SpkTeam.entity.Holding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface holdingsRepository extends JpaRepository<Holding, Long> {
    List<Holding> findByPortfolio_Id(Long portfolioId);
}
