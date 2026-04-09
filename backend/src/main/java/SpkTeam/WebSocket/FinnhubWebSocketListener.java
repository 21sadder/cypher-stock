package SpkTeam.WebSocket;

import SpkTeam.service.FinnhubService;
import okhttp3.Response;
import okhttp3.WebSocket;
import okhttp3.WebSocketListener;

import java.util.List;

public class FinnhubWebSocketListener extends WebSocketListener {

    private final FinnhubService finnhubService;

    private final List<String> symbols;

    public FinnhubWebSocketListener(FinnhubService finnhubService, List<String> symbols) {
        this.finnhubService = finnhubService;
        this.symbols = symbols;
    }

    @Override
    public void onOpen(WebSocket webSocket, Response response) {
        System.out.println("Finnhub connected");
        // subscribing in the symbols and sending a message that we wanna receive this symbols
        for (String symbol : symbols) {
            String msg = String.format("{\"type\":\"subscribe\",\"symbol\":\"%s\"}", symbol);
            webSocket.send(msg);
        }
    }

    @Override
    public void onMessage(WebSocket webSocket, String text) {
        finnhubService.handleMessage(text);
    }

    @Override
    public void onFailure(WebSocket webSocket, Throwable t, Response response) {
        System.err.println("Finnhub error: " + t.getMessage());
    }

    @Override
    public void onClosing(WebSocket webSocket, int code, String reason) {
        System.out.println("Finnhub closing: " + reason);
    }
}
