package SpkTeam.service;

import SpkTeam.cache.PriceCache;
import SpkTeam.entity.AccountSnapshot;
import SpkTeam.entity.Holding;
import SpkTeam.entity.Portfolio;
import SpkTeam.entity.PortfolioSnapshot;
import SpkTeam.repository.accountSnapshotRepository;
import SpkTeam.repository.holdingsRepository;
import SpkTeam.repository.portfolioRepository;
import SpkTeam.repository.portfolioSnapshotRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class PortfolioSnapshotJob {

    private final portfolioRepository portfolioRepository;
    private final holdingsRepository holdingsRepository;
    private final portfolioSnapshotRepository portfolioSnapshotRepository;
    private final PriceCache priceCache;
    private final accountSnapshotRepository accountSnapshotRepository;

    public PortfolioSnapshotJob(portfolioRepository portfolioRepository, holdingsRepository holdingsRepository, portfolioSnapshotRepository portfolioSnapshotRepository, PriceCache priceCache, accountSnapshotRepository accountSnapshotRepository) {
        this.portfolioRepository = portfolioRepository;
        this.holdingsRepository = holdingsRepository;
        this.portfolioSnapshotRepository = portfolioSnapshotRepository;
        this.priceCache = priceCache;
        this.accountSnapshotRepository = accountSnapshotRepository;
    }

    // started every day at 23:59
    @Scheduled(cron = "0 59 23 * * *")
    public void saveSnapshot(){

        List<String> allEmails = portfolioRepository.findAllUserEmails();

        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(23, 58);

        for(String email : allEmails){
            List<Portfolio> userPortfolios = portfolioRepository.findByUserEmail(email);

            double accountTotalValue = 0;
            double accountTotalCost = 0;

            for(Portfolio portfolio : userPortfolios){
                List<Holding> holdings = holdingsRepository.findByPortfolio_Id(portfolio.getId());

                double totalValue = 0;
                double totalCost = 0;

                for (Holding h : holdings){
                    double price = priceCache.getPrice(h.getSymbol(), h.getAvgBuyPrice());

                    totalValue += h.getQuantity() * price;
                    totalCost += h.getQuantity() * h.getAvgBuyPrice();
                }

                // saving snapshot of portfolio if it not exists for today
                boolean portfolioExists = portfolioSnapshotRepository
                        .existsByPortfolioIdAndRecordedAtBetween(
                                portfolio.getId(), startOfDay, endOfDay);

                if(!portfolioExists){
                    PortfolioSnapshot snapshot = new PortfolioSnapshot();
                    snapshot.setPortfolio(portfolio);
                    snapshot.setTotalValue(totalValue);
                    snapshot.setTotalCost(totalCost);
                    portfolioSnapshotRepository.save(snapshot);
                }

                accountTotalCost += totalCost;
                accountTotalValue += totalValue;
            }

            // saving snapshot of account if it not exists for today
            boolean accountExists = accountSnapshotRepository
                    .existsByUserEmailAndRecordedAtBetween(
                            email, startOfDay, endOfDay
                    );

            if(!accountExists) {
                AccountSnapshot accSnapshot = new AccountSnapshot();
                accSnapshot.setUserEmail(email);
                accSnapshot.setTotalCost(accountTotalCost);
                accSnapshot.setTotalValue(accountTotalValue);
                accountSnapshotRepository.save(accSnapshot);
            }
        }
    }
}
