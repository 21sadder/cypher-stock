import { Component, inject, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router'; // для открытия ссылок в штмл
import { Login } from '../login/login';

@Component({
  selector: 'app-register',
  standalone: true, // позволяет импоритровать элементы у который тоже standalone: true
  imports: [FormsModule, Login, NgStyle],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  showPassword = false;
  showPasswordConfirm = false;
  private http = inject(HttpClient);
  private router = inject(Router);

  // Данные регистрации
  email = '';
  password = '';
  username = '';
  confirmPassword = '';

  // link to background img
  currentBg: string = '';

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
        console.log('Register successful:', response);
        //  перейти на страницу дашюбор:\
        this.router.navigate(['/login']);
      },
      error: (err) => console.error("Register failed:", err)
    });
  }

  ngOnInit(){
    const bgImgCount = 2;
    const randomNum = Math.floor(Math.random() * bgImgCount) + 1;

    this.currentBg = `url('register-backgrounds/bg-${randomNum}.png')`;


  }


  // function OPEN login modal
  openLoginModal() {
    this.isModalOpen = true;
  }

  // function CLOSE login modal
  closeModal() {
    this.isModalOpen = false;
  }

  // function SHOW or HIDE password for registration
  showHidePassword(){
    this.showPassword = !this.showPassword;

  }

  // function SHOW or HIDE password for registration confirming password
  showHidePasswordConfirm(){
    this.showPasswordConfirm = !this.showPasswordConfirm;

  }



}
