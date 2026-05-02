import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ws } from '../services/ws';
import { MarketItem } from '../interface/MarketItem';

interface PortfolioDto {
  id: number;
  name: string;
  totalValue: number;
  totalCost: number;
  pnl: number;
  pnlPercent: number;
  holdingsCount: number;
}

interface HoldingDto {
  id: number;
  symbol: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  value: number;
  pnl: number;
  pnlPercent: number;
  type: string;
}

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  name = '';
  showForm = false;
  portfolios: PortfolioDto[] = [];
  selectedPortfolio: PortfolioDto | null = null;
  holdings: HoldingDto[] = [];
  onPriceUpdate: (() => void) | null = null;

  constructor(
    private http: HttpClient,
    private ws: Ws,
    private ngZone: NgZone,
  ) {
    this.loadPortfolios();
    this.ws.connect();

    this.ws.crypto$.subscribe((data) => {
      this.ngZone.run(() => {
        this.updatePortfoliosPrices(data);
      });
    });
    this.ws.stock$.subscribe((data) => {
      this.ngZone.run(() => {
        this.updatePortfoliosPrices(data);
      })
    })
    this.ws.commodity$.subscribe((data) => {
      this.ngZone.run(() => {
        this.updatePortfoliosPrices(data);
      })
    })
    this.ws.forex$.subscribe((data) => {
      this.ngZone.run(() => {
        this.updatePortfoliosPrices(data);
      })
    })
  }

  // function for updating all portfolio holdings and portfolio at all
  updatePortfoliosPrices(marketData: MarketItem[]) {
    if (!this.holdings.length) return;

    // making map for fast searching
    const priceMap = new Map<string, number>();
    for (const item of marketData) {
      priceMap.set(item.symbol, item.price);
    }

    // updating every holding
    for (const h of this.holdings) {
      const currentPrice = priceMap.get(h.symbol + 'USDT');
      if (!currentPrice) continue;

      h.currentPrice = currentPrice;
      h.value = h.quantity * currentPrice;
      const cost = h.quantity * h.avgBuyPrice;
      h.pnl = h.value - cost;
      h.pnlPercent = cost > 0 ? (h.pnl / cost) * 100 : 0;
    }

    // updating portfolio statistic
    if (this.selectedPortfolio) {
      let totalValue = 0;
      let totalCost = 0;

      for (const h of this.holdings) {
        totalValue += h.value;
        totalCost += h.quantity * h.avgBuyPrice;
      }

      this.selectedPortfolio.totalValue = totalValue;
      this.selectedPortfolio.totalCost = totalCost;
      this.selectedPortfolio.pnl = totalValue - totalCost;
      this.selectedPortfolio.pnlPercent =
        totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0;

      // оновлюємо також в масиві portfolios ← це важливо!
      const idx = this.portfolios.findIndex((p) => p.id === this.selectedPortfolio!.id);
      if (idx !== -1) {
        this.portfolios[idx] = { ...this.selectedPortfolio };
      }
    }
    if (this.onPriceUpdate) {
      this.onPriceUpdate();
    }
  }

  // load all portfolios on start
  loadPortfolios() {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    this.http.get<PortfolioDto[]>('http://localhost:8080/portfolios', { headers }).subscribe({
      next: (data) => {
        this.portfolios = data;
        // automatically select first portfolio if exists
        if (this.portfolios.length > 0) {
          this.selectedPortfolio = this.portfolios[0];
          this.loadHoldings(this.portfolios[0].id);
        }
      },
      error: (err) => console.log(err),
    });
  }

  createNewPortfolio() {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const body = {
      name: this.name,
    };

    this.http.post('http://localhost:8080/portfolios', body, { headers }).subscribe({
      next: (newPortfolio: any) => {
        this.portfolios.push(newPortfolio); // add to list
        this.selectedPortfolio = newPortfolio; // auto selected new portfolio
        this.name = ''; // clear input
        this.showForm = false; // hide form
      },
      error: (err) => console.log(err),
    });
  }

  loadHoldings(portfolioId: number) {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http
      .get<HoldingDto[]>(`http://localhost:8080/portfolios/${portfolioId}/holdings`, { headers })
      .subscribe({
        next: (data) => {
          this.holdings = data.map((t) => ({
            ...t,
            symbol: t.symbol.replace('USDT', ''),
          }));
        },
        error: (err) => console.log(err),
      });
  }

  // select portfolio from sidebar
  selectPortfolio(portfolio: PortfolioDto) {
    this.selectedPortfolio = portfolio;
    this.loadHoldings(portfolio.id);
  }

  // calculate total value of all portfolios
  totalAllPortfolios(): number {
    return this.portfolios.reduce((sum, p) => sum + p.totalValue, 0);
  }

  totalPnlFromAllPortfolios(): number {
    return this.portfolios.reduce((sum, p) => sum + p.pnl, 0);
  }

  totalRoi(): number {
    const totalValue = this.portfolios.reduce((sum, p) => sum + p.totalValue, 0);
    const totalCost = this.portfolios.reduce((sum, p) => sum + p.totalCost, 0);
    return totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0;
  }
}
