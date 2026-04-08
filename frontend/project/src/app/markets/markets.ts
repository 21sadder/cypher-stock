import { ChangeDetectorRef, Component, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Ws } from '../services/ws';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-markets',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './markets.html',
  styleUrl: './markets.css',
})
export class Markets implements OnInit {
  coins: any[] = [];

  constructor(
    private ws: Ws,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.ws.connect();
    }

    this.ws.messages$.subscribe((data) => {
      console.log('FROM SERVICE:', data);
      this.ngZone.run(() => {
        this.updateCoins(data);
        this.cdr.detectChanges(); // Примусово кажемо Angular перевірити зміни
      });
    });
  }

  updateCoins(data: any) {
    const index = this.coins.findIndex((c) => c.symbol === data.symbol);

    if (index !== -1) {
      this.coins = this.coins.map((c) => (c.symbol === data.symbol ? data : c));
    } else {
      this.coins = [...this.coins, data];
    }
  }
}
