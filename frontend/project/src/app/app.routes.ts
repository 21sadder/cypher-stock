import { Routes } from '@angular/router';
import { Register } from './register/register';
import { Dashboard } from './dashboard/dashboard';
import { Markets } from './markets/markets';
import { Trade } from './trade/trade';
import { Portfolios } from './portfolios/portfolios';
import { NavbarLayout } from './navbar-layout/navbar-layout';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'register',
    component: Register,
  },
  {
    path: '',
    component: NavbarLayout,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'markets', component: Markets },
      { path: 'trade', component: Trade },
      { path: 'portfolios', component: Portfolios },
    ],
  },
];
