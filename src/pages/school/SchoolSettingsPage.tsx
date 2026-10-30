import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Settings, Shield, Bell, Check } from 'lucide-react';

export const SchoolSettingsPage: React.FC = () => {
  const { currentSchool, currentUser } = useAuth();
  const [emailAlerts, setEmailAlerts] = useState(true);
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
          School Account & Notification Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure inter-school communication preferences and security credentials.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Preferences updated for active session.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5 text-xs">
        <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Bell className="w-4 h-4 text-teal-700" />
          <span>Logistics & Lending Alerts</span>
        </h2>

        <div className="space-y-3">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-teal-700 focus:ring-teal-700"
            />
            <div>
              <span className="font-semibold text-slate-800">Inter-School Borrowing Notifications</span>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Receive instant in-app alerts whenever peer schools request equipment from your surplus catalog.
              </p>
            </div>
          </label>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
          >
            Save Settings
          </button>
        </div>
      </form>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3 text-xs text-slate-600">
        <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Shield className="w-4 h-4 text-teal-700" />
          <span>Institutional Access & Passwords</span>
        </h2>
        <p>
          In accordance with Central Government School Portal standards, passwords are managed via authorized education department identity directories. Plaintext passwords are never revealed in public views.
        </p>
      </div>
    </div>
  );
};
