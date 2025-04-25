import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private apiUrl = 'http://localhost:5000/api/expenses';

  constructor(private http: HttpClient) {}

  // Function to get the token from local storage
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Adjust if using sessionStorage
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    });
  }

  getMonthlyExpenseTotal(): Observable<{ totalExpense: number }> {
    return this.http.get<{ totalExpense: number }>(`${this.apiUrl}/summary/monthly`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Fetch all expenses
  getAllExpenses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Add a new expense
  addExpense(expenseData: { date: string; category: string; amount: number; description: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, expenseData, {
      headers: this.getAuthHeaders(),
    });
  }

  // Delete an expense by ID
  deleteExpense(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/delete/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
