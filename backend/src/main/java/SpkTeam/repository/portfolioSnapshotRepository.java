package SpkTeam.repository;

import SpkTeam.entity.PortfolioSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface portfolioSnapshotRepository extends JpaRepository<PortfolioSnapshot, Long> {
    // searching all snapshot of portfolio after some date
    List<PortfolioSnapshot> findByPortfolioIdAndRecordedAtAfterOrderByRecordedAtAsc(
        Long portfolioId,
        LocalDateTime after
    );

    // searching if there already exist record for today
    boolean existsByPortfolioIdAndRecordedAtBetween(
            Long portfolioId,
            LocalDateTime start,
            LocalDateTime end
    );
}
