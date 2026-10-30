import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Settings, Shield, Bell, Check } from 'lucide-react';

export const NGOSettingsPage: React.FC = () => {
  const { currentNGO, currentUser } = useAuth();
  const [needAlerts, setNeedAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          NGO Partner Settings & Preferences
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage district school requirement alerts and non-profit liaison settings.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Settings saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5 text-xs">
        <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-600" />
          <span>School Need Broadcast Alerts</span>
        </h2>

        <div className="space-y-3">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={needAlerts}
              onChange={(e) => setNeedAlerts(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-amber-600 focus:ring-amber-600"
            />
            <div>
              <span className="font-semibold text-slate-800">Urgent School Shortage Broadcasts</span>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Notify our organization when high-priority or urgent requirements are published in our supported categories.
              </p>
            </div>
          </label>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
          >
            Save Preferences
          </button>
        </div>
      </form>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3 text-xs text-slate-600">
        <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-600" />
          <span>Regulatory Compliance</span>
        </h2>
        <p>
          Donation contributions are logged with Central Directorate records and are eligible for institutional CSR compliance certificates following signed delivery confirmation by recipient schools.
        </p>
      </div>
    </div>
  );
};
