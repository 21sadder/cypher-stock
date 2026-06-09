import { Component, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface SnapshotDto {
  totalValue: number;
  date: string;
}

@Component({
  selector: 'app-account-chart',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './account-chart.css',
  template: `
    <div class="chart-container">

      <div class="period-tabs">
        @for (p of periods; track p) {
          <button class="period-btn" [class.active]="activePeriod === p" (click)="setPeriod(p)">
            {{ p }}
          </button>
        }
      </div>

      <div class="canvas-wrapper">
        <canvas #chartCanvas></canvas>
      </div>

      <div class="no-data" *ngIf="noData">
        <p>No performance data yet</p>
        <span>Data is recorded daily at 23:59</span>
      </div>
    </div>
  `
})
export class AccountChart implements OnDestroy, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  periods = ['1D', '7D', '1M', '3M'];
  activePeriod = '3M';
  noData = false;
  private chart: Chart | null = null;

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    this.loadSnapshots();
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  setPeriod(period: string) {
    this.activePeriod = period;
    this.loadSnapshots();
  }

  loadSnapshots() {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http
      .get<
        SnapshotDto[]
      >(`http://localhost:8080/portfolios/account/snapshots?period=${this.activePeriod}`, { headers })
      .subscribe({
        next: (data) => {
          if (data.length === 0) {
            this.noData = true;
            return;
          }
          this.noData = false;
          this.renderChart(data);
        },
        error: (err) => console.error(err),
      });
  }

  renderChart(data: SnapshotDto[]) {
    if (this.chart) {
      this.chart.destroy();
    }

    const labels = data.map((d) => d.date);
    const values = data.map((d) => d.totalValue);

    const ctx = this.chartCanvas.nativeElement.getContext('2d')!;

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(74, 222, 128, 0.3)');
    gradient.addColorStop(1, 'rgba(74, 222, 128, 0.0)');

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            data: values,
            borderColor: '#4ade80',
            backgroundColor: gradient,
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: 'index' },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1a1a1a',
            borderColor: '#2a2a2a',
            borderWidth: 1,
            titleColor: '#666',
            bodyColor: '#fff',
            callbacks: {
              label: (ctx) => {
                const value = ctx.parsed.y ?? 0;
                return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: '#444', font: { family: 'Syne', size: 11 }, maxTicksLimit: 10 },
          },
          y: {
            position: 'left',
            grid: { color: '#1a1a1a' },
            border: { display: false },
            ticks: {
              color: '#444',
              font: { family: 'Syne', size: 11 },
              callback: (value) => {
                const num = Number(value);
                if (num >= 1000) return `$${(num / 1000).toFixed(0)}k`;
                return `$${num}`;
              },
            },
          },
        },
      },
    });
  }
}
