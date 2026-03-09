package SpkTeam.webSocket;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import okhttp3.Response;
import okhttp3.WebSocket;
import okhttp3.WebSocketListener;

public class binanceWebSocketListener extends WebSocketListener {

    @Override
    public void onOpen(@NotNull WebSocket webSocket, @NotNull Response response){
        System.out.println("Connection completed");
    }

    @Override
    public void onMessage(@NotNull WebSocket webSocket, @NotNull String text){
        System.out.println("Recieved message: " + text);
    }

    @Override
    public void onFailure(@NotNull WebSocket webSocket, @NotNull Throwable t, @Nullable Response response){
        System.err.println("Error of conection: " + t.getMessage());
    }
}
