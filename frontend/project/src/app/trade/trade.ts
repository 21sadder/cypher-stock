import {
  ChangeDetectorRef,
  Component,
  inject,
  Inject,
  NgZone,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioService } from '../portfolioService/portfolio-service';
import { MarketItem } from '../interface/MarketItem';
import { Ws } from '../services/ws';
import { createChart, CandlestickSeries } from 'lightweight-charts';
import { AuthService } from '../auth-service';
import { Router } from '@angular/router';

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
  authService = inject(AuthService);
  private router = inject(Router);

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

  holdings: HoldingDto[] = [];

  selectedItem!: MarketItem;
  activeData: MarketItem[] = [];

  searchTerm = '';

  buyQuantity = 0;
  sellQuantity = 0;
  tradeError = '';
  tradeSuccess = '';
  activeTradeTab: 'buy' | 'sell' = 'buy';

  constructor(
    private http: HttpClient,
    public portfolioService: PortfolioService,
    private ws: Ws,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  goToLogin() {
    this.router.navigate(['/register']);
  }

  selectItem(item: MarketItem) {
    this.selectedItem = item;
    this.loadTradingView();
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

  get filteredAssets() {
    return this.activeData.filter((item) =>
      item.symbol.toLowerCase().includes(this.searchTerm.toLowerCase()),
    );
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

  onIconError(event: any) {
    event.target.style.display = 'none';
    event.target.nextSibling.style.display = 'flex';
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
        next: (data) => {
          this.holdings = data;
          console.log('STATISTICS:', data);
        },
        error: (err) => console.error(err),
      });
  }

  buy() {
    this.tradeError = '';
    this.tradeSuccess = '';

    if (!this.selectedPortfolioId) {
      this.tradeError = 'Please select a portfolio';
      return;
    }
    if (this.buyQuantity <= 0) {
      this.tradeError = 'Quantity must be greater than 0';
      return;
    }

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const body = {
      symbol: this.selectedItem.symbol,
      type: this.selectedItem.type,
      quantity: this.buyQuantity,
    };

    this.http
      .post<any>(`http://localhost:8080/trade/${this.selectedPortfolioId}/buy`, body, { headers })
      .subscribe({
        next: (res) => {
          this.tradeSuccess = `Bought ${res.quantity} ${res.symbol} at $${res.price}`;
          this.buyQuantity = 0;
          this.portfolioService.loadPortfolios();
        },
        error: (err) => (this.tradeError = err.error?.message || 'Something went wrong'),
      });
  }

  sell() {
    this.tradeError = '';
    this.tradeSuccess = '';

    if (!this.selectedPortfolioId) {
      this.tradeError = 'Please select a portfolio';
      return;
    }
    if (this.sellQuantity <= 0) {
      this.tradeError = 'Quantity must be greater than 0';
      return;
    }

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const body = {
      symbol: this.selectedItem.symbol,
      type: this.selectedItem.type,
      quantity: this.sellQuantity,
    };

    this.http
      .post<any>(`http://localhost:8080/trade/${this.selectedPortfolioId}/sell`, body, { headers })
      .subscribe({
        next: (res) => {
          this.tradeSuccess = `Sold ${res.quantity} ${res.symbol} at $${res.price}`;
          this.sellQuantity = 0;
          this.portfolioService.loadPortfolios();
        },
        error: (err) => (this.tradeError = err.error?.message || 'Something went wrong'),
      });
  }

  getUsdtBalance(): number {
    const usdt = this.holdings.find((h) => h.symbol === 'USDT' || h.symbol === 'USDTUSDT');
    return usdt ? usdt.quantity : 0;
  }

  getTokenBalance(): number {
    if (!this.selectedItem) return 0;
    const token = this.holdings.find((h) => h.symbol === this.selectedItem.symbol);
    return token ? token.quantity : 0;
  }
}
