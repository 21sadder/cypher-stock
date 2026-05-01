import { Component, OnInit } from '@angular/core';
import { DecimalPipe, NgOptimizedImage } from '@angular/common';
import { PortfolioService } from '../portfolioService/portfolio-service';


@Component({
  selector: 'app-dashboard',
  imports: [DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  totalPrice: number = 0;
  priceChangingDayPercents: number = 2.45;
  priceChangingToday: number = 2847.32;

  // formats number 124567.89 to 124,567.89
  formatted = new Intl.NumberFormat('en-US').format(this.totalPrice);
  formattedPrice = new Intl.NumberFormat('uk-UA').format(this.priceChangingToday);

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit() {
    this.portfolioService.loadPortfolios();
  }

  loadPriceOfPortfolios() {
    return this.portfolioService.totalAllPortfolios();
  }
}
