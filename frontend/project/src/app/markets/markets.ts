import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { Ws } from '../services/ws';
import { CommonModule, DecimalPipe, isPlatformBrowser } from '@angular/common';
import { MarketItem } from '../interface/MarketItem';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-markets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './markets.html',
  styleUrl: './markets.css',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class Markets implements OnInit {
  cryptos: MarketItem[] = [];
  stocks: MarketItem[] = [];
  forex: MarketItem[] = [];
  commodities: MarketItem[] = [];

  activeFilter: 'ALL' | 'GAINERS' | 'LOSERS' | 'FAVORITES' = 'ALL';
  searchQuery = '';
  favorites = new Set<string>();

  constructor(
    private ws: Ws,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  get allData(): MarketItem[] {
    return [...this.cryptos, ...this.stocks, ...this.forex, ...this.commodities]
      .sort((a, b) => (b.volume * b.price) - (a.volume * a.price));
  }

  get gainers(): MarketItem[] {
    return this.allData.filter(i => i.change24h >= 0);
  }

  get filteredData(): MarketItem[] {
    let data = this.allData;
    if (this.activeFilter === 'GAINERS') data = data.filter(i => i.change24h >= 0);
    if (this.activeFilter === 'LOSERS') data = data.filter(i => i.change24h < 0);
    if (this.activeFilter === 'FAVORITES') data = data.filter(i => this.favorites.has(i.symbol));
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      data = data.filter(i => i.symbol.toLowerCase().includes(q));
    }
    return data;
  }

  get totalVolume(): string {
    const total = this.allData.reduce((sum, i) => sum + i.volume, 0);
    if (total >= 1_000_000_000) return (total / 1_000_000_000).toFixed(1) + 'B';
    if (total >= 1_000_000) return (total / 1_000_000).toFixed(1) + 'M';
    return total.toFixed(0);
  }

  setFilter(f: 'ALL' | 'GAINERS' | 'LOSERS' | 'FAVORITES') {
    this.activeFilter = f;
  }

  toggleFav(symbol: string) {
    if (this.favorites.has(symbol)) this.favorites.delete(symbol);
    else this.favorites.add(symbol);
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) this.ws.connect();

    this.ws.crypto$.subscribe(data => {
      if (data.length > 0) console.log('Sample item:', data[0]);
      this.cryptos = [...data];
      this.cdr.detectChanges();
    });
    this.ws.commodity$.subscribe(data => {
      this.commodities = [...data];
      this.cdr.detectChanges();
    });
    this.ws.stock$.subscribe(data => {
      this.stocks = [...data];
      this.cdr.detectChanges();
    });
    this.ws.forex$.subscribe(data => {
      this.forex = [...data];
      this.cdr.detectChanges();
    });
  }
}
