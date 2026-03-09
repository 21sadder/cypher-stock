import { Component, inject } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private http = inject(HttpClient);

  email = '';
  password = '';
  username = '';
  confirmPassword = '';

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
        console.log("Register successful: " + response);
        console.log('Деталі відповіді:', JSON.stringify(response, null, 2));
      },
      error: (err) => console.error("Register failed: " + err)
    });
  }
}
