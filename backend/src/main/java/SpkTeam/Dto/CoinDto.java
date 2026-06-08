package SpkTeam.Dto;

public class CoinDto {
    public String symbol;
    public double price;
    public double change24h;
    public double volume;
    public double high24h;
    public double low24h;
    public String type;

    public CoinDto(String symbol, double price, double change24h, double volume, double high24h, double low24h, String type){
        this.symbol = symbol;
        this.price = price;
        this.change24h = change24h;
        this.volume = volume;
        this.high24h = high24h;
        this.low24h = low24h;
        this.type = type;
    }

    public String getSymbol() { return symbol; }
    public double getPrice() { return price; }
    public double getChange24h() { return change24h; }
    public double getVolume() { return volume; }
    public double getHigh24h() { return high24h; }
    public double getLow24h() { return low24h; }
    public String getType() { return type; }
}
