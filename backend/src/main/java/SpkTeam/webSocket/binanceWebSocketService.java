package SpkTeam.webSocket;

import jakarta.annotation.PostConstruct;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.WebSocket;
import java.util.concurrent.CompletionStage;

@Service
public class binanceWebSocketService {
    private final SimpMessagingTemplate messagingTemplate; // обьект который может отправлять вебсокет сообщения

    public binanceWebSocketService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @PostConstruct
    public void connect(){
        HttpClient client = HttpClient.newHttpClient();

        client.newWebSocketBuilder().buildAsync(URI.create("wss://stream.binance.com:9443/ws/btcusdt@ticker"), new WebSocket.Listener(){
                            @Override
                            public CompletionStage<?> onText(WebSocket webSocket, CharSequence data, boolean last) {
                                messagingTemplate.convertAndSend("/topic/prices", data.toString());
                                webSocket.request(1);
                                return null;
                            }

                        });
    }
}
