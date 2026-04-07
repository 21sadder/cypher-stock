package SpkTeam.authDto;

public class CoinDto {
    public String symbol;
    public double price;
    public double quantity;

    public CoinDto(String symbol, double price, double quantity){
        this.symbol = symbol;
        this.price = price;
        this.quantity = quantity;
    }
}
