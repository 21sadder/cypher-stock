import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-markets',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './markets.html',
  styleUrl: './markets.css',
})
export class Markets {}
