import { Component, inject, Output, EventEmitter } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  showPasswordLogin = false;
  @Output() close = new EventEmitter<void>();

  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.close.emit();
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        alert('Invalid email or password');
        console.error(err);
      },
    });
  }

  showHidePasswordLogin() {
    this.showPasswordLogin = !this.showPasswordLogin;
  }
}
