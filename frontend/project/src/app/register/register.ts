import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgStyle } from '@angular/common';
import { Router} from '@angular/router';
import { Login } from '../login/login';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, Login, NgStyle],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  showPassword = false;
  showPasswordConfirm = false;
  private http = inject(HttpClient);
  private router = inject(Router);

  email = '';
  password = '';
  username = '';
  confirmPassword = '';
  currentBg: string = '';
  isModalOpen = false;
  errorMessage = '';

  register() {
    this.errorMessage = '';

    if (!this.username || this.username.length < 3) {
      this.errorMessage = 'Username must be at least 3 characters';
      return;
    }

    if (!this.email || !this.email.includes('@')) {
      this.errorMessage = 'Please enter a valid email';
      return;
    }

    if (!this.password || this.password.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = "Passwords don't match";
      return;
    }

    const body = {
      email: this.email,
      username: this.username,
      password: this.password,
    };

    this.http.post('http://localhost:8080/api/auth/register', body).subscribe({
      next: (response) => {
        console.log('Register successful:', response);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        if (err.status === 400) {
          this.errorMessage = 'Email or username already exists';
        } else {
          this.errorMessage = 'Registration failed. Try again.';
        }
      },
    });
  }

  ngOnInit() {
    const bgImgCount = 4;
    const last = Number(localStorage.getItem('lastBg') || 0);
    let randomNum = Math.floor(Math.random() * bgImgCount) + 1;
    if (randomNum === last) randomNum = (randomNum % bgImgCount) + 1;
    localStorage.setItem('lastBg', String(randomNum));
    this.currentBg = `url('register-backgrounds/bg-${randomNum}.png')`;
  }

  openLoginModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  showHidePassword() {
    this.showPassword = !this.showPassword;
  }

  showHidePasswordConfirm() {
    this.showPasswordConfirm = !this.showPasswordConfirm;
  }
}
