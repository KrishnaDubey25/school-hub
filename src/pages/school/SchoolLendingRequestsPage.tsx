import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStoredData, saveStoredData, logActivity, pushNotification } from '../../services/storage';
import { BorrowingTransaction } from '../../types';
import { Inbox, Check, X, Clock, AlertCircle } from 'lucide-react';

export const SchoolLendingRequestsPage: React.FC = () => {
  const { currentSchool, currentUser } = useAuth();
  const [store, setStore] = useState(getStoredData());
  const schoolId = currentSchool?.id || currentUser?.schoolId || '';

  const [rejectModalTx, setRejectModalTx] = useState<BorrowingTransaction | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const incoming = store.transactions.filter((t) => t.lenderSchoolId === schoolId);

  const handleApprove = (tx: BorrowingTransaction) => {
    const updated = {
      ...store,
      transactions: store.transactions.map((t) =>
        t.id === tx.id
          ? {
              ...t,
              status: 'Lender Approved' as const,
              updatedAt: new Date().toISOString(),
            }
          : t
      ),
    };

    saveStoredData(updated);
    setStore(updated);

    logActivity(
      'school',
      currentSchool?.schoolName || 'School',
      'Lending Request Approved',
      `Approved request from ${tx.borrowerSchoolName} for ${tx.quantity} units of ${tx.resourceName}`
    );

    // Notify Central Administrator for delivery coordination
    pushNotification(
      'admin',
      'user-admin-1',
      'Loan Approved: Coordination Required',
      `${tx.lenderSchoolName} approved lending ${tx.quantity} units of ${tx.resourceName} to ${tx.borrowerSchoolName}. Assign carrier.`,
      '/admin/deliveries'
    );
  };

  const handleConfirmReject = () => {
    if (!rejectModalTx) return;

    // Restore resource available quantity
    const updated = {
      ...store,
      transactions: store.transactions.map((t) =>
        t.id === rejectModalTx.id
          ? {
              ...t,
              status: 'Lender Rejected' as const,
              lenderNotes: rejectReason || 'Lender unable to spare equipment for requested period.',
              updatedAt: new Date().toISOString(),
            }
          : t
      ),
      resources: store.resources.map((r) =>
        r.id === rejectModalTx.resourceId
          ? {
              ...r,
              availableQuantity: r.availableQuantity + rejectModalTx.quantity,
              reservedQuantity: Math.max(0, r.reservedQuantity - rejectModalTx.quantity),
            }
          : r
      ),
    };

    saveStoredData(updated);
    setStore(updated);

    logActivity(
      'school',
      currentSchool?.schoolName || 'School',
      'Lending Request Declined',
      `Declined borrow request from ${rejectModalTx.borrowerSchoolName} for ${rejectModalTx.resourceName}`
    );

    setRejectModalTx(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Incoming Inter-School Lending Requests
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Review requests from peer schools desiring to borrow surplus from your catalog.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Item Requested</th>
                <th className="py-3 px-4">Borrowing School</th>
                <th className="py-3 px-4">Quantity & Period</th>
                <th className="py-3 px-4">Purpose</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {incoming.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    No incoming borrow requests at this time.
                  </td>
                </tr>
              ) : (
                incoming.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{tx.resourceName}</div>
                      <div className="text-[11px] font-mono text-slate-500">ID: {tx.id}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{tx.borrowerSchoolName}</div>
                      <div className="text-[11px] text-slate-500">{tx.borrowerDistrict}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900 tabular-nums">
                        {tx.quantity} units
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {tx.requestedStartDate} to {tx.returnDueDate}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="text-slate-600 truncate" title={tx.purpose}>
                        {tx.purpose || 'Classroom syllabus practicals'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          tx.status === 'Requested'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : tx.status === 'Lender Rejected'
                            ? 'bg-red-50 text-red-800 border border-red-200'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {tx.status === 'Requested' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleApprove(tx)}
                            className="px-2.5 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded text-xs font-semibold flex items-center gap-1 shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve Loan</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRejectModalTx(tx);
                              setRejectReason('');
                            }}
                            className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded text-xs font-medium"
                          >
                            Decline
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500">Decision Recorded</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModalTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Decline Borrowing Request</h3>
            <p className="text-xs text-slate-600">
              Please specify the reason for declining <strong>{rejectModalTx.borrowerSchoolName}</strong>&apos;s request for {rejectModalTx.resourceName}:
            </p>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Items currently required for upcoming internal mid-term examinations..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalTx(null)}
                className="py-1.5 px-3 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="py-1.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold"
              >
                Decline Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
