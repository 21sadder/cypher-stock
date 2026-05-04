import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DecimalPipe, CommonModule } from '@angular/common';

Chart.register(...registerables);

interface HoldingDto {
  id: number;
  symbol: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  value: number;
  pnl: number;
  pnlPercent: number;
  type: string;
}

@Component({
  selector: 'app-allocation-widget',
  templateUrl: './allocation-widget.html',
  styleUrls: ['./allocation-widget.css'],
  imports: [DecimalPipe, CommonModule],
})
export class AllocationWidgetComponent implements OnInit, OnChanges {
  @Input() tokens: HoldingDto[] = [];
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  chart: any;
  chartData: number[] = [];
  chartLabels: string[] = [];
  chartColors: string[] = [];
  legendData: { symbol: string; percentage: number; color: string }[] = [];
  totalAssets: number = 0;

  // Define a set of colors for the chart slices
  private predefinedColors: string[] = [
    '#FFA500', // Orange (for BTC)
    '#6A5ACD', // SlateBlue (for ETH)
    '#8A2BE2', // BlueViolet (for SOL)
    '#FFD700', // Gold (for BNB)
    '#00CED1', // DarkTurquoise (for XRP)
    '#DC143C', // Crimson (for AVAX)
    '#4169E1', // RoyalBlue (for ADA)
    '#3CB371', // MediumSeaGreen
    '#FF6347', // Tomato
    '#BA55D3', // MediumOrchid
    '#20B2AA', // LightSeaGreen
    '#FF8C00', // DarkOrange
    '#9370DB', // MediumPurple
    '#7B68EE', // MediumSlateBlue
  ];

  ngOnInit(): void {
    this.processTokens();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tokens'] && changes['tokens'].currentValue !== changes['tokens'].previousValue) {
      this.processTokens();
    }
  }

  processTokens(): void {
    if (!this.tokens || this.tokens.length === 0) {
      this.chartData = [];
      this.chartLabels = [];
      this.chartColors = [];
      this.legendData = [];
      this.totalAssets = 0;
      if (this.chart) {
        this.chart.destroy();
      }
      return;
    }

    this.chartData = this.tokens.map((token) => token.value);
    this.chartLabels = this.tokens.map((token) => token.symbol);
    this.chartColors = this.tokens.map(
      (_, index) => this.predefinedColors[index % this.predefinedColors.length],
    );

    this.totalAssets = this.tokens.length;

    const totalPortfolioValue = this.tokens.reduce((sum, token) => sum + token.value, 0);

    this.legendData = this.tokens
      .map((token, index) => ({
        symbol: token.symbol,
        percentage: totalPortfolioValue > 0 ? (token.value / totalPortfolioValue) * 100 : 0,
        color: this.chartColors[index],
      }))
      .sort((a, b) => b.percentage - a.percentage); // Sort by percentage descending

    this.createChart();
  }

  createChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d')!;
    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.chartLabels,
        datasets: [
          {
            data: this.chartData,
            backgroundColor: this.chartColors,
            hoverOffset: 4,
            borderColor: '#282828', // Border color to match dark theme background
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '80%', // Makes it a doughnut chart
        plugins: {
          legend: {
            display: false, // We will create a custom legend
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed !== null) {
                  label += new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(context.parsed);
                }
                return label;
              },
              afterLabel: (context) => {
                const total = context.dataset.data.reduce((sum: any, val: any) => sum + val, 0);
                const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(2) : 0;
                return `(${percentage}%)`;
              },
            },
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#555',
            borderWidth: 1,
          },
        },
        elements: {
          arc: {
            borderRadius: 5, // Rounded corners for slices
          },
        },
      },
    });
  }
}
