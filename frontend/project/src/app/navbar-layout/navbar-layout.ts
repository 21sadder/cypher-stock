import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-navbar-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './navbar-layout.html',
  styleUrl: './navbar-layout.css',
})
export class NavbarLayout {
  isOpen = false;

  // opening of setting with dropdown
  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }
}
