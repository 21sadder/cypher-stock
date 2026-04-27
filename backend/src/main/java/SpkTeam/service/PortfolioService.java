package SpkTeam.service;

import SpkTeam.Dto.AddHoldingRequest;
import SpkTeam.Dto.HoldingResponse;
import SpkTeam.Dto.PortfolioDto;
import SpkTeam.cache.PriceCache;
import SpkTeam.entity.Holding;
import SpkTeam.entity.Portfolio;
import SpkTeam.repository.holdingsRepository;
import SpkTeam.repository.portfolioRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PortfolioService {
    private final portfolioRepository portfolioRepository;
    private final PriceCache priceCache;
    private final holdingsRepository holdingsRepository;

    public PortfolioService(portfolioRepository portfolioRepository, PriceCache priceCache, holdingsRepository holdingsRepository) {
        this.portfolioRepository = portfolioRepository;
        this.priceCache = priceCache;
        this.holdingsRepository = holdingsRepository;
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
        return portfolioRepository.save(portfolio);
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
}
