export type PaymentMethod = 'UPI' | 'Cash' | 'Card' | 'Bank Transfer' | 'Other';

export type IncomeCategory =
  | 'Salary'
  | 'Internship stipend'
  | 'Freelancing'
  | 'Business income'
  | 'Investment returns'
  | 'Gifts received'
  | 'Other income';

export type ExpenseCategory =
  | 'FOOD AND GROCERIES'
  | 'SHOPPING'
  | 'ENTERTAINMENT AND FUN'
  | 'TRAVEL'
  | 'MONTHLY BILLS'
  | 'OTHER';

export type SavingsCategory =
  | 'General savings'
  | 'Emergency fund'
  | 'Travel fund'
  | 'Shopping fund'
  | 'Future goals'
  | 'Other savings';

export interface Income {
  id: string;
  amount: number;
  source: IncomeCategory;
  date: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  description: string;
  notes?: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  subcategory: string;
  date: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  vendor?: string;
  description?: string;
  createdAt: string;
}

export interface Savings {
  id: string;
  amount: number;
  date: string; // YYYY-MM-DD
  category: SavingsCategory;
  reason: string;
  notes?: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  category: ExpenseCategory;
  limit: number;
  month: string; // YYYY-MM
}

export interface UserSettings {
  currency: string;
  currencySymbol: string;
  theme: 'dark' | 'light';
  userName: string;
  userEmail: string;
  monthlySavingsTarget: number;
}

export interface TransactionSummary {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  title: string;
  date: string;
  paymentMethod: PaymentMethod;
  raw: Income | Expense;
}
