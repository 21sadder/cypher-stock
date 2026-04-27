package SpkTeam.Dto;

public class PortfolioDto {
    private Long id;
    private String name;
    private double totalValue; // total price of all holdings
    private double totalCost; // how many user spent money to buy this holdings
    private double pnl; //        profit/loss in $
    private double pnlPercent; // profit/loss int %
    private int holdingsCount; // quantity of holdings

    public PortfolioDto(Long id, String name, double totalValue, double totalCost, int holdingsCount, double pnl) {
        this.id = id;
        this.name = name;
        this.totalValue = totalValue;
        this.totalCost = totalCost;
        this.holdingsCount = holdingsCount;
        this.pnl = pnl;
        this.pnlPercent = totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0;
        // if total cost 0 or <0 --> there is no pnl in percents;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public double getTotalValue() {
        return totalValue;
    }

    public double getTotalCost() {
        return totalCost;
    }

    public double getPnl() {
        return pnl;
    }

    public double getPnlPercent() {
        return pnlPercent;
    }

    public int getHoldingsCount() {
        return holdingsCount;
    }
}

