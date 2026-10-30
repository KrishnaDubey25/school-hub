import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStoredData } from '../../services/storage';
import { History, CheckCircle2, ArrowLeftRight, Gift } from 'lucide-react';

export const SchoolHistoryPage: React.FC = () => {
  const { currentSchool, currentUser } = useAuth();
  const store = getStoredData();
  const schoolId = currentSchool?.id || currentUser?.schoolId || '';

  const completedTransactions = store.transactions.filter(
    (t) =>
      (t.borrowerSchoolId === schoolId || t.lenderSchoolId === schoolId) &&
      t.status === 'Returned to Lender'
  );

  const completedDonations = store.donations.filter(
    (d) => d.targetSchoolId === schoolId && d.status === 'Delivered & Confirmed'
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          School Transaction & Donation History
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Archived records of successfully reconciled inter-school loans and fulfilled NGO contributions.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ArrowLeftRight className="w-4 h-4 text-teal-700" />
          <span>Reconciled Loan Cycles ({completedTransactions.length})</span>
        </h2>

        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Transaction / Item</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Partner School</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Return Reconciled Date</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {completedTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No archived completed loans yet. Completed returns will appear here.
                    </td>
                  </tr>
                ) : (
                  completedTransactions.map((tx) => {
                    const isBorrower = tx.borrowerSchoolId === schoolId;
                    return (
                      <tr key={tx.id} className="hover:bg-slate-50/80">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {tx.resourceName}
                          <div className="text-[11px] font-mono font-normal text-slate-500">Tx #{tx.id}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isBorrower
                                ? 'bg-indigo-50 text-indigo-800'
                                : 'bg-teal-50 text-teal-800'
                            }`}
                          >
                            {isBorrower ? 'Borrower' : 'Lender'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {isBorrower ? tx.lenderSchoolName : tx.borrowerSchoolName}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold tabular-nums">
                          {tx.quantity} units
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-600">
                          {tx.actualReturnDate || tx.returnDueDate}
                        </td>
                        <td className="py-3.5 px-4 text-right text-emerald-700 font-semibold flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Returned & Verified</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Gift className="w-4 h-4 text-amber-600" />
          <span>Permanently Delivered NGO Donations ({completedDonations.length})</span>
        </h2>

        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="divide-y divide-slate-100 text-xs">
            {completedDonations.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                No completed donations recorded yet.
              </div>
            ) : (
              completedDonations.map((don) => (
                <div key={don.id} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">{don.resourceName}</div>
                    <div className="text-slate-500 text-[11px]">
                      Donated by: {don.ngoName} · Quantity: {don.quantityOffered} units
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-700 font-semibold flex items-center gap-1 justify-end">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Delivered</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">{don.deliveryDate}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
