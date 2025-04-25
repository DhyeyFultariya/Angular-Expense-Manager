import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token'); // ✅ Check if user is logged in

    if (!token) {
      this.router.navigate(['/login']); // 🚫 Redirect to login if not authenticated
      return false;
    }

    return true; // ✅ Allow access if token exists
  }
}
