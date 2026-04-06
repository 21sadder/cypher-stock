import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  totalPrice: number = 124567.89;
  priceChangingDayPercents: number = 2.45;
  priceChangingToday: number = 2847.32;

  // formats number 124567.89 to 124,567.89
  formatted = new Intl.NumberFormat('en-US').format(this.totalPrice);
  formattedPrice = new Intl.NumberFormat('uk-UA').format(this.priceChangingToday);
}
