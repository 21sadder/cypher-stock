import { ChangeDetectorRef, Component, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Ws } from '../services/ws'; // websocket service
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MarketItem } from '../interface/MarketItem';
// our interface that describes the structure of a single asset (symbol, price, type...)

// declaring the Angular component
@Component({
  selector: 'app-markets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './markets.html',
  styleUrl: './markets.css',
})

// component class implements OnInit — meaning it has the ngOnInit() lifecycle hook
export class Markets implements OnInit {
  // active tab — determines which list to display
  // type is restricted to four values, defaults to CRYPTO
  activeTab: 'CRYPTO' | 'STOCK' | 'FOREX' | 'COMMODITY' = 'CRYPTO';

  // arrays for storing assets of each type
  // MarketItem[] — array of MarketItem objects
  // [] — initially empty, populated after WebSocket connection is established
  cryptos: MarketItem[] = [];
  stocks: MarketItem[] = [];
  forex: MarketItem[] = [];
  commodities: MarketItem[] = [];

  constructor(
    private ws: Ws, // injecting our WebSocket service
    private ngZone: NgZone, // injecting NgZone to handle WebSocket updates
    private cdr: ChangeDetectorRef, // injecting to manually trigger change detection
    @Inject(PLATFORM_ID) private platformId: Object, // injecting platform token (browser/server)
  ) {}

  // getter — computed property, accessed like a regular variable
  // returns the correct array based on the currently active tab
  // Angular automatically calls it during every change detection cycle
  get activeData(): MarketItem[] {
    switch (this.activeTab) {
      case 'CRYPTO': return this.cryptos; // if active tab is CRYPTO — return cryptos
      case 'STOCK': return this.stocks; // if STOCK — return stocks
      case 'FOREX': return this.forex; // if FOREX — return forex
      case 'COMMODITY': return this.commodities; // if COMMODITY — return commodities
    }
  }

  // method for switching tabs
  // called from HTML on button click: (click)="setTab('CRYPTO')"
  setTab(tab: 'CRYPTO' | 'STOCK' | 'FOREX' | 'COMMODITY') {
    this.activeTab = tab; // updating active tab → activeData getter automatically returns new array
  }

  // ngOnInit is called by Angular once after the component is created
  ngOnInit() {
    // checking whether code is running in the browser
    // important for SSR — WebSocket does not exist on the server
    if (isPlatformBrowser(this.platformId)) {
      this.ws.connect(); // opening WebSocket connection to the backend
    }

    // subscribing to the crypto stream
    // crypto$ automatically emits a new array every time new data arrives
    this.ws.crypto$.subscribe((data) => {
      // ngZone.run() — tells Angular that changes have occurred
      // WebSocket runs outside Angular's zone, so without ngZone the UI won't update
      this.ngZone.run(() => {
        this.cryptos = data; // updating the crypto array
        this.cdr.detectChanges(); // manually triggering change detection → Angular re-renders UI
      });
    });

    // subscribing to the commodities stream (gold, oil...)
    this.ws.commodity$.subscribe((data) => {
      this.ngZone.run(() => {
        this.commodities = data; // updating the commodities array
        this.cdr.detectChanges();
      });
    });

    // subscribing to the stocks stream
    this.ws.stock$.subscribe((data) => {
      this.ngZone.run(() => {
        this.stocks = data; // updating the stocks array
        this.cdr.detectChanges();
      });
    });

    // subscribing to the forex stream
    this.ws.forex$.subscribe((data) => {
      this.ngZone.run(() => {
        this.forex = data; // updating the forex array
        this.cdr.detectChanges(); // forcing Angular to check for changes
      });
    });
  }
}
