import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../model/user.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  imports: [CommonModule] // Importez CommonModule ici
})
export class AdminComponent {
  users: User[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<User[]>('http://localhost:8080/api/users').subscribe(data => {
      this.users = data;
    });
  }

  logout() {
    this.router.navigate(['/login']);
  }
  editUser (user: User): void {
    console.log('AdminComponent - Navigating to edit user with ID:', user.id);
    this.router.navigate(['/edit-user', user.id]);

  }
  deleteUser (userId: string): void {
    if (confirm('do you really wanna delete this user ?')) {
      this.http.delete(`http://localhost:8080/api/users/${userId}`, { responseType: 'text' }).subscribe({ // Add responseType: 'text'
        next: (response) => {
          console.log('Delete successful response (text):', response); // Log the text response
          this.loadUsers();
          alert('User deleted successfully'); 
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          alert('There was an error while deleting the user.');
        }
      });
    }
  }
  
}