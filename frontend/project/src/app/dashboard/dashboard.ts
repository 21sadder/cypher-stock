import { Component, OnInit, OnDestroy } from '@angular/core';
import { BinanceApi } from './../binance-api';
import { interval, startWith, Subject, switchMap, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  cryptoData: any[] = [];
  private destroy$ = new Subject<void>(); // object for detecting destroying

  constructor(private binanceService: BinanceApi) {}

  ngOnInit() {
    interval(5000)
      .pipe(
        startWith(0),
        switchMap(() => this.binanceService.getAllPrice()),
        takeUntil(this.destroy$)
      )
      .subscribe((data: any[]) => {
        console.log('Дані отримані з сервісу:', data);
        const usdtPairs = data.filter(item => item.symbol.endsWith('USDT'));
        this.cryptoData = usdtPairs.slice(0, 5);
    });
  }

  ngOnDestroy() {
    this.destroy$.next(); // signal to stop parsing data
    this.destroy$.complete();
  }
}
