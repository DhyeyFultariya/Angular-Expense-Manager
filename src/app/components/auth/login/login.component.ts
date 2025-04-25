import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, RouterModule] // ✅ Import FormsModule for ngModel
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {

    if (!this.email || !this.password) {
      console.warn("Please fill all fields!");
      return;
    }

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        console.log('Login successful', res);
        localStorage.setItem('token', res.token); // ✅ Store token for authentication
        this.router.navigate(['/dashboard']); // ✅ Redirect to dashboard after login
      },
      error: (err) => {
        console.error('Login failed', err);
        alert('Login failed. Please check your credentials.');
      }
    });
  }
}
