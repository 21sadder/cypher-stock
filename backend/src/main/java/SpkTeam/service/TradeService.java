package SpkTeam.service;

import SpkTeam.Dto.TradeRequest;
import SpkTeam.Dto.TradeResponse;
import SpkTeam.cache.PriceCache;
import SpkTeam.entity.Holding;
import SpkTeam.entity.Portfolio;
import SpkTeam.entity.TradeHistory;
import SpkTeam.repository.TradeHistoryRepository;
import SpkTeam.repository.holdingsRepository;
import SpkTeam.repository.portfolioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TradeService {

    private final portfolioRepository portfolioRepository;
    private final holdingsRepository holdingsRepository;
    private final TradeHistoryRepository tradeHistoryRepository;
    private final PriceCache priceCache;

    public TradeService(portfolioRepository portfolioRepository,
                        holdingsRepository holdingsRepository,
                        TradeHistoryRepository tradeHistoryRepository,
                        PriceCache priceCache) {
        this.portfolioRepository = portfolioRepository;
        this.holdingsRepository = holdingsRepository;
        this.tradeHistoryRepository = tradeHistoryRepository;
        this.priceCache = priceCache;
    }

    @Transactional
    public TradeResponse buy(Long portfolioId, TradeRequest request) {

        // находим портфолио, ток хз нахуя
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));

        // берём цену из кэша (реальная цена с Binance) тут чутка не понятно
        double price = priceCache.getPrice(request.getSymbol(), 0);
        double total = price * request.getQuantity();

        // ищем USDT в холдингах портфолио
        List<Holding> holdings = holdingsRepository.findByPortfolio_Id(portfolioId);

        Holding usdt = holdings.stream()
                .filter(h -> h.getSymbol().equals("USDTUSDT"))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No USDT in portfolio"));

        // проверка на бомжа (баланс)
        if (usdt.getQuantity() < total) {
            throw new RuntimeException("Not enough USDT");
        }

        // уменьшаем член (USDT)
        usdt.setQuantity(usdt.getQuantity() - total);
        holdingsRepository.save(usdt);

        // ищем актив — если уже есть, обновляем, если нет — создаём
        Holding target = holdings.stream()
                .filter(h -> h.getSymbol().equals(request.getSymbol()))
                .findFirst()
                .orElse(null);

        if (target != null) {
            double newQty = target.getQuantity() + request.getQuantity();
            double newAvg = ((target.getQuantity() * target.getAvgBuyPrice()) + (request.getQuantity() * price)) / newQty;
            target.setQuantity(newQty);
            target.setAvgBuyPrice(newAvg);
        } else {
            target = new Holding();
            target.setPortfolio(portfolio);
            target.setSymbol(request.getSymbol());
            target.setQuantity(request.getQuantity());
            target.setAvgBuyPrice(price);
            target.setType(request.getType());
        }
        holdingsRepository.save(target);

        // записываем в историю в инсту
        TradeHistory history = new TradeHistory();
        history.setPortfolio(portfolio);
        history.setSymbol(request.getSymbol());
        history.setType(request.getType());
        history.setSide("BUY");
        history.setQuantity(request.getQuantity());
        history.setPrice(price);
        history.setTotal(total);
        tradeHistoryRepository.save(history);

        return new TradeResponse(history);
    }

    @Transactional
    public TradeResponse sell(Long portfolioId, TradeRequest request) {

        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));

        double price = priceCache.getPrice(request.getSymbol(), 0);
        double total = price * request.getQuantity();

        List<Holding> holdings = holdingsRepository.findByPortfolio_Id(portfolioId);

        // ищем актив который хотим продать
        Holding target = holdings.stream()
                .filter(h -> h.getSymbol().equals(request.getSymbol()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Holding not found"));

        if (target.getQuantity() < request.getQuantity()) {
            throw new RuntimeException("Not enough balance");
        }

        // минус актив
        target.setQuantity(target.getQuantity() - request.getQuantity());
        holdingsRepository.save(target);

        // увеличиваем член, ой, USDT
        Holding usdt = holdings.stream()
                .filter(h -> h.getSymbol().equals("USDTUSDT"))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No USDT holding found"));

        usdt.setQuantity(usdt.getQuantity() + total);
        holdingsRepository.save(usdt);

        //записываем в историю торговли
        TradeHistory history = new TradeHistory();
        history.setPortfolio(portfolio);
        history.setSymbol(request.getSymbol());
        history.setType(request.getType());
        history.setSide("SELL");
        history.setQuantity(request.getQuantity());
        history.setPrice(price);
        history.setTotal(total);
        tradeHistoryRepository.save(history);

        return new TradeResponse(history);
    }

    public List<TradeResponse> getHistory(Long portfolioId) {
        return tradeHistoryRepository.findByPortfolio_IdOrderByExecutedAtDesc(portfolioId)
                .stream()
                .map(TradeResponse::new)
                .collect(Collectors.toList());
    }
}