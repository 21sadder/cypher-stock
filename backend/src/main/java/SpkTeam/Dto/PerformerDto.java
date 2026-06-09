package SpkTeam.Dto;

public class PerformerDto {
    private String bestHoldingSymbol;
    private double bestPercent;
    private String worstHoldingSymbol;
    private double worstPercent;

    public PerformerDto() {}

    public void setBestHoldingSymbol(String bestHoldingSymbol) {
        this.bestHoldingSymbol = bestHoldingSymbol;
    }

    public void setBestPercent(double bestPercent) {
        this.bestPercent = bestPercent;
    }

    public void setWorstHoldingSymbol(String worstHoldingSymbol) {
        this.worstHoldingSymbol = worstHoldingSymbol;
    }

    public void setWorstPercent(double worstPercent) {
        this.worstPercent = worstPercent;
    }

    public String getBestHoldingSymbol() { return bestHoldingSymbol; }
    public double getBestPercent() { return bestPercent; }
    public String getWorstHoldingSymbol() { return worstHoldingSymbol; }
    public double getWorstPercent() { return worstPercent; }
}
