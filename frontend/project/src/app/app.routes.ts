import { authGuard } from './auth-guard';
import { Portfolios } from './portfolios/portfolios';
import { Trade } from './trade/trade';
import { Markets } from './markets/markets';
import { Dashboard } from './dashboard/dashboard';
import { NavbarLayout } from './navbar-layout/navbar-layout';
import { Register } from './register/register';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'register', component: Register },
  {
    path: '',
    component: NavbarLayout,
    children: [
      { path: 'markets', component: Markets },
      { path: 'trade', component: Trade },
      { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
      { path: 'portfolios', component: Portfolios, canActivate: [authGuard] },
    ],
  },
];
