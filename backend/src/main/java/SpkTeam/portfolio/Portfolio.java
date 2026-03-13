package SpkTeam.portfolio;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Entity
@Table(name = "portfolios")
public class Portfolio {
    @Id
    private long id;

    @Column(name = "user_email")
    private String userEmail;

    private String name;

    private String coin_symbol;

    private BigDecimal amount;

    private BigDecimal average_price;

    private Timestamp created_at;

    public void setId(Long id) {
        this.id = id;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCoin_symbol(String coin_symbol) {
        this.coin_symbol = coin_symbol;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public void setAverage_price(BigDecimal average_price) {
        this.average_price = average_price;
    }

    public void setCreated_at(Timestamp created_at) {
        this.created_at = created_at;
    }

    public Long getId() {
        return id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public String getName() {
        return name;
    }

    public String getCoin_symbol() {
        return coin_symbol;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public BigDecimal getAverage_price() {
        return average_price;
    }

    public Timestamp getCreated_at() {
        return created_at;
    }
}
