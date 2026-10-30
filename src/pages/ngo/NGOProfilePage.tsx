import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStoredData, saveStoredData, logActivity } from '../../services/storage';
import { Building2, CheckCircle2, Clock, Check } from 'lucide-react';

export const NGOProfilePage: React.FC = () => {
  const { currentNGO, currentUser, refreshSession } = useAuth();
  const [store, setStore] = useState(getStoredData());

  const ngo = currentNGO || store.ngos[0];

  const [authorizedRepresentative, setAuthorizedRepresentative] = useState(ngo?.authorizedRepresentative || '');
  const [phone, setPhone] = useState(ngo?.phone || '');
  const [address, setAddress] = useState(ngo?.address || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ngo) return;

    const updated = {
      ...store,
      ngos: store.ngos.map((n) =>
        n.id === ngo.id
          ? {
              ...n,
              authorizedRepresentative,
              phone,
              address,
            }
          : n
      ),
    };

    saveStoredData(updated);
    setStore(updated);
    refreshSession();
    logActivity('ngo', ngo.ngoName, 'NGO Profile Updated', 'Updated representative contact and registered address');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Organization Profile & Registration
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified NGO credentials, authorized liaison details, and registered thematic focus areas.
          </p>
        </div>

        <span
          className={`self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize ${
            ngo?.verificationStatus === 'approved'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}
        >
          {ngo?.verificationStatus === 'approved' ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          )}
          <span>Status: {ngo?.verificationStatus}</span>
        </span>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Organization profile updated.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Organization Name
            </label>
            <input
              type="text"
              disabled
              value={ngo?.ngoName || ''}
              className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-600 rounded-lg text-xs font-medium cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Registration Number
            </label>
            <input
              type="text"
              disabled
              value={ngo?.registrationNumber || ''}
              className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-600 rounded-lg text-xs font-mono font-bold cursor-not-allowed"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Authorized Representative *
            </label>
            <input
              type="text"
              required
              value={authorizedRepresentative}
              onChange={(e) => setAuthorizedRepresentative(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contact Phone *
            </label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Official Email
            </label>
            <input
              type="text"
              disabled
              value={ngo?.email || ''}
              className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-600 rounded-lg text-xs cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Registered District & State
            </label>
            <input
              type="text"
              disabled
              value={`${ngo?.district || ''}, ${ngo?.state || ''}`}
              className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-600 rounded-lg text-xs cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Registered Headquarters Address *
          </label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden"
          />
        </div>

        <div className="p-3 bg-slate-50 rounded-lg space-y-1 text-xs">
          <div className="font-semibold text-slate-700">Supported Resource Categories</div>
          <div className="text-teal-800">{ngo?.resourceCategoriesSupported.join(' · ')}</div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Save Profile Updates</span>
          </button>
        </div>
      </form>
    </div>
  );
};
