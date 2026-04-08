import { ChangeDetectorRef, Component, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Ws } from '../services/ws';
import { DecimalPipe, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-navbar-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, DecimalPipe],
  templateUrl: './navbar-layout.html',
  styleUrl: './navbar-layout.css',
})
export class NavbarLayout implements OnInit {
  isOpen = false;
  selectedCoin: any = null;

  constructor(
    private ws: Ws,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  // opening of setting with dropdown
  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.ws.connect();
    }

    this.ws.messages$.subscribe((data) => {
      // filter for btc
      if (data.symbol === 'BTCUSDT') {
        this.ngZone.run(() => {
          this.selectedCoin = data;
          this.cdr.detectChanges();
        });
      }
    });
  }
}
