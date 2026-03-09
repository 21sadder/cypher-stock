package SpkTeam.webSocket;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.WebSocket;

public class binanceService {
    private WebSocket webSocket;
    private final OkHttpClient client = new OkHttpClient();

    public void startConnection(){
        Request request = new Request.Builder()
                .url("wss://stream.binance.com:9443/ws/btcusdt@aggTrade")
                .build();

        binanceWebSocketListener listener = new binanceWebSocketListener();
        this.webSocket = client.newWebSocket(request, listener);
    }
}
