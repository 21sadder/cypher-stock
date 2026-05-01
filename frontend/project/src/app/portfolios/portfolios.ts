import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AllocationWidgetComponent } from '../allocation-widget/allocation-widget';
import { PortfolioService } from '../portfolioService/portfolio-service';


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

@Component({
  selector: 'app-portfolios',
  imports: [FormsModule, HttpClientModule, CommonModule, AllocationWidgetComponent],
  standalone: true,
  templateUrl: './portfolios.html',
  styleUrl: './portfolios.css',
})
export class Portfolios implements OnInit {
  name = '';
  showForm = false;
  portfolios: PortfolioDto[] = [];
  selectedPortfolio: PortfolioDto | null = null;
  holdings: HoldingDto[] = [];

  constructor(private http: HttpClient, private portfolioService: PortfolioService) {}

  ngOnInit() {
    this.portfolioService.loadPortfolios();
    this.loadPortfolios();
  }

  // load all portfolios on start
  loadPortfolios() {
    this.portfolioService.loadPortfolios();

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

    this.http.get<HoldingDto[]>(`http://localhost:8080/portfolios/${portfolioId}/holdings`, { headers })
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

  // show/hide create form
  toggleForm() {
    this.showForm = !this.showForm;
    this.name = '';
  }

  // calculate total value of all portfolios
  totalPriceAllPortfolios(): number {
    return this.portfolioService.totalAllPortfolios();
  }

  onIconError(event: any) {
    // якщо іконки немає — показуємо першу літеру символу
    event.target.style.display = 'none';
    event.target.nextSibling.style.display = 'flex';
  }
}
