package SpkTeam.webSocket;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class binanceInitializer implements CommandLineRunner {
    @Override
    public void run(String... args) throws Exception {
        System.out.println("its started, making connection with binance...");
    }
}
