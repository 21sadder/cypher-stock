package SpkTeam.authDto;

import java.math.BigDecimal;

public class CoinsResponse {
    public String nameCurrency;
    private BigDecimal quantity;

    public CoinsResponse(String nameCurrency, BigDecimal quantity){
        this.nameCurrency = nameCurrency;
        this.quantity = quantity;
    }

    public CoinsResponse() {}

    public String getNameCurrency() {
        return nameCurrency;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }
}
