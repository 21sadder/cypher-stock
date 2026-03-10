package SpkTeam.webSocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class webSocketConfig implements WebSocketMessageBrokerConfigurer { // включает вебСокет систему в спринг бут

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config){ // настройка каналов уведомления
        config.enableSimpleBroker("/topic"); // спринг создает канал сообщений, например /topic/prices и ангуляр может подписаться на него
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry){ // метод который создает ссылку для веб сокета
        registry.addEndpoint("/ws") // WebSocket будет доступен тут:  ws://localhost:8080/ws
                .setAllowedOriginPatterns("*"); // разрешает подключение с любого фронта
    }
}
