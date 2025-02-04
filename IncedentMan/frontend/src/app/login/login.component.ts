import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl:"./login.component.html",
  styleUrls:['./login.component.scss'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private http: HttpClient) {}

  onSubmit() {
    const credentials = {
      username: this.username,
      password: this.password
    };

    this.http.post('http://localhost:8080/api/auth/login', credentials)
      .subscribe({
        next: (response: any) => {
          localStorage.setItem('token', response.token);
          console.log('Login successful');
        },
        error: (error) => {
          console.error('Login failed', error);
        }
      });
  }
}