import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, map, throttleTime } from 'rxjs';
import { MarketItem } from '../interface/MarketItem';

@Injectable({
  providedIn: 'root',
})
export class Ws {
  private socket!: WebSocket;
  private subject = new BehaviorSubject<any[]>([]);

  private reconnectDelay = 2000; // 2 сек
  private isConnecting = false;
  private allAssets = new Map<string, any>();

  crypto$ = this.subject.pipe(
    throttleTime(1000),
    map((data) => data.filter((d: any) => d.type === 'CRYPTO')),
  );
  stock$ = this.subject.pipe(
    throttleTime(1000),
    map((data) => data.filter((d: any) => d.type === 'STOCK')),
  );
  forex$ = this.subject.pipe(
    throttleTime(1000),
    map((data) => data.filter((d: any) => d.type === 'FOREX')),
  );
  commodity$ = this.subject.pipe(
    throttleTime(1000),
    map((data) => data.filter((d: any) => d.type === 'COMMODITY')),
  );

  constructor(private ngZone: NgZone) {}

  connect() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) return;
    if (this.isConnecting) return;

    this.isConnecting = true;

    this.socket = new WebSocket('ws://localhost:8080/ws');

    this.socket.onopen = () => {
      console.log('WS connected');
      this.isConnecting = false;
    };

    this.socket.onmessage = (event) => {
      const item: MarketItem = JSON.parse(event.data);

      this.ngZone.run(() => {
        this.allAssets.set(item.symbol, item);
        this.subject.next(Array.from(this.allAssets.values()));
      });
    };

    this.socket.onclose = () => {
      console.log('WS closed');

      this.isConnecting = false;

      // reconnect
      setTimeout(() => {
        console.log('reconnecting...');
        this.connect();
      }, this.reconnectDelay);
    };

    this.socket.onerror = (err) => {
      console.error('WS error:', err);

      this.socket.close();
    };
  }
}
