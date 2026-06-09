import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe, JsonPipe, NgOptimizedImage } from '@angular/common';
import { PortfolioService } from '../portfolioService/portfolio-service';
import { HttpClient } from '@angular/common/http';
import { AccountChart } from '../account-chart/account-chart';
import { RouterLink } from '@angular/router';

export interface PerformerDto {
  bestHoldingSymbol: string;
  bestPercent: number;
  worstHoldingSymbol: string;
  worstPercent: number;
}


@Component({
  selector: 'app-dashboard',
  imports: [DecimalPipe, AccountChart, DatePipe, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  totalPrice: number = 0;
  priceChangingDayPercents: number = 2.45;
  priceChangingToday: number = 2847.32;

  statistics: any = {
    bestHoldingSymbol: '',
    bestPercent: 0,
    worstHoldingSymbol: '',
    worstPercent: 0,
  };

  recentOrders: any[] = [];

  // formats number 124567.89 to 124,567.89
  formatted = new Intl.NumberFormat('en-US').format(this.totalPrice);
  formattedPrice = new Intl.NumberFormat('uk-UA').format(this.priceChangingToday);

  constructor(
    protected portfolioService: PortfolioService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.portfolioService.loadPortfolios();
    this.getStatistics();
    this.loadRecentOrders();
  }

  getStatistics() {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any>('http://localhost:8080/portfolios/statistics', { headers }).subscribe({
      next: (data) => {
        console.log('statistics JSON:', JSON.stringify(data));
        this.statistics = data;
        this.cdr.markForCheck();
      },
      error: (err) => console.error(err),
    });
  }

  getAssetTypes(): string {
    const types = new Set(
      this.portfolioService.holdings
        .filter((h) => h.symbol !== 'USDT' && h.symbol !== 'USDTUSDT')
        .map((h) => h.type),
    );
    return Array.from(types).join(', ');
  }

  loadRecentOrders() {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    // беремо перший портфель — або можна зробити для всіх
    const portfolioId = this.portfolioService.portfolios[0]?.id;
    if (!portfolioId) return;

    this.http
      .get<any[]>(`http://localhost:8080/trade/${portfolioId}/history`, { headers })
      .subscribe({
        next: (data) => {
          this.recentOrders = data.slice(0, 5); // показуємо тільки 5 останніх
          this.cdr.markForCheck();
        },
        error: (err) => console.error(err),
      });
  }

  onIconError(event: any) {
    event.target.style.display = 'none';
    if (event.target.nextSibling) {
      event.target.nextSibling.style.display = 'flex';
    }
  }

  loadPriceOfPortfolios() {
    return this.portfolioService.totalAllPortfolios();
  }

  loadPnlFromAllPortfolios() {
    return this.portfolioService.totalPnlFromAllPortfolios();
  }

  totalRoi(): number {
    return this.portfolioService.totalRoi();
  }
}
