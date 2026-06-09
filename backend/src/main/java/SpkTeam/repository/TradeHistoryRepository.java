package SpkTeam.repository;

import SpkTeam.entity.TradeHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TradeHistoryRepository extends JpaRepository<TradeHistory, Long> {
    List<TradeHistory> findByPortfolio_IdOrderByExecutedAtDesc(Long portfolioId);
}