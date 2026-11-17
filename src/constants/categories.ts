import { ExpenseCategory } from '../types';

export const EXPENSE_CATEGORIES_DATA: Record<ExpenseCategory, string[]> = {
  'FOOD AND GROCERIES': [
    'Groceries',
    'Household essentials',
    'Food delivery',
    'Eating outside',
    'Restaurants',
    'Cafes',
    'Snacks and beverages',
  ],
  'SHOPPING': [
    'Online shopping',
    'Offline shopping',
    'Clothing',
    'Electronics',
    'Accessories',
    'Personal shopping',
  ],
  'ENTERTAINMENT AND FUN': [
    'Movies',
    'Games',
    'Events',
    'Outings',
    'Fun activities',
  ],
  'TRAVEL': [
    'Trips',
    'Hotels',
    'Transportation',
    'Fuel',
    'Vacation expenses',
  ],
  'MONTHLY BILLS': [
    'House rent',
    'Electricity/current bill',
    'Wi-Fi',
    'Mobile recharge',
    'Water bill',
    'Subscriptions',
  ],
  'OTHER': [
    'Healthcare',
    'Education',
    'Personal care',
    'Gifts',
    'Miscellaneous',
  ],
};

export const INCOME_CATEGORIES = [
  'Salary',
  'Internship stipend',
  'Freelancing',
  'Business income',
  'Investment returns',
  'Gifts received',
  'Other income',
] as const;

export const SAVINGS_CATEGORIES = [
  'General savings',
  'Emergency fund',
  'Travel fund',
  'Shopping fund',
  'Future goals',
  'Other savings',
] as const;

export const PAYMENT_METHODS = ['UPI', 'Cash', 'Card', 'Bank Transfer', 'Other'] as const;
