import { Component, inject, Output, EventEmitter } from '@angular/core'; //EventEmitter - передатчик, с помощью которого будет закрыватьс окно логина после успешного логина
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
  showPassword = false;
  @Output() close = new EventEmitter<void>();

  private http = inject(HttpClient);
  private router = inject(Router); // Инжектим роутер

  email = '';
  password = '';

  login() {
    const body = {
      email: this.email,
      password: this.password
    };


    this.http.post('http://localhost:8080/api/auth/login', body).subscribe({
      next: (response: any) => {
        console.log("Login successful", response);
        // Сохраняем токен (если бэкенд его прислал)
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('email', response.email);
        }

        //закрытие окна логина и дальнейший переход на дашборд
        this.close.emit();
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
