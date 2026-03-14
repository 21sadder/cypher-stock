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

  userCoins: { nameCurrency: string, quantity: number }[] = [];
  userPortfolio: { symbol: string, quantity: number, value: number }[] = [];
  totalBalance: number = 0;

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

        this.recalculatePortfolio(); // при обновлении цены в вебсокете вызывает метод снова
        this.cdr.detectChanges();
      });
    });

    this.http.get<any[]>(`http://localhost:8080/api/auth/values?email=${this.email}`).subscribe({
      next: (response) => {
        console.log("Coins: " + response);
        this.userCoins = response; // сохраняет коины юзера в масив с резпонза который приход с бекенда
      },
      error: (err) => console.error("Coins: " + err)
    });
  }

  // метод для того, чтобы подсчитывать цену портфолио
  recalculatePortfolio() {
    this.userPortfolio = []; // скидываем каждый раз, чтобы не дублировался бесконечное колво раз
    this.totalBalance = 0; // и баланс тоже скидываем


    /* проходимся по масиву сохраненных токенов
    * и ищем соответствия в масиве данных cryptoData (масив в который парсим данные с апи бинанса)
    * потом берем оттуда цену и умножаем на колво которое пришло с бека
    * сохраняем это все в отдельный масив и потом используем его чтобы все вывести
    */
    for (let coin of this.userCoins) {
      const data = this.cryptoData.find((d) => d.symbol === coin.nameCurrency);

      if (data) {
        let value = parseFloat(data.price) * coin.quantity;
        this.userPortfolio.push({ symbol: coin.nameCurrency, quantity: coin.quantity, value: value });
        this.totalBalance += value;
      } else {
        console.warn(`Coin not found for ${coin.nameCurrency}`);
      }
    }
  }

  ngOnDestroy(): void {
    this.wsService.disconnect();
  }
}
