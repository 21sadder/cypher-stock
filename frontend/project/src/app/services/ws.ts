import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Ws {
  private socket!: WebSocket;
  private subject = new Subject<any>();

  private reconnectDelay = 2000; // 2 сек
  private isConnecting = false;

  messages$ = this.subject.asObservable();

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
      const data = JSON.parse(event.data);

      this.ngZone.run(() => {
        this.subject.next(data);
      });
    };

    this.socket.onclose = () => {
      console.log('WS closed');

      this.isConnecting = false;

      // reconnect
      setTimeout(() => {
        console.log('🔄 Reconnecting...');
        this.connect();
      }, this.reconnectDelay);
    };

    this.socket.onerror = (err) => {
      console.error('WS error:', err);

      this.socket.close();
    };
  }
}
