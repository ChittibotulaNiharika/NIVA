import { Income, Expense, Savings, Budget, UserSettings } from '../types';
import {
  INITIAL_INCOME,
  INITIAL_EXPENSES,
  INITIAL_SAVINGS,
  INITIAL_BUDGETS,
  INITIAL_USER_SETTINGS,
} from '../data/initialData';

const KEYS = {
  INCOME: 'niva_income',
  EXPENSES: 'niva_expenses',
  SAVINGS: 'niva_savings',
  BUDGETS: 'niva_budgets',
  SETTINGS: 'niva_settings',
};

// Storage Service abstraction (allows painless migration to Supabase in future phase)
export const storageService = {
  getIncome(): Income[] {
    const data = localStorage.getItem(KEYS.INCOME);
    if (!data) {
      localStorage.setItem(KEYS.INCOME, JSON.stringify(INITIAL_INCOME));
      return INITIAL_INCOME;
    }
    return JSON.parse(data);
  },

  saveIncome(items: Income[]): void {
    localStorage.setItem(KEYS.INCOME, JSON.stringify(items));
  },

  getExpenses(): Expense[] {
    const data = localStorage.getItem(KEYS.EXPENSES);
    if (!data) {
      localStorage.setItem(KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES));
      return INITIAL_EXPENSES;
    }
    return JSON.parse(data);
  },

  saveExpenses(items: Expense[]): void {
    localStorage.setItem(KEYS.EXPENSES, JSON.stringify(items));
  },

  getSavings(): Savings[] {
    const data = localStorage.getItem(KEYS.SAVINGS);
    if (!data) {
      localStorage.setItem(KEYS.SAVINGS, JSON.stringify(INITIAL_SAVINGS));
      return INITIAL_SAVINGS;
    }
    return JSON.parse(data);
  },

  saveSavings(items: Savings[]): void {
    localStorage.setItem(KEYS.SAVINGS, JSON.stringify(items));
  },

  getBudgets(): Budget[] {
    const data = localStorage.getItem(KEYS.BUDGETS);
    if (!data) {
      localStorage.setItem(KEYS.BUDGETS, JSON.stringify(INITIAL_BUDGETS));
      return INITIAL_BUDGETS;
    }
    return JSON.parse(data);
  },

  saveBudgets(items: Budget[]): void {
    localStorage.setItem(KEYS.BUDGETS, JSON.stringify(items));
  },

  getSettings(): UserSettings {
    const data = localStorage.getItem(KEYS.SETTINGS);
    if (!data) {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(INITIAL_USER_SETTINGS));
      return INITIAL_USER_SETTINGS;
    }
    return JSON.parse(data);
  },

  saveSettings(settings: UserSettings): void {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  },

  resetAllData(): void {
    localStorage.setItem(KEYS.INCOME, JSON.stringify(INITIAL_INCOME));
    localStorage.setItem(KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES));
    localStorage.setItem(KEYS.SAVINGS, JSON.stringify(INITIAL_SAVINGS));
    localStorage.setItem(KEYS.BUDGETS, JSON.stringify(INITIAL_BUDGETS));
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(INITIAL_USER_SETTINGS));
  },

  exportAllJSON(): string {
    const backup = {
      income: this.getIncome(),
      expenses: this.getExpenses(),
      savings: this.getSavings(),
      budgets: this.getBudgets(),
      settings: this.getSettings(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(backup, null, 2);
  },
};
