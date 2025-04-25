import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {
  private apiUrl = 'http://localhost:5000/api/incomes';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    return new HttpHeaders({
      Authorization: `${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    });
  }

  getMonthlyIncomeTotal(): Observable<{ totalIncome: number }> {
    return this.http.get<{ totalIncome: number }>(`${this.apiUrl}/summary/monthly`, {
      headers: this.getAuthHeaders(),
    });
  }
  

  getAllIncomes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`, { headers: this.getAuthHeaders() });
  }

  addIncome(incomeData: { date: string; category: string; amount: number; description: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, incomeData, { headers: this.getAuthHeaders() });
  }

  deleteIncome(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/delete/${id}`, { headers: this.getAuthHeaders() });
  }
}
