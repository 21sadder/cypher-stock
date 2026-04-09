package SpkTeam.authDto;

public class CoinDto {
    public String symbol;
    public double price;
    public double change24h;
    public double volume;
    public String type;

    public CoinDto(String symbol, double price, double change24h, double volume, String type){
        this.symbol = symbol;
        this.price = price;
        this.change24h = change24h;
        this.volume = volume;
        this.type = type;
    }

}
