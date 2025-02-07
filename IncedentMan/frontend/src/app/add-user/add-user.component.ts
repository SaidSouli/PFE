import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

export interface User {
  id?: string;
  username: string;
  password: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public router: Router
  ) {
    // Initialize the form in the constructor
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.http.post<User>('http://localhost:8080/api/users', this.userForm.value)
        .subscribe({
          next: () => {
            this.router.navigate(['/admin']);
            alert('User created successfully!');
          },
          error: (error) => {
            console.error('Error creating user:', error);
            alert('Error creating user. Please try again.');
          }
        });
    }
  }
}