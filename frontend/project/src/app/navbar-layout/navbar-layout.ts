import { ChangeDetectorRef, Component, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Ws } from '../services/ws';
import { DecimalPipe, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../auth-service';

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
    private authService: AuthService,
  ) {}

  get username(): string {
    return this.authService.getUsername() || 'User';
  }

  get initials(): string {
    return this.username.slice(0, 2).toUpperCase();
  }

  // opening of setting with dropdown
  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  logout() {
    this.authService.logout();
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.ws.connect();
    }

    this.ws.crypto$.subscribe((data) => {
      const btc = data.find((d) => d.symbol === 'BTCUSDT');
      // filter for btc
      if (btc) {
        this.ngZone.run(() => {
          this.selectedCoin = btc;
          this.cdr.detectChanges();
        });
      }
    });
  }
}
