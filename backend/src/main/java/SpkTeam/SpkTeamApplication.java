package SpkTeam;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class SpkTeamApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpkTeamApplication.class, args);
	}
}
