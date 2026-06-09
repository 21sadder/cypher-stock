package SpkTeam.WebSocket;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;


// this class sends data to frontend
@Component
public class StatsWebSocketHandler extends TextWebSocketHandler {

    // all angular clients
    private final List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session){
        sessions.add(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session);
        System.out.println("CONNECTION CLOSED: " + session.getId());
    }

    public synchronized void sendToAll(String message){
        for (WebSocketSession session : sessions){
            if (!session.isOpen()) {
                sessions.remove(session);
                continue;
            }
            try {

                //sending to frontend
                session.sendMessage(new TextMessage(message));
            } catch (Exception e){
                e.printStackTrace();

                sessions.remove(session);
            }
        }
    }
}
