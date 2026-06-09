package SpkTeam.Dto;

import SpkTeam.entity.TradeHistory;
import java.time.LocalDateTime;

public class TradeResponse {
    private Long id;
    private String symbol;
    private String side;
    private double quantity;
    private double price;
    private double total;
    private LocalDateTime executedAt;

    public TradeResponse(TradeHistory t) {
        this.id = t.getId();
        this.symbol = t.getSymbol();
        this.side = t.getSide();
        this.quantity = t.getQuantity();
        this.price = t.getPrice();
        this.total = t.getTotal();
        this.executedAt = t.getExecutedAt();
    }

    public Long getId() { return id; }
    public String getSymbol() { return symbol; }
    public String getSide() { return side; }
    public double getQuantity() { return quantity; }
    public double getPrice() { return price; }
    public double getTotal() { return total; }
    public LocalDateTime getExecutedAt() { return executedAt; }
}