package SpkTeam.service;

import SpkTeam.Dto.*;
import SpkTeam.cache.PriceCache;
import SpkTeam.entity.AccountSnapshot;
import SpkTeam.entity.Holding;
import SpkTeam.entity.Portfolio;
import SpkTeam.entity.PortfolioSnapshot;
import SpkTeam.repository.accountSnapshotRepository;
import SpkTeam.repository.holdingsRepository;
import SpkTeam.repository.portfolioRepository;
import SpkTeam.repository.portfolioSnapshotRepository;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class PortfolioService {
    private final portfolioRepository portfolioRepository;
    private final PriceCache priceCache;
    private final holdingsRepository holdingsRepository;
    private final portfolioSnapshotRepository portfolioSnapshotRepository;
    private final accountSnapshotRepository accountSnapshotRepository;

    public PortfolioService(portfolioRepository portfolioRepository, PriceCache priceCache, holdingsRepository holdingsRepository, portfolioSnapshotRepository portfolioSnapshotRepository, accountSnapshotRepository accountSnapshotRepository) {
        this.portfolioRepository = portfolioRepository;
        this.priceCache = priceCache;
        this.holdingsRepository = holdingsRepository;
        this.portfolioSnapshotRepository = portfolioSnapshotRepository;
        this.accountSnapshotRepository = accountSnapshotRepository;
    }

    public List<PortfolioDto> getUserPortfolios(String email){
        List<PortfolioDto> dtos = new ArrayList<>();
        List<Portfolio> portfoliosArray = portfolioRepository.findByUserEmail(email);

        if (portfoliosArray.isEmpty()) return new ArrayList<>();

        for(Portfolio portfolios : portfoliosArray){
            List<Holding> holdings = holdingsRepository.findByPortfolio_Id(portfolios.getId());

            double totalValue = 0;
            double totalCost = 0;
            double pnl = 0;

            for(Holding h : holdings){
                double price = priceCache.getPrice(h.getSymbol(), h.getAvgBuyPrice());
                totalValue += h.getQuantity() * price;
                totalCost += h.getQuantity() * h.getAvgBuyPrice();
                pnl = totalValue - totalCost;
            }

            dtos.add(new PortfolioDto(portfolios.getId(), portfolios.getName(), totalValue, totalCost, holdings.size(), pnl));
        }
        return dtos;
    }


    public Portfolio createPortfolio(String email, String name){
        Portfolio portfolio = new Portfolio();
        portfolio.setUserEmail(email);
        portfolio.setName(name);
        portfolioRepository.save(portfolio);

        Holding usdt = new Holding();
        usdt.setPortfolio(portfolio);
        usdt.setSymbol("USDTUSDT");
        usdt.setQuantity(10000.0);
        usdt.setAvgBuyPrice(1.0);
        usdt.setType("CRYPTO");
        holdingsRepository.save(usdt);

        return portfolio;
    }

    public void deletePortfolio(Long portfolioId){
        portfolioRepository.deleteById(portfolioId);
    }

    public HoldingResponse addNewHolding(Long portfolioId, AddHoldingRequest request){
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new RuntimeException("Portfolio not found!"));

        List<Holding> existing = holdingsRepository.findByPortfolio_Id(portfolioId);
        for(Holding h : existing){
            if(h.getSymbol().equals(request.getSymbol())) {
                double totalQty = h.getQuantity() + request.getQuantity();
                double newAvg = ( (h.getQuantity() * h.getAvgBuyPrice()) + (request.getQuantity() * request.getAvgBuyPrice())) / totalQty;
                h.setQuantity(totalQty);
                h.setAvgBuyPrice(newAvg);
                Holding saved = holdingsRepository.save(h);
                double price = priceCache.getPrice(saved.getSymbol(), saved.getAvgBuyPrice());
                return new HoldingResponse(saved, price);
            }
        }

        Holding holding = new Holding();
        holding.setPortfolio(portfolio);
        holding.setSymbol(request.getSymbol());
        holding.setQuantity(request.getQuantity());
        holding.setAvgBuyPrice(request.getAvgBuyPrice());
        holding.setType(request.getType());

        Holding saved = holdingsRepository.save(holding);
        double price = priceCache.getPrice(saved.getSymbol(), saved.getAvgBuyPrice());
        return new HoldingResponse(saved, price);
    }

    public List<HoldingResponse> getHoldings(Long portfolioId){
        List<Holding> holding = holdingsRepository.findByPortfolio_Id(portfolioId);
        List<HoldingResponse> response = new ArrayList<>();

        for(Holding h : holding) {
            double price = priceCache.getPrice(h.getSymbol(), h.getAvgBuyPrice());
            response.add(new HoldingResponse(h, price));
        }

        return response;
    }

    public List<SnapshotsDto> getPortfolioSnapshots(Long Id, String period) {
        LocalDateTime from = resolvePeriod(period);
        List<PortfolioSnapshot> snapshots = portfolioSnapshotRepository
                .findByPortfolioIdAndRecordedAtAfterOrderByRecordedAtAsc(Id, from);

        List<SnapshotsDto> dtos = new ArrayList<>();
        for(PortfolioSnapshot p : snapshots){
            dtos.add(new SnapshotsDto(p));
        }
        return dtos;
    }

    public List<SnapshotsDto> getAccountSnapshots(String email, String period){
        LocalDateTime from = resolvePeriod(period);
        List<AccountSnapshot> snapshots = accountSnapshotRepository
                .findByUserEmailAndRecordedAtAfterOrderByRecordedAtAsc(email, from);

        List<SnapshotsDto> dtos = new ArrayList<>();
        for(AccountSnapshot s : snapshots){
            dtos.add(new SnapshotsDto(s));
        }
        return dtos;
    }

    public LocalDateTime resolvePeriod(String period){
        return switch (period){
            case "1D" -> LocalDateTime.now().minusDays(1);
            case "7D" -> LocalDateTime.now().minusDays(7);
            case "1M" -> LocalDateTime.now().minusMonths(1);
            case "3M" -> LocalDateTime.now().minusMonths(3);
            default -> LocalDateTime.now().minusMonths(3);
        };
    }

    public PerformerDto getStatisticOfPortfolios(String email){
        List<Portfolio> portfolios = portfolioRepository.findByUserEmail(email);

        if (portfolios.isEmpty()) return null;

        Holding bestHolding = null;
        Holding worstHolding = null;

        double bestPercent = Double.NEGATIVE_INFINITY;
        double worstPercent = Double.POSITIVE_INFINITY;

        for(Portfolio portfolio : portfolios){
            List<Holding> holdings = holdingsRepository.findByPortfolio_Id(portfolio.getId());

            for(Holding holding : holdings){

                double currentPrice = priceCache.getPrice(holding.getSymbol(), holding.getAvgBuyPrice());

                double profitPercent = ((currentPrice - holding.getAvgBuyPrice()) / holding.getAvgBuyPrice()) * 100;


                if(profitPercent > bestPercent){
                    bestPercent = profitPercent;
                    bestHolding = holding;
                }

                if(profitPercent < worstPercent){
                    worstPercent = profitPercent;
                    worstHolding = holding;
                }

            }
        }

        PerformerDto dto = new PerformerDto();

        if (bestHolding != null){
            dto.setBestHoldingSymbol(bestHolding.getSymbol());
            dto.setBestPercent(bestPercent);
        }

        if(worstHolding != null) {
            dto.setWorstHoldingSymbol(worstHolding.getSymbol());
            dto.setWorstPercent(worstPercent);
        }

        return dto;

    }

    public TopPortfolioDto getTopPortfolio(String email) {

        List<Portfolio> portfolios = portfolioRepository.findByUserEmail(email);

        if (portfolios.isEmpty()) {
            return null;
        }

        Portfolio bestPortfolio = null;

        double bestRoi = Double.NEGATIVE_INFINITY;
        double bestValue = 0;
        double bestPnl = 0;

        for (Portfolio portfolio : portfolios) {

            List<Holding> holdings = holdingsRepository.findByPortfolio_Id(portfolio.getId());

            double totalValue = 0;
            double totalCost = 0;

            for (Holding holding : holdings) {

                double currentPrice = priceCache.getPrice(holding.getSymbol(), holding.getAvgBuyPrice());

                totalValue += currentPrice * holding.getQuantity();

                totalCost += holding.getAvgBuyPrice() * holding.getQuantity();
            }

            double pnl = totalValue - totalCost;

            double roi = totalCost > 0 ? (pnl / totalCost) * 100 : 0;

            if (roi > bestRoi) {

                bestRoi = roi;
                bestPortfolio = portfolio;

                bestValue = totalValue;
                bestPnl = pnl;
            }
        }

        if (bestPortfolio == null) {
            return null;
        }

        TopPortfolioDto dto = new TopPortfolioDto();

        dto.setPortfolioName(bestPortfolio.getName());
        dto.setRoi(bestRoi);
        dto.setValue(bestValue);
        dto.setPnl(bestPnl);

        return dto;
    }
}
