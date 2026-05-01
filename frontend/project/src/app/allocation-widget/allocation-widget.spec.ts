import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationWidget } from './allocation-widget';

describe('AllocationWidget', () => {
  let component: AllocationWidget;
  let fixture: ComponentFixture<AllocationWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllocationWidget],
    }).compileComponents();

    fixture = TestBed.createComponent(AllocationWidget);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
