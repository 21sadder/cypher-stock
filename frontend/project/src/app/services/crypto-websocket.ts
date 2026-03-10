import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Client } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root',
})
export class CryptoWebsocket {
  private client: Client | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  connect(callback: (data: any) => void) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Якщо вже є активне з'єднання — не створювати нове
    if (this.client && this.client.active) {
      return;
    }

    // Завжди створювати новий Client
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      reconnectDelay: 5000,

      onConnect: () => {
        console.log('WebSocket connected');
        this.client!.subscribe('/topic/prices', (message) => {
          try {
            const data = JSON.parse(message.body);
            this.client!.subscribe('/topic/prices', (message) => {
              try {
                const data = JSON.parse(message.body);
                console.log('=== subscribe message received, calling callback ===');
                callback(data);
              } catch (e) {
                console.error('Failed to parse message:', e);
              }
            });
            callback(data);
          } catch (e) {
            console.error('Failed to parse message:', e);
          }
        });
      },

      onStompError: (frame) => {
        console.error('STOMP error:', frame);
      },
      onWebSocketError: (event) => {
        console.error('WebSocket error:', event);
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected');
      },
    });

    this.client.activate();
  }

  disconnect() {
    if (this.client && this.client.active) {
      this.client.deactivate();
      this.client = null; // ✅ Обнуляємо щоб наступний connect() створив новий
    }
  }
}
