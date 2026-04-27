package SpkTeam.Dto;

import SpkTeam.entity.Holding;

public class HoldingResponse {
    private Long id;
    private String symbol;
    private double quantity;
    private double avgBuyPrice;
    private double currentPrice;
    private double value;
    private double pnl;
    private double pnlPercent;
    private String type;

    public HoldingResponse(Holding h, double currentPrice){
        this.id = h.getId();
        this.symbol = h.getSymbol();
        this.quantity = h.getQuantity();
        this.avgBuyPrice = h.getAvgBuyPrice();
        this.currentPrice = currentPrice;
        this.type = h.getType();

        this.value = h.getQuantity() * currentPrice;
        double cost = h.getAvgBuyPrice() * h.getQuantity();
        this.pnl = this.value - cost;
        this.pnlPercent = cost > 0 ? (this.pnl / cost) * 100 : 0;
    }

    public Long getId() {
        return id;
    }

    public String getSymbol() {
        return symbol;
    }

    public double getQuantity() {
        return quantity;
    }

    public double getAvgBuyPrice() {
        return avgBuyPrice;
    }

    public double getCurrentPrice() {
        return currentPrice;
    }

    public double getValue() {
        return value;
    }

    public double getPnl() {
        return pnl;
    }

    public double getPnlPercent() {
        return pnlPercent;
    }

    public String getType() {
        return type;
    }
}
