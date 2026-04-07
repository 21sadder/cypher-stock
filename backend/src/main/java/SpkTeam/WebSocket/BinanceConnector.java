package SpkTeam.WebSocket;

import SpkTeam.service.BinanceService;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
public class BinanceConnector {
    private final BinanceService binanceService;

    public BinanceConnector(BinanceService binanceService) {
        this.binanceService = binanceService;
        connect();
    }

    public void connect(){
        OkHttpClient client = new OkHttpClient.Builder()
                .readTimeout(0, TimeUnit.MILLISECONDS)
                .build();

        Request request = new Request.Builder()
                .url("wss://stream.binance.com:9443/ws/btcusdt@trade")
                .build();

        client.newWebSocket(request, new BinanceWebSocketListener(binanceService));
    }
}
