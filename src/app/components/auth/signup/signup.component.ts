import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // ✅ Import FormsModule
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [FormsModule, RouterModule] // ✅ Add FormsModule here
}) 
export class SignupComponent {
  name = '';
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    console.log("Signup Data:", { name: this.name, email: this.email, password: this.password });

    if (!this.name || !this.email || !this.password) {
      console.warn("Please fill all fields!");
      return;
    }

    this.authService.signup({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: (res) => {
        console.log('Signup successful', res);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Signup failed', err);
      }
    });
  }
}
