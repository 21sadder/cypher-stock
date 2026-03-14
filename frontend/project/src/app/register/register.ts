import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router'; // для открытия ссылок в штмл
import { Login } from '../login/login';

@Component({
  selector: 'app-register',
  standalone: true, // позволяет импоритровать элементы у который тоже standalone: true
  imports: [FormsModule, RouterLink, Login],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Данные регистрации
  email = '';
  password = '';
  username = '';
  confirmPassword = '';

  // переменная для окна логина
  isModalOpen = false;

  register() {
    if(this.password !== this.confirmPassword){
      alert("Passwords don't match");
      return;
    }

    const body = {
      email: this.email,
      username: this.username,
      password: this.password,
    }

    this.http.post('http://localhost:8080/api/auth/register', body).subscribe({
      next: (response) => {
        console.log("Register successful:", response);
        // После успешной регистрации можно либо открыть модалку логина,
        // либо перейти на страницу логина:
        this.router.navigate(['/login']);
      },
      error: (err) => console.error("Register failed:", err)
    });
  }

  // функции для управления окном для логина
  openLoginModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
