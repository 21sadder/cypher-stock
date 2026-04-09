package SpkTeam.WebSocket;

import SpkTeam.service.FinnhubService;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.WebSocket;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
public class FinnhubConnector {

    private OkHttpClient client;
    private WebSocket webSocket;
    private final FinnhubService finnhubService;

    public FinnhubConnector(FinnhubService finnhubService) {
        this.finnhubService = finnhubService;
        connect();
    }

    public void connect() {
        client = new OkHttpClient.Builder()
                .readTimeout(0, TimeUnit.MILLISECONDS)
                .pingInterval(20, TimeUnit.SECONDS)
                .build();

        Request request = new Request.Builder()
                .url("wss://ws.finnhub.io?token=d7b5itpr01qhndem3uqgd7b5itpr01qhndem3ur0")
                .build();

        webSocket = client.newWebSocket(request, new FinnhubWebSocketListener(finnhubService, FinnhubService.SYMBOLS));
    }
}