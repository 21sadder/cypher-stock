package SpkTeam.WebSocket;

import SpkTeam.service.BinanceService;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.WebSocket;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
public class BinanceConnector {
    private final BinanceService binanceService;
    private OkHttpClient client; // ← поле класу, не локальна змінна
    private WebSocket webSocket;

    public BinanceConnector(BinanceService binanceService) {
        this.binanceService = binanceService;
        connect();
    }

    public void connect(){
        client = new OkHttpClient.Builder()
                .readTimeout(0, TimeUnit.MILLISECONDS)
                .pingInterval(20, TimeUnit.SECONDS)
                .build();

        Request request = new Request.Builder()
                .url("wss://stream.binance.com:443/ws/!miniTicker@arr")
                .build();

        client.newWebSocket(request, new BinanceWebSocketListener(binanceService));
    }
}
