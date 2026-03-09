package SpkTeam.webSocket;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class TradeEvent {

    @JsonProperty("e")
    private String eventType;// event type

    @JsonProperty("E")
    private long eventTime;   // event time

    @JsonProperty("s")
    private String symbol; // symbol

    @JsonProperty("p")
    private BigDecimal price; //price

    @JsonProperty("q")
    private BigDecimal quantity; // quantity


}
