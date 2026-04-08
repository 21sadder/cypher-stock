package SpkTeam.WebSocket;

import SpkTeam.service.BinanceService;
import org.jetbrains.annotations.NotNull;
import okhttp3.Response;
import okhttp3.WebSocket;
import okhttp3.WebSocketListener;

public class BinanceWebSocketListener extends WebSocketListener {

    private final BinanceService binanceService;

    public BinanceWebSocketListener(BinanceService binanceService) {
        this.binanceService = binanceService;
    }

    // calls when successfully connected
    @Override
    public void onOpen(@NotNull WebSocket webSocket, @NotNull Response response){
        System.out.println("connecting opened!" + response.code());
    }

    @Override
    public void onMessage(@NotNull WebSocket webSocket, @NotNull String text){
        System.out.println("received: " + text);
        binanceService.handleMessage(text);
    }

    @Override
    public void onFailure(WebSocket webSocket, Throwable t, Response response) {
        System.err.println("error: " + t.getMessage());
        t.printStackTrace();
    }

    @Override
    public void onClosing(WebSocket webSocket, int code, String reason) {
        System.out.println("closing: " + code + " / " + reason);
    }
}
