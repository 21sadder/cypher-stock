import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioChart } from './portfolio-chart';

describe('PortfolioChart', () => {
  let component: PortfolioChart;
  let fixture: ComponentFixture<PortfolioChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioChart],
    }).compileComponents();

    fixture = TestBed.createComponent(PortfolioChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
