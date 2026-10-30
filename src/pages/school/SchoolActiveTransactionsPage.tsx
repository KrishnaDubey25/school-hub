import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStoredData, saveStoredData, logActivity } from '../../services/storage';
import { BorrowingTransaction } from '../../types';
import {
  ArrowLeftRight,
  Truck,
  CheckCircle2,
  PackageCheck,
  Calendar,
  AlertTriangle,
  Check,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const SchoolActiveTransactionsPage: React.FC = () => {
  const { currentSchool, currentUser } = useAuth();
  const [store, setStore] = useState(getStoredData());
  const schoolId = currentSchool?.id || currentUser?.schoolId || '';

  const activeTransactions = store.transactions.filter(
    (t) =>
      (t.borrowerSchoolId === schoolId || t.lenderSchoolId === schoolId) &&
      t.status !== 'Returned to Lender' &&
      t.status !== 'Lender Rejected'
  );

  // Borrower action: confirm receipt when item arrives
  const handleConfirmReceipt = (txId: string) => {
    const target = store.transactions.find((t) => t.id === txId);
    if (!target) return;

    const updated = {
      ...store,
      transactions: store.transactions.map((t) =>
        t.id === txId
          ? {
              ...t,
              status: 'Received by Borrower' as const,
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
      'Delivery Receipt Confirmed',
      `Confirmed safe receipt of ${target.quantity} units of ${target.resourceName} from ${target.lenderSchoolName}`
    );
  };

  // Lender action: confirm pickup by logistics carrier
  const handleConfirmPickup = (txId: string) => {
    const target = store.transactions.find((t) => t.id === txId);
    if (!target) return;

    const updated = {
      ...store,
      transactions: store.transactions.map((t) =>
        t.id === txId
          ? {
              ...t,
              status: 'In Transit' as const,
              pickupDate: new Date().toISOString().split('T')[0],
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
      'Cargo Pickup Confirmed',
      `Handed over ${target.quantity} units of ${target.resourceName} to ${target.deliveryCoordinator || 'logistics carrier'}`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Active Borrowing & Lending Operations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor shipments in transit, confirm deliveries upon arrival, and track return schedules.
          </p>
        </div>

        <Link
          to="/school/returns"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-xs"
        >
          <span>Return Management Desk →</span>
        </Link>
      </div>

      <div className="space-y-4">
        {activeTransactions.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
            No active loan transactions in progress.
          </div>
        ) : (
          activeTransactions.map((tx) => {
            const isBorrower = tx.borrowerSchoolId === schoolId;
            return (
              <div
                key={tx.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-slate-300 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        isBorrower
                          ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                          : 'bg-teal-50 text-teal-800 border border-teal-200'
                      }`}
                    >
                      {isBorrower ? 'Our School is Borrowing' : 'Our School is Lending'}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">Tx #{tx.id}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{tx.resourceName}</h3>

                  <div className="text-xs text-slate-600 space-y-0.5">
                    <div>
                      {isBorrower ? (
                        <>
                          Lender Institution: <strong>{tx.lenderSchoolName}</strong> ({tx.lenderDistrict})
                        </>
                      ) : (
                        <>
                          Borrower Institution: <strong>{tx.borrowerSchoolName}</strong> ({tx.borrowerDistrict})
                        </>
                      )}
                    </div>
                    <div>
                      Quantity: <span className="font-mono font-bold text-slate-800">{tx.quantity} units</span> · Scheduled Return Due Date:{' '}
                      <span className="font-mono font-semibold text-amber-700">{tx.returnDueDate}</span>
                    </div>
                    {tx.deliveryCoordinator && (
                      <div className="text-slate-500 text-[11px]">
                        Logistics: {tx.deliveryCoordinator} {tx.deliveryNotes && `(${tx.deliveryNotes})`}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status & Functional Handover Handlers */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                  <div className="text-left sm:text-right">
                    <div className="text-[11px] text-slate-400 font-medium">Cycle Status</div>
                    <span
                      className={`inline-flex items-center gap-1 font-semibold text-xs mt-0.5 ${
                        tx.status === 'Received by Borrower'
                          ? 'text-emerald-700 font-bold'
                          : tx.status === 'In Transit'
                          ? 'text-blue-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {tx.status === 'In Transit' && <Truck className="w-3.5 h-3.5" />}
                      {tx.status === 'Received by Borrower' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>{tx.status}</span>
                    </span>
                  </div>

                  {/* Actions based on role and stage */}
                  <div className="flex items-center gap-2">
                    {/* Borrower can confirm receipt if in transit */}
                    {isBorrower && tx.status === 'In Transit' && (
                      <button
                        type="button"
                        onClick={() => handleConfirmReceipt(tx.id)}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Confirm Receipt of Items</span>
                      </button>
                    )}

                    {/* Lender can confirm handover/pickup if coordinated */}
                    {!isBorrower && tx.status === 'Admin Coordinated' && (
                      <button
                        type="button"
                        onClick={() => handleConfirmPickup(tx.id)}
                        className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Confirm Pickup by Carrier</span>
                      </button>
                    )}

                    {isBorrower && tx.status === 'Received by Borrower' && (
                      <Link
                        to="/school/returns"
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
                      >
                        Manage Return
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
