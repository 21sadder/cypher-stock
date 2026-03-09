import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root', // its access every component to this service
})
export class BinanceApi {
  constructor(private httpClient: HttpClient) {}

  getSymbolPrice(symbol: string) {
    return this.httpClient.get<any[]>(
      `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`,
    );
  }

  getAllPrice(){
    return this.httpClient.get<any[]>(`https://api.binance.com/api/v3/ticker/price`);
  }
}
