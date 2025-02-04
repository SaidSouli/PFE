import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {Router} from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [FormsModule] 
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  message: string ='';

  constructor(private http: HttpClient, private router : Router) {}

  onSubmit() {
    this.http.post<any>('http://localhost:8080/api/users/login', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        if (response && response.role) {
          const role = response.role.toLowerCase();
          switch(role) {
            case 'admin':
              this.router.navigate(['/admin']);
              break;
            default:
              console.log('Unknown role:', role);
          }
        } else {
          console.error('No role found in response');
          this.message = 'Login failed: Invalid response';
        }
      },
      error: (error) => {
        this.message = 'login failed , please check your credential';
        console.error('Login failed', error);
        
      }
    });
  }
}