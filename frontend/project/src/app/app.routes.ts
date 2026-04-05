import { Routes } from '@angular/router';
import { Register } from './register/register';
import { Dashboard } from './dashboard/dashboard';
import { Markets } from './markets/markets';
import { Trade } from './trade/trade';
import { Portfolios } from './portfolios/portfolios';

export const routes: Routes = [
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'dashboard',
    component: Dashboard,
  },
  {
    path: 'markets',
    component: Markets,
  },
  {
    path: 'trade',
    component: Trade,
  },
  {
    path: 'portfolios',
    component: Portfolios,
  }
];
