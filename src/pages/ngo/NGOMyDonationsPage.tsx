import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getStoredData } from '../../services/storage';
import { DonationOffer } from '../../types';
import { Gift, Clock, Truck, CheckCircle2, AlertCircle, Eye, PlusCircle } from 'lucide-react';

export const NGOMyDonationsPage: React.FC = () => {
  const { currentNGO, currentUser } = useAuth();
  const store = getStoredData();
  const ngoId = currentNGO?.id || currentUser?.ngoId || '';

  const myDonations = store.donations.filter((d) => d.ngoId === ngoId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Our NGO Donation Commitments
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track submitted educational material commitments, administrative clearances, and school receipt confirmations.
          </p>
        </div>

        <Link
          to="/ngo/offer-donation"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Donation Offer</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Offer / Resource</th>
                <th className="py-3 px-4">Beneficiary School</th>
                <th className="py-3 px-4">Quantity & Condition</th>
                <th className="py-3 px-4">Est. Value</th>
                <th className="py-3 px-4">Lifecycle Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {myDonations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    No donation commitments made yet. Use &quot;Offer Donation&quot; to contribute.
                  </td>
                </tr>
              ) : (
                myDonations.map((don) => (
                  <tr key={don.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{don.resourceName}</div>
                      <div className="text-[11px] font-mono text-slate-500">ID: {don.id} · {don.category}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{don.targetSchoolName}</div>
                      <div className="text-[11px] text-slate-500">{don.targetDistrict}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900 tabular-nums">
                        {don.quantityOffered} units
                      </div>
                      <div className="text-[11px] text-slate-500">{don.condition}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 tabular-nums">
                      {don.estimatedValue ? `₹${don.estimatedValue.toLocaleString()}` : '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                          don.status === 'Delivered & Confirmed'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : don.status === 'Dispatched by NGO'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : don.status === 'Admin Approved'
                            ? 'bg-teal-50 text-teal-800 border border-teal-200'
                            : don.status === 'Admin Rejected'
                            ? 'bg-red-50 text-red-800 border border-red-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {don.status === 'Delivered & Confirmed' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {don.status === 'Dispatched by NGO' && <Truck className="w-3 h-3 text-blue-600" />}
                        {don.status === 'Offer Submitted' && <Clock className="w-3 h-3 text-amber-600" />}
                        <span>{don.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {don.status === 'Admin Approved' ? (
                        <Link
                          to="/ngo/deliveries"
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold"
                        >
                          Dispatch Now
                        </Link>
                      ) : (
                        <Link
                          to="/ngo/deliveries"
                          className="text-xs font-medium text-slate-600 hover:text-slate-900"
                        >
                          Tracking
                        </Link>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
