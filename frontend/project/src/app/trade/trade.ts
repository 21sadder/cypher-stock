import { ChangeDetectorRef, Component, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioService } from '../portfolioService/portfolio-service';
import { MarketItem } from '../interface/MarketItem';
import { Ws } from '../services/ws';
import { createChart, CandlestickSeries } from 'lightweight-charts';

interface HoldingDto {
  id: number;
  symbol: string;
  quantity: number;
  type: string;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

@Component({
  selector: 'app-trade',
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './trade.html',
  styleUrl: './trade.css',
})
export class Trade implements OnInit {
  activeTab: 'All' | 'CRYPTO' | 'FOREX' | 'COMMODITY' | 'STOCK' = 'All';

  allActivities: MarketItem[] = [];
  cryptos: MarketItem[] = [];
  stocks: MarketItem[] = [];
  forex: MarketItem[] = [];
  commodities: MarketItem[] = [];

  // add форма
  selectedPortfolioId: number | null = null;
  symbol = '';
  quantity = 0;
  avgBuyPrice = 0;
  type = 'CRYPTO';

  // remove форма
  selectedHoldingId: number | null = null;
  holdings: HoldingDto[] = [];

  // повідомлення
  errorMsg = '';
  successMsg = '';

  selectedItem!: MarketItem;
  activeData: MarketItem[] = [];

  constructor(
    private http: HttpClient,
    public portfolioService: PortfolioService,
    private ws: Ws,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  selectItem(item: MarketItem) {
    this.selectedItem = item;
    this.loadTradingView()
    this.cdr.detectChanges();
  }

  updateAllActivities() {
    this.allActivities = [...this.cryptos, ...this.stocks, ...this.forex, ...this.commodities];
  }

  updateSelectedItem() {
    if (!this.selectedItem) return;

    const updated = this.allActivities.find((i) => i.symbol === this.selectedItem.symbol);
    if (updated) {
      this.selectedItem = updated;
    }
  }

  updateActiveData() {
    switch (this.activeTab) {
      case 'All':
        this.activeData = this.allActivities;
        break;
      case 'CRYPTO':
        this.activeData = this.cryptos;
        break;
      case 'FOREX':
        this.activeData = this.forex;
        break;
      case 'COMMODITY':
        this.activeData = this.commodities;
        break;
      case 'STOCK':
        this.activeData = this.stocks;
        break;
    }
  }

  setTab(tab: 'All' | 'CRYPTO' | 'FOREX' | 'COMMODITY' | 'STOCK') {
    this.activeTab = tab;
    this.updateActiveData();
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    this.loadTradingView();
  }

  private loadTradingView(): void {
    const script = document.createElement('script');

    script.src = 'https://s3.tradingview.com/tv.js';

    script.onload = () => {
      new window.TradingView.widget({
        container_id: 'tradingview_chart',
        autosize: true,
        symbol: 'BINANCE:' + this.selectedItem.symbol,
        interval: '15',
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1',
        locale: 'en',
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: true,
      });
    };

    document.body.appendChild(script);
  }

  ngOnInit() {
    // вибираємо перший портфель за замовчуванням
    // if (this.portfolioService.portfolios.length > 0) {
    //   this.selectedPortfolioId = this.portfolioService.portfolios[0].id;
    //   this.loadHoldings();
    // }

    if (isPlatformBrowser(this.platformId)) {
      this.ws.connect();
    }

    this.ws.crypto$.subscribe((data) => {
      this.ngZone.run(() => {
        this.cryptos = data;

        if (!this.selectedItem && data.length > 0) {
          this.selectedItem = data[0];
        }

        this.updateSelectedItem();
        this.updateAllActivities();
        this.updateActiveData();
        this.cdr.detectChanges();
      });
    });

    this.ws.commodity$.subscribe((data) => {
      this.ngZone.run(() => {
        this.commodities = data;
        this.updateAllActivities();
        this.updateActiveData();

        // select first item automatic
        if (!this.selectedItem && data.length > 0) {
          this.selectedItem = data[0];
        }

        this.updateSelectedItem();
        this.cdr.detectChanges();
      });
    });

    this.ws.forex$.subscribe((data) => {
      this.ngZone.run(() => {
        this.forex = data;

        if (!this.selectedItem && data.length > 0) {
          this.selectedItem = data[0];
        }

        this.updateAllActivities();
        this.updateActiveData();
        this.updateSelectedItem();
        this.cdr.detectChanges();
      });
    });

    this.ws.stock$.subscribe((data) => {
      this.ngZone.run(() => {
        this.stocks = data;

        if (!this.selectedItem && data.length > 0) {
          this.selectedItem = data[0];
        }

        this.updateAllActivities();
        this.updateActiveData();
        this.updateSelectedItem();
        this.cdr.detectChanges();
      });
    });
  }

  loadHoldings() {
    if (!this.selectedPortfolioId) return;

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http
      .get<
        HoldingDto[]
      >(`http://localhost:8080/portfolios/${this.selectedPortfolioId}/holdings`, { headers })
      .subscribe({
        next: (data) => (this.holdings = data),
        error: (err) => console.error(err),
      });
  }

  addHolding() {
    this.errorMsg = '';
    this.successMsg = '';

    // валідація
    if (!this.selectedPortfolioId) {
      this.errorMsg = 'Please select a portfolio';
      return;
    }
    if (!this.symbol) {
      this.errorMsg = 'Please enter a symbol';
      return;
    }
    if (this.quantity <= 0) {
      this.errorMsg = 'Quantity must be greater than 0';
      return;
    }
    if (this.avgBuyPrice <= 0) {
      this.errorMsg = 'Buy price must be greater than 0';
      return;
    }

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const body = {
      symbol: this.symbol,
      quantity: this.quantity,
      avgBuyPrice: this.avgBuyPrice,
      type: this.type,
    };

    this.http
      .post<any>(`http://localhost:8080/portfolios/${this.selectedPortfolioId}/holdings`, body, {
        headers,
      })
      .subscribe({
        next: () => {
          this.successMsg = `${this.symbol} added successfully!`;
          this.portfolioService.loadPortfolios(); // оновлюємо портфелі
          this.resetForm();
        },
        error: () => (this.errorMsg = 'Something went wrong'),
      });
  }

  removeHolding() {
    this.errorMsg = '';
    this.successMsg = '';

    if (!this.selectedPortfolioId || !this.selectedHoldingId) {
      this.errorMsg = 'Please select a portfolio and token';
      return;
    }

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http
      .delete(
        `http://localhost:8080/portfolios/${this.selectedPortfolioId}/holdings/${this.selectedHoldingId}`,
        { headers },
      )
      .subscribe({
        next: () => {
          this.successMsg = 'Token removed successfully!';
          this.portfolioService.loadPortfolios(); // оновлюємо портфелі
          this.loadHoldings(); // оновлюємо список токенів
          this.selectedHoldingId = null;
        },
        error: () => (this.errorMsg = 'Something went wrong'),
      });
  }

  resetForm() {
    this.symbol = '';
    this.quantity = 0;
    this.avgBuyPrice = 0;
    this.type = 'CRYPTO';
  }
}
