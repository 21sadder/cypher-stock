package SpkTeam.service;

import SpkTeam.WebSocket.StatsWebSocketHandler;
import SpkTeam.Dto.CoinDto;
import SpkTeam.cache.PriceCache;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.springframework.stereotype.Service;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class FinnhubService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final StatsWebSocketHandler handler;
    private final OkHttpClient httpClient = new OkHttpClient();
    private final PriceCache priceCache;

    private final Map<String, Double> openPrices = new ConcurrentHashMap<>();

    private static final String API_KEY = "d7b5itpr01qhndem3uqgd7b5itpr01qhndem3ur0";

    public static final List<String> SYMBOLS = List.of(
            // top stocks usa (20)
            "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA",
            "NVDA", "META", "NFLX", "AMD", "INTC",
            "JPM", "BAC", "GS", "V", "MA",
            "WMT", "KO", "PEP", "JNJ", "PFE",

            // forex (10) — realtime
            "OANDA:EUR_USD", "OANDA:GBP_USD", "OANDA:USD_JPY",
            "OANDA:USD_CHF", "OANDA:AUD_USD", "OANDA:USD_CAD",
            "OANDA:NZD_USD", "OANDA:EUR_GBP", "OANDA:EUR_JPY",
            "OANDA:GBP_JPY",

            // metals (4) — realtime
            "OANDA:XAU_USD", "OANDA:XAG_USD",
            "OANDA:XPT_USD", "OANDA:XPD_USD",

            // energo (2) — realtime
            "OANDA:BCO_USD", "OANDA:WTICO_USD"
    );

    public FinnhubService(StatsWebSocketHandler handler, PriceCache priceCache) {
        this.handler = handler;
        this.priceCache = priceCache;
    }


    // downloads price of opening using REST api when programs start
    // we need this for calculating percent of changing price
    public void loadOpenPrices() throws IOException {
        for(String symbol : SYMBOLS){
            try {
                String cleanSymbol = symbol.replace("OANDA:", "");
                String url = "https://finnhub.io/api/v1/quote?symbol=" + symbol + "&token=" + API_KEY;

                Request request = new Request.Builder().url(url).build();

                try(Response response = httpClient.newCall(request).execute()) {
                    if(response.isSuccessful() && response.body() != null) {
                        JsonNode quote = objectMapper.readTree(response.body().string());

                        // open price of the day
                        double open = quote.get("o").asDouble();

                        if(open > 0){
                            openPrices.put(symbol, open);
                            System.out.println("symbol: " + symbol  + " with open price: " + open);
                        }
                    }
                }
                // delay 1.1 sec so as not to exceed the free plan limit (30–60 requests per minute)
                Thread.sleep(1100);

            } catch (Exception e){
                System.err.println("error with downloading for: "  + symbol + " -> " + e.getMessage());
            }
        }
    }

    public String resolveType(String symbol){
        if(symbol.startsWith("OANDA:XAU") || symbol.startsWith("OANDA:XAG") ||
                symbol.startsWith("OANDA:XPT") || symbol.startsWith("OANDA:XPD") ||
                symbol.startsWith("OANDA:BCO") || symbol.startsWith("OANDA:WTICO"))
        {
            return "COMMODITY";
        }

        if(symbol.startsWith("OANDA:")){
            return "FOREX";
        }

        return "STOCK";
    }

    public void handleMessage(String text){
        try{
            JsonNode json = objectMapper.readTree(text);

            String type = json.get("type").asText();

            // we have interested only in messages "trade"
            if(!type.equals("trade")) return;

            JsonNode trades = json.get("data");
            if(trades == null || !trades.isArray()) return;

            JsonNode latest = trades.get(trades.size() - 1);

            String symbol = latest.get("s").asText();
            double price = latest.get("p").asDouble();
            double volume = latest.get("v").asDouble();

            double openPrice = openPrices.getOrDefault(symbol, price);

            double changePercent = 0.0;
            if(openPrice != 0){
                changePercent = ((price - openPrice) / openPrice) * 100;
            }

            // resolve what is active is this to make filtration on frontend
            String typeOfActive = resolveType(symbol);

            priceCache.updatePrice(symbol, price);

            CoinDto coin = new CoinDto(symbol, price, changePercent, volume, typeOfActive);
            String result = objectMapper.writeValueAsString(coin);

            handler.sendToAll(result);
            System.out.println("sended finance: " + result);
        } catch (Exception e){
            e.printStackTrace();
        }
    }
}
