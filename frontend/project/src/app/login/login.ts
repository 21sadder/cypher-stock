import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {
  private http = inject(HttpClient);
  private router = inject(Router); // Инжектим роутер

  email = '';
  password = '';

  login() {
    const body = {
      email: this.email,
      password: this.password
    };

    // Отправляем на эндпоинт /login
    this.http.post('http://localhost:8080/api/auth/login', body).subscribe({
      next: (response: any) => {
        console.log("Login successful", response);
        // Сохраняем токен (если бэкенд его прислал)
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('email', response.email);
        }
        // Перенаправляем пользователя на главную или в личный кабинет
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        alert("Invalid email or password");
        console.error(err);
      }
    });
  }
}
