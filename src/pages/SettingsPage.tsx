import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Moon,
  Sun,
  Coins,
  Database,
  Download,
  RotateCcw,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { storageService } from '../services/storageService';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetToDemoData } = useFinance();

  const [userName, setUserName] = useState(settings.userName);
  const [userEmail, setUserEmail] = useState(settings.userEmail);
  const [currency, setCurrency] = useState(settings.currency);
  const [currencySymbol, setCurrencySymbol] = useState(settings.currencySymbol);
  const [theme, setTheme] = useState(settings.theme);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      userName,
      userEmail,
      currency,
      currencySymbol,
      theme,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportJSON = () => {
    const dataStr = storageService.exportAllJSON();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NIVA_Data_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    if (
      confirm(
        'Are you sure you want to reset all data back to the default demo state? Custom additions will be overwritten.'
      )
    ) {
      resetToDemoData();
      alert('Data reset to realistic demo dataset successfully.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>Settings & Preferences</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Manage currency, theme, user profile, data backups and reset state.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* Profile & Currency Form */}
      <div className="p-6 rounded-2xl bg-[#111827]/90 border border-slate-800/80 shadow-lg space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Profile & Preferences</h3>
            <p className="text-xs text-slate-400">Configure your personal details and app localization</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Primary Currency (Default: INR)
              </label>
              <select
                value={currency}
                onChange={(e) => {
                  setCurrency(e.target.value);
                  if (e.target.value === 'INR') setCurrencySymbol('₹');
                  else if (e.target.value === 'USD') setCurrencySymbol('$');
                  else if (e.target.value === 'EUR') setCurrencySymbol('€');
                }}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                <option value="INR">Indian Rupee (INR - ₹)</option>
                <option value="USD">US Dollar (USD - $)</option>
                <option value="EUR">Euro (EUR - €)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Theme Preference</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-medium transition ${
                    theme === 'dark'
                      ? 'bg-purple-600 text-white border-purple-500'
                      : 'bg-slate-900 text-slate-400 border-slate-700'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Dark (Default)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-medium transition ${
                    theme === 'light'
                      ? 'bg-purple-600 text-white border-purple-500'
                      : 'bg-slate-900 text-slate-400 border-slate-700'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Light Mode</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/25 active:scale-95 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Data Management & Export Section */}
      <div className="p-6 rounded-2xl bg-[#111827]/90 border border-slate-800/80 shadow-lg space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Data Management & Persistence</h3>
            <p className="text-xs text-slate-400">
              Modular local-first storage ready for Supabase PostgreSQL sync
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div>
              <p className="font-semibold text-slate-200">Export Complete Financial Backup</p>
              <p className="text-xs text-slate-400">
                Download a full JSON snapshot of your income, expenses, deliberate savings, and budgets.
              </p>
            </div>
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition shrink-0 self-start sm:self-auto text-xs"
            >
              <Download className="w-4 h-4" />
              <span>Export JSON</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-red-950/20 border border-red-900/30">
            <div>
              <p className="font-semibold text-rose-300">Reset to Demo Data</p>
              <p className="text-xs text-slate-400">
                Restore the clean realistic demo records for testing calculations and visualizations.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-medium transition shrink-0 self-start sm:self-auto text-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
