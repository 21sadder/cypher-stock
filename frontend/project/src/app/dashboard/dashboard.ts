import {
  Component,
  OnInit,
  OnDestroy,
  NgZone,
  ChangeDetectorRef,
  AfterViewInit, inject,
} from '@angular/core';
import { CryptoWebsocket } from '../services/crypto-websocket';
import { DecimalPipe } from '@angular/common';
import Chart from 'chart.js/auto';
import { response } from 'express';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  imports: [DecimalPipe], // CommonModule більше не потрібен
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, OnDestroy, AfterViewInit {
  cryptoData: any[] = [];
  chart: any;

  email = 'iliasapa5@gmail.com';
  private http = inject(HttpClient);

  // userCoins: any[];

  constructor(
    private wsService: CryptoWebsocket,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;

    this.chart = new Chart(ctx, {
      type: 'line',

      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr'],

        datasets: [
          {
            label: 'BTCUSDT',
            data: this.cryptoData,
            borderColor: 'blue',
            borderWidth: 2,
          },
        ],
      },
    });
  }

  ngOnInit(): void {
    this.wsService.connect((data: any) => {
      this.ngZone.run(() => {
        const index = this.cryptoData.findIndex((c) => c.symbol === data.s);
        if (index !== -1) {
          this.cryptoData = [...this.cryptoData.slice(0, index), { symbol: data.s, price: data.c }, ...this.cryptoData.slice(index + 1)];
        } else {
          this.cryptoData = [...this.cryptoData, { symbol: data.s, price: data.c }];
        }
        this.cdr.detectChanges();
      });
    });

    this.http.get(`http://localhost:8080/api/auth/values?email=${this.email}`).subscribe({
      next: (response) => {
        console.log("Coins: " + response);
      },
      error: (err) => console.error("Coins: " + err)
    });

    
  }

  ngOnDestroy(): void {
    this.wsService.disconnect();
  }
}
