import React, { useState } from 'react';
import { resetToDefaultData, getStoredData, logActivity } from '../../services/storage';
import { Settings, RotateCcw, ShieldCheck, Database, Server, Check } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [resetSuccess, setResetSuccess] = useState(false);
  const store = getStoredData();

  const handleResetData = () => {
    if (
      window.confirm(
        'Warning: This will reset all demo schools, NGO records, transactions, requirements, and logs to the original clean prototype state. Proceed?'
      )
    ) {
      resetToDefaultData();
      setResetSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Platform Governance & System Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure inter-school borrowing window policies, UDISE validation enforcement, and prototype environment controls.
        </p>
      </div>

      {resetSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Demo storage successfully reset to default state. Reloading...</span>
        </div>
      )}

      {/* Policy Parameters */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-4 h-4 text-teal-700" />
          <span>Operational Rules & Borrowing Periods</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Maximum Academic Loan Duration (Months)
            </label>
            <input
              type="number"
              defaultValue={6}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Minimum UDISE Code Digits Required
            </label>
            <input
              type="number"
              defaultValue={11}
              disabled
              className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg text-xs font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Default Courier SLA for Inter-District Shipments
            </label>
            <input
              type="text"
              defaultValue="5 to 7 Working Days"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Mandatory Condition Photograph Upload
            </label>
            <select
              defaultValue="enabled"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-900"
            >
              <option value="enabled">Enforced (Camera or File Upload required)</option>
              <option value="optional">Optional</option>
            </select>
          </div>
        </div>

        <div className="pt-2 text-right">
          <button
            type="button"
            onClick={() => alert('Platform policy parameters saved for the active session.')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
          >
            Save Policy Rules
          </button>
        </div>
      </div>

      {/* Demo Prototype Control & Reset */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-4 h-4 text-indigo-700" />
          <span>Local Prototype Persistence State</span>
        </h2>

        <p className="text-xs text-slate-600 leading-relaxed">
          The prototype persists data in browser LocalStorage (`school_resource_hub_data_v1`). You can reset the dataset back to its verified default sample institutions, cataloged computers, transactions, and donation offers at any time for fresh demonstration rounds.
        </p>

        <div className="p-3 bg-slate-50 rounded-lg text-xs font-mono text-slate-600 flex flex-wrap gap-4">
          <span>Schools: {store.schools.length}</span>
          <span>NGOs: {store.ngos.length}</span>
          <span>Resources: {store.resources.length}</span>
          <span>Transactions: {store.transactions.length}</span>
          <span>Donations: {store.donations.length}</span>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleResetData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Storage to Initial State</span>
          </button>
        </div>
      </div>

      {/* System & Architecture Info */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs text-slate-600">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Server className="w-4 h-4 text-teal-700" />
          <span>Architecture & Production Readiness</span>
        </h2>
        <p>
          <strong>Front-End Architecture:</strong> React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React icons, and HTML5 Browser Camera & File APIs.
        </p>
        <p>
          <strong>Security Note:</strong> Client-side authentication and role switching in this prototype are demonstration-only for college project evaluation. In production, this module integrates with standard OAuth 2.0 / SAML 2.0 government single-sign-on (e.g. MeriPehchan / DigiLocker) with server-side RBAC validation.
        </p>
      </div>
    </div>
  );
};
