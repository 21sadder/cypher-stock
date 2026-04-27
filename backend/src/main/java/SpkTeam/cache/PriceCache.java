package SpkTeam.cache;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class PriceCache {

    private final Map<String, Double> prices = new ConcurrentHashMap<>();

    public void updatePrice(String symbol, double price){
        prices.put(symbol, price);
    }

    // если мы не найдем цены токена в мапинге, то будет использована цена из фолбека
    public double getPrice(String symbol, double fallback){
        return prices.getOrDefault(symbol, fallback);
    }

    public Map<String, Double> getAll(){
        return prices;
    }
}
