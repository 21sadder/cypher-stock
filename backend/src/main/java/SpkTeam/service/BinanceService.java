package SpkTeam.service;

import SpkTeam.WebSocket.StatsWebSocketHandler;
import SpkTeam.authDto.CoinDto;
import org.springframework.stereotype.Service;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@Service
public class BinanceService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final StatsWebSocketHandler handler;

    public BinanceService(StatsWebSocketHandler handler) {
        this.handler = handler;
    }

    public void handleMessage(String text){
        try {
            JsonNode json = objectMapper.readTree(text);

            String symbol = json.get("s").asText();
            double price = json.get("p").asDouble();
            double quantity = json.get("q").asDouble();

            CoinDto coin = new CoinDto(symbol, price, quantity);

            String result = objectMapper.writeValueAsString(coin);

            handler.sendToAll(result);
            
        } catch (Exception e){
            e.printStackTrace();
        }
    }
}
