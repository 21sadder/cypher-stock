import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { CryptoWebsocket } from '../services/crypto-websocket';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [DecimalPipe], // CommonModule більше не потрібен
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, OnDestroy {
  cryptoData: any[] = [];

  constructor(
    private wsService: CryptoWebsocket,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.wsService.connect((data: any) => {
      this.ngZone.run(() => {
        const index = this.cryptoData.findIndex((c) => c.symbol === data.s);
        if (index !== -1) {
          this.cryptoData = [
            ...this.cryptoData.slice(0, index),
            { symbol: data.s, price: data.c },
            ...this.cryptoData.slice(index + 1),
          ];
        } else {
          this.cryptoData = [...this.cryptoData, { symbol: data.s, price: data.c }];
        }
        this.cdr.detectChanges();
      });
    });
  }

  ngOnDestroy(): void {
    this.wsService.disconnect();
  }
}
