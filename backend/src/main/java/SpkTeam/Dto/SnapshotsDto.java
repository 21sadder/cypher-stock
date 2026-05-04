package SpkTeam.Dto;

import SpkTeam.entity.AccountSnapshot;
import SpkTeam.entity.PortfolioSnapshot;

import java.time.format.DateTimeFormatter;

public class SnapshotsDto {
    private double totalValue;
    private String date;

    public SnapshotsDto(PortfolioSnapshot snapshot){
        this.totalValue = snapshot.getTotalValue();
        this.date = snapshot.getRecordedAt().format(DateTimeFormatter.ofPattern("MMM d"));
    }

    public SnapshotsDto(AccountSnapshot snapshot){
        this.totalValue = snapshot.getTotalValue();
        this.date = snapshot.getRecordedAt().format(DateTimeFormatter.ofPattern("MMM d"));
    }

    public double getTotalValue() {
        return totalValue;
    }

    public String getDate() {
        return date;
    }
}
