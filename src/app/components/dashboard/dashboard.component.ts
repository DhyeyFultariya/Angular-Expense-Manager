import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ExpenseService } from '../../services/expense.service';
import { IncomeService } from '../../services/income.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  transactions: any[] = []; // Combined expenses and incomes
  userName: string = ''; // Add userName property
  showModal = false;
  transactionType = '';  // 'expense' or 'income'
  transactionData: any = {};
  totalExpense: number = 0;
  totalIncome: number = 0;
  paginatedTransactions: any[] = []; // List to show in the UI
  currentPage = 1;
  itemsPerPage = 5;

  constructor(
    private authService: AuthService,
    private router: Router,
    private expenseService: ExpenseService,
    private incomeService: IncomeService
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
    this.fetchMonthlyTotals();
  }


  fetchMonthlyTotals() {
    this.expenseService.getMonthlyExpenseTotal().subscribe({
      next: (res) => this.totalExpense = res.totalExpense,
      error: (err) => console.error("Error fetching total expense:", err),
    });

    this.incomeService.getMonthlyIncomeTotal().subscribe({
      next: (res) => this.totalIncome = res.totalIncome,
      error: (err) => console.error("Error fetching total income:", err),
    });
  }

  loadTransactions() {
    this.transactions = []; // Reset the array

    this.expenseService.getAllExpenses().subscribe({
      next: (expenses) => {
        const formattedExpenses = expenses.map(expense => ({
          ...expense,
          type: 'expense' // Add type to distinguish transactions
        }));

        this.incomeService.getAllIncomes().subscribe({
          next: (incomes) => {
            const formattedIncomes = incomes.map((income: any) => ({
              ...income,
              type: 'income' // Add type to distinguish transactions
            }));

            // Merge expenses and incomes into a single list
            this.transactions = [...formattedExpenses, ...formattedIncomes];

            // Sort transactions by date in descending order (latest first)
            this.transactions = this.transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            this.updatePagination();
          },
          error: (err) => console.error('Error fetching incomes:', err)
        });
      },
      error: (err) => console.error('Error fetching expenses:', err)
    });
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedTransactions = this.transactions.slice(start, end);
  }
  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.transactions.length) {
      this.currentPage++;
      this.updatePagination();
    }
  }
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  openModal(type: string) {
    this.transactionType = type;
    this.showModal = true;
    this.transactionData = {}; // Reset form data
  }

  addTransaction() {
    if (!this.transactionData.amount || !this.transactionData.date || !this.transactionData.category) {
      alert("Please fill all fields correctly.");
      return;
    }

    if (this.transactionType === 'expense') {
      this.expenseService.addExpense(this.transactionData).subscribe({
        next: () => {
          this.showModal = false;
          this.loadTransactions();
          this.fetchMonthlyTotals();
        },
        error: (err) => console.error('Error adding expense:', err)
      });
    } else if (this.transactionType === 'income') {
      this.incomeService.addIncome(this.transactionData).subscribe({
        next: () => {
          this.showModal = false;
          this.loadTransactions();
          this.fetchMonthlyTotals();
        },
        error: (err) => console.error('Error adding income:', err)
      });
    }
  }

  deleteTransaction(id: string, type: string) {
    if (confirm("Are you sure you want to delete this transaction?")) {
      if (type === 'expense') {
        this.expenseService.deleteExpense(id).subscribe({
          next: () => {
            this.loadTransactions();
            this.fetchMonthlyTotals();
            this.transactions = this.transactions.filter(t => t._id !== id);
            this.updatePagination();
          },
          error: (err) => console.error('Error deleting expense:', err)
        });
      } else if (type === 'income') {
        this.incomeService.deleteIncome(id).subscribe({
          next: () => {
            this.loadTransactions();
            this.fetchMonthlyTotals();
            this.transactions = this.transactions.filter(t => t._id !== id);
            this.updatePagination();
          },
          error: (err) => console.error('Error deleting income:', err)
        });
      }
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
