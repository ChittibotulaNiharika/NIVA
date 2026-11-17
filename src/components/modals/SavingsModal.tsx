import React, { useState, useEffect } from 'react';
import { X, PiggyBank, AlertTriangle, Sparkles } from 'lucide-react';
import { Savings, SavingsCategory } from '../../types';
import { SAVINGS_CATEGORIES } from '../../constants/categories';
import { formatINR } from '../../utils/formatters';

interface SavingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<Savings, 'id' | 'createdAt'>) => void;
  onUpdate?: (id: string, item: Partial<Savings>) => void;
  initialData?: Savings | null;
  monthlySurplus: number;
  currentMonthlySavings: number;
}

export const SavingsModal: React.FC<SavingsModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onUpdate,
  initialData,
  monthlySurplus,
  currentMonthlySavings,
}) => {
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<SavingsCategory>('General savings');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount.toString());
      setCategory(initialData.category);
      setDate(initialData.date);
      setReason(initialData.reason);
      setNotes(initialData.notes || '');
    } else {
      setAmount('');
      setCategory('General savings');
      setDate(new Date().toISOString().split('T')[0]);
      setReason('');
      setNotes('');
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const numAmount = parseFloat(amount) || 0;
  // Compute prospective savings
  const prospectiveTotalSavings = initialData
    ? currentMonthlySavings - initialData.amount + numAmount
    : currentMonthlySavings + numAmount;

  const isExceedingSurplus = prospectiveTotalSavings > monthlySurplus && monthlySurplus > 0;
  const isSurplusDeficit = monthlySurplus <= 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid positive savings amount.');
      return;
    }
    if (!reason.trim()) {
      setError('Please provide a reason or how you achieved this saving.');
      return;
    }

    if (initialData && onUpdate) {
      onUpdate(initialData.id, {
        amount: numAmount,
        category,
        date,
        reason: reason.trim(),
        notes: notes.trim(),
      });
    } else {
      onSubmit({
        amount: numAmount,
        category,
        date,
        reason: reason.trim(),
        notes: notes.trim(),
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#111827] border border-purple-500/30 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0f172a]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <PiggyBank className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg font-semibold text-slate-100">
                  {initialData ? 'Edit Savings Record' : 'Record Savings'}
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  Key Feature
                </span>
              </div>
              <p className="text-xs text-slate-400">Explicitly set aside money or reward disciplined spending</p>
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
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Monthly Surplus Context Banner */}
          <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Available Monthly Surplus (Income - Expenses):</span>
              <span className={`font-semibold ${monthlySurplus >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatINR(monthlySurplus)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Current Recorded Savings this month:</span>
              <span className="font-semibold text-purple-400">{formatINR(currentMonthlySavings)}</span>
            </div>

            {/* Smart warning rule: Warn user if savings exceed monthly surplus */}
            {isSurplusDeficit && (
              <div className="mt-2 pt-2 border-t border-slate-800 flex items-start gap-2 text-xs text-amber-300">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <span>
                  Notice: Your current monthly expenses match or exceed income. Recording savings will result in a negative unallocated balance.
                </span>
              </div>
            )}
            {!isSurplusDeficit && isExceedingSurplus && (
              <div className="mt-2 pt-2 border-t border-slate-800 flex items-start gap-2 text-xs text-amber-300">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <span>
                  <strong>Financial Warning:</strong> Total recorded savings ({formatINR(prospectiveTotalSavings)}) will exceed your available surplus ({formatINR(monthlySurplus)}).
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Amount Saved (₹) <span className="text-purple-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400 font-semibold">₹</span>
              <input
                type="number"
                step="any"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="5,000"
                className="w-full pl-8 pr-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-lg font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Savings Goal / Category <span className="text-purple-400">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SavingsCategory)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-sm"
              >
                {SAVINGS_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Date <span className="text-purple-400">*</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Reason for Saving <span className="text-purple-400">*</span>
              </label>
              <span className="text-[11px] text-purple-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> E.g. Skipped takeout, sales discount
              </span>
            </div>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Saved ₹1,500 by cooking at home instead of weekend dining"
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Additional Notes (Optional)</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Where was this kept? (e.g. moved to auto-sweep FD, liquid mutual fund)"
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-sm resize-none"
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
              className="px-5 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all shadow-lg shadow-purple-500/20 active:scale-[0.98]"
            >
              {initialData ? 'Save Changes' : 'Record Savings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
