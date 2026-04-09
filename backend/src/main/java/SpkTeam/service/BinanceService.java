package SpkTeam.service;

import SpkTeam.WebSocket.StatsWebSocketHandler;
import SpkTeam.authDto.CoinDto;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

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

            // перевіряємо чи це масив (!ticker@arr) чи один об'єкт (btcusdt@ticker)
            if (json.isArray()) {
                for (JsonNode node : json) {
                    processTicker(node);
                }
            } else {
                processTicker(json);
            }

        } catch (Exception e){
            e.printStackTrace();
        }
    }

    private void processTicker(JsonNode json) throws Exception {
        // перевіряємо що поля існують перед тим як читати
        if (json.get("s") == null || json.get("c") == null) return;

        String symbol = json.get("s").asText();
        double price = json.get("c").asDouble();
        double open = json.get("o").asDouble();
        double volume = json.get("v").asDouble();

        double change24Percent = ((price - open) / open) * 100;

        CoinDto coin = new CoinDto(symbol, price, change24Percent, volume, "CRYPTO");
        String result = objectMapper.writeValueAsString(coin);

        handler.sendToAll(result);
        System.out.println("SENDING TO FRONT: " + result);
    }
}
