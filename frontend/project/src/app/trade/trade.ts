import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-trade',
  imports: [HttpClientModule],
  templateUrl: './trade.html',
  styleUrl: './trade.css',
})
export class Trade {
  symbol = '';
  quantity = 0.0;
  avgBuyPrice = 0.0;
  type = '';

  constructor(private http: HttpClient) {}

  addHolding() {
    const body = {
      symbol: this.symbol,
      quantity: this.quantity,
      avgBuyPrice: this.avgBuyPrice,
      type: this.type,
    };

    this.http.post<any>('http://localhost:8080/portfolios/{id}/holdings', body);
  }
}
