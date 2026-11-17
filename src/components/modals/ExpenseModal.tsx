import React, { useState, useEffect } from 'react';
import { X, TrendingDown, AlertCircle } from 'lucide-react';
import { Expense, ExpenseCategory, PaymentMethod } from '../../types';
import { EXPENSE_CATEGORIES_DATA, PAYMENT_METHODS } from '../../constants/categories';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<Expense, 'id' | 'createdAt'>) => void;
  onUpdate?: (id: string, item: Partial<Expense>) => void;
  initialData?: Expense | null;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onUpdate,
  initialData,
}) => {
  const categories = Object.keys(EXPENSE_CATEGORIES_DATA) as ExpenseCategory[];

  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<ExpenseCategory>('FOOD AND GROCERIES');
  const [subcategory, setSubcategory] = useState<string>(EXPENSE_CATEGORIES_DATA['FOOD AND GROCERIES'][0]);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [vendor, setVendor] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount.toString());
      setCategory(initialData.category);
      setSubcategory(initialData.subcategory);
      setDate(initialData.date);
      setPaymentMethod(initialData.paymentMethod);
      setVendor(initialData.vendor || '');
      setDescription(initialData.description || '');
    } else {
      setAmount('');
      setCategory('FOOD AND GROCERIES');
      setSubcategory(EXPENSE_CATEGORIES_DATA['FOOD AND GROCERIES'][0]);
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('UPI');
      setVendor('');
      setDescription('');
    }
    setError('');
  }, [initialData, isOpen]);

  const handleCategoryChange = (newCat: ExpenseCategory) => {
    setCategory(newCat);
    setSubcategory(EXPENSE_CATEGORIES_DATA[newCat][0] || '');
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }

    if (initialData && onUpdate) {
      onUpdate(initialData.id, {
        amount: numAmount,
        category,
        subcategory,
        date,
        paymentMethod,
        vendor: vendor.trim() || undefined,
        description: description.trim() || undefined,
      });
    } else {
      onSubmit({
        amount: numAmount,
        category,
        subcategory,
        date,
        paymentMethod,
        vendor: vendor.trim() || undefined,
        description: description.trim() || undefined,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#111827] border border-slate-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0f172a]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-100">
                {initialData ? 'Edit Expense Record' : 'Record Expense'}
              </h2>
              <p className="text-xs text-slate-400">Track bills, food, travel, or shopping spending</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-300 bg-red-950/50 border border-red-800/50 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Expense Amount (₹) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">₹</span>
              <input
                type="number"
                step="any"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="2,500"
                className="w-full pl-8 pr-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-lg font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Main Category <span className="text-rose-400">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as ExpenseCategory)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-xs"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Subcategory <span className="text-rose-400">*</span>
              </label>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-xs"
              >
                {EXPENSE_CATEGORIES_DATA[category].map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Store / Vendor (Optional)</label>
              <input
                type="text"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                placeholder="e.g. Swiggy, Zara, D-Mart"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Payment Method</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {PAYMENT_METHODS.map((method) => (
                <button
                  type="button"
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`py-2 px-2 text-xs rounded-lg font-medium transition-all text-center border ${
                    paymentMethod === method
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/60 shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Description (Optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Dinner with team after product launch"
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-sm"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-all shadow-lg shadow-rose-500/20 active:scale-[0.98]"
            >
              {initialData ? 'Save Changes' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
