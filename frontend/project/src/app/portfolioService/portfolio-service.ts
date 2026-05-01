import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
export class PortfolioService implements OnInit {
  name = '';
  showForm = false;
  portfolios: PortfolioDto[] = [];
  selectedPortfolio: PortfolioDto | null = null;
  holdings: HoldingDto[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadPortfolios();
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
