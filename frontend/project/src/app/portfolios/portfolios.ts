import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AllocationWidgetComponent } from '../allocation-widget/allocation-widget';
import { PortfolioService } from '../portfolioService/portfolio-service';
import { PortfolioChart } from '../portfolio-chart/portfolio-chart';

@Component({
  selector: 'app-portfolios',
  imports: [
    FormsModule,
    HttpClientModule,
    CommonModule,
    AllocationWidgetComponent,
    PortfolioChart
  ],
  standalone: true,
  templateUrl: './portfolios.html',
  styleUrl: './portfolios.css',
})
export class Portfolios implements OnInit {
  constructor(
    public portfolioService: PortfolioService, // public щоб HTML міг звертатись
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
  ) {}

  ngOnInit() {
    // підписуємось на оновлення цін щоб Angular перемальовував UI
    this.portfolioService.onPriceUpdate = () => {
      this.ngZone.run(() => this.cdr.detectChanges());
    };
  }

  toggleForm() {
    this.portfolioService.showForm = !this.portfolioService.showForm;
    this.portfolioService.name = '';
  }

  onIconError(event: any) {
    event.target.style.display = 'none';
    event.target.nextSibling.style.display = 'flex';
  }
}
