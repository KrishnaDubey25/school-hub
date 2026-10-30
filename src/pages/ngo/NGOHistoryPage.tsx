import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStoredData } from '../../services/storage';
import { History, CheckCircle2, Gift } from 'lucide-react';

export const NGOHistoryPage: React.FC = () => {
  const { currentNGO, currentUser } = useAuth();
  const store = getStoredData();
  const ngoId = currentNGO?.id || currentUser?.ngoId || '';

  const completedDonations = store.donations.filter(
    (d) => d.ngoId === ngoId && d.status === 'Delivered & Confirmed'
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Completed Donation History & Impact Ledger
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Archived record of verified deliveries and signed equipment handovers to beneficiary schools.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Offer / Item</th>
                <th className="py-3 px-4">Beneficiary School</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Estimated Value</th>
                <th className="py-3 px-4">Delivered Date</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {completedDonations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    No completed donations archived yet. Confirmed deliveries will appear here.
                  </td>
                </tr>
              ) : (
                completedDonations.map((don) => (
                  <tr key={don.id} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {don.resourceName}
                      <div className="text-[11px] font-mono font-normal text-slate-500">ID: {don.id}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{don.targetSchoolName}</div>
                      <div className="text-[11px] text-slate-500">{don.targetDistrict}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold tabular-nums">
                      {don.quantityOffered} units
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 tabular-nums">
                      {don.estimatedValue ? `₹${don.estimatedValue.toLocaleString()}` : '—'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {don.deliveryDate || 'Confirmed'}
                    </td>
                    <td className="py-3.5 px-4 text-right text-emerald-700 font-semibold flex items-center justify-end gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified Delivered</span>
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
