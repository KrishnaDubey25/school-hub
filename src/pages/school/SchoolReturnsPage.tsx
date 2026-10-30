import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStoredData, saveStoredData, logActivity, pushNotification } from '../../services/storage';
import { BorrowingTransaction, ComplaintDispute } from '../../types';
import { CameraUploadModal } from '../../components/common/CameraUploadModal';
import {
  RotateCcw,
  Check,
  AlertTriangle,
  Camera,
  CheckCircle2,
  Calendar,
  X,
} from 'lucide-react';

export const SchoolReturnsPage: React.FC = () => {
  const { currentSchool, currentUser } = useAuth();
  const [store, setStore] = useState(getStoredData());
  const schoolId = currentSchool?.id || currentUser?.schoolId || '';

  // Dispute / Damage Report Modal state
  const [reportModalTx, setReportModalTx] = useState<BorrowingTransaction | null>(null);
  const [damageDescription, setDamageDescription] = useState('');
  const [damagePhoto, setDamagePhoto] = useState<string | undefined>(undefined);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  // Transactions relevant to returns: either Received by Borrower, Return Initiated, or Returned
  const returnTransactions = store.transactions.filter(
    (t) =>
      (t.borrowerSchoolId === schoolId || t.lenderSchoolId === schoolId) &&
      (t.status === 'Received by Borrower' ||
        t.status === 'Return Initiated' ||
        t.status === 'Returned to Lender')
  );

  const handleInitiateReturn = (txId: string) => {
    const target = store.transactions.find((t) => t.id === txId);
    if (!target) return;

    const updated = {
      ...store,
      transactions: store.transactions.map((t) =>
        t.id === txId
          ? {
              ...t,
              status: 'Return Initiated' as const,
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
      'Return Initiated',
      `Initiated return shipment of ${target.quantity} units of ${target.resourceName} to ${target.lenderSchoolName}`
    );

    pushNotification(
      'school',
      target.lenderSchoolId,
      'Borrowed Items Return Dispatched',
      `${target.borrowerSchoolName} initiated return of ${target.quantity} units of ${target.resourceName}.`,
      '/school/returns'
    );
  };

  const handleConfirmReturnReceived = (txId: string) => {
    const target = store.transactions.find((t) => t.id === txId);
    if (!target) return;

    // Restore available quantity in lender's inventory
    const updated = {
      ...store,
      transactions: store.transactions.map((t) =>
        t.id === txId
          ? {
              ...t,
              status: 'Returned to Lender' as const,
              actualReturnDate: new Date().toISOString().split('T')[0],
              updatedAt: new Date().toISOString(),
            }
          : t
      ),
      resources: store.resources.map((r) =>
        r.id === target.resourceId
          ? {
              ...r,
              availableQuantity: r.availableQuantity + target.quantity,
              reservedQuantity: Math.max(0, r.reservedQuantity - target.quantity),
              updatedAt: new Date().toISOString(),
            }
          : r
      ),
    };

    saveStoredData(updated);
    setStore(updated);

    logActivity(
      'school',
      currentSchool?.schoolName || 'School',
      'Return Received & Inventory Restored',
      `Confirmed receipt of returned items for Tx #${target.id}. Restored ${target.quantity} units to catalog.`
    );
  };

  const handleReportDamageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportModalTx) return;

    const disputeId = `comp-${Date.now()}`;
    const newComplaint: ComplaintDispute = {
      id: disputeId,
      transactionId: reportModalTx.id,
      reporterRole: 'school',
      reporterId: schoolId,
      reporterName: `${currentSchool?.principalName || 'Principal'} (${currentSchool?.schoolName || 'School'})`,
      title: `Damaged or Missing Resource Reported on Tx #${reportModalTx.id}`,
      description: damageDescription,
      status: 'Open',
      createdAt: new Date().toISOString(),
    };

    const updated = {
      ...store,
      complaints: [newComplaint, ...store.complaints],
      transactions: store.transactions.map((t) =>
        t.id === reportModalTx.id
          ? {
              ...t,
              damagedOrMissingReported: true,
              damageReportDetails: damageDescription,
              status: 'Disputed' as const,
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
      'Damaged / Missing Item Incident Reported',
      `Logged dispute on Tx #${reportModalTx.id} (${reportModalTx.resourceName}): ${damageDescription}`
    );

    pushNotification(
      'admin',
      'user-admin-1',
      'Incident Notice: Damaged or Missing Item',
      `${currentSchool?.schoolName || 'A government school'} reported an issue on Tx #${reportModalTx.id}.`,
      '/admin/complaints'
    );

    setReportSuccess(true);
    setTimeout(() => {
      setReportModalTx(null);
      setReportSuccess(false);
      setDamageDescription('');
      setDamagePhoto(undefined);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Borrowed Resource Return & Asset Reconciliation
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Coordinate return journeys upon completion of academic loan terms, verify equipment condition, and report discrepancies.
        </p>
      </div>

      <div className="space-y-4">
        {returnTransactions.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
            No return cycles currently pending.
          </div>
        ) : (
          returnTransactions.map((tx) => {
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
                      {isBorrower ? 'Return Scheduled by Us' : 'Incoming Return from Peer School'}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">Tx #{tx.id}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{tx.resourceName}</h3>

                  <div className="text-xs text-slate-600 space-y-0.5">
                    <div>
                      {isBorrower ? (
                        <>Lender Institution: <strong>{tx.lenderSchoolName}</strong></>
                      ) : (
                        <>Borrower Institution: <strong>{tx.borrowerSchoolName}</strong></>
                      )}
                    </div>
                    <div>
                      Quantity: <span className="font-mono font-bold text-slate-800">{tx.quantity} units</span> · Scheduled Return Due Date:{' '}
                      <span className="font-mono font-semibold text-amber-700">{tx.returnDueDate}</span>
                    </div>
                  </div>

                  {tx.damagedOrMissingReported && (
                    <div className="p-2.5 bg-red-50 text-red-800 rounded-lg text-xs flex items-center gap-2 border border-red-200">
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>Damaged or Missing Item report filed. Central Administrator investigating.</span>
                    </div>
                  )}
                </div>

                {/* Return actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0">
                  {/* Borrower: Initiate return */}
                  {isBorrower && tx.status === 'Received by Borrower' && (
                    <button
                      type="button"
                      onClick={() => handleInitiateReturn(tx.id)}
                      className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Initiate Equipment Return</span>
                    </button>
                  )}

                  {/* Lender: Confirm return received & restore inventory */}
                  {!isBorrower && tx.status === 'Return Initiated' && (
                    <button
                      type="button"
                      onClick={() => handleConfirmReturnReceived(tx.id)}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Confirm Return & Restore Stock</span>
                    </button>
                  )}

                  {/* Report damage button */}
                  {!tx.damagedOrMissingReported && tx.status !== 'Returned to Lender' && (
                    <button
                      type="button"
                      onClick={() => {
                        setReportModalTx(tx);
                        setDamageDescription('');
                        setDamagePhoto(undefined);
                      }}
                      className="px-2.5 py-1.5 text-red-700 hover:bg-red-50 border border-red-200 rounded-lg text-xs font-medium"
                    >
                      Report Damage / Missing
                    </button>
                  )}

                  {tx.status === 'Returned to Lender' && (
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Loan Completed Safely</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Damage Report Modal */}
      {reportModalTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 text-slate-800 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-base text-slate-900">
                  Report Damaged or Missing Educational Resource
                </h3>
              </div>
              <button onClick={() => setReportModalTx(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {reportSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Damage incident report logged with Central Directorate. Administrator will initiate audit.</span>
              </div>
            ) : (
              <form onSubmit={handleReportDamageSubmit} className="space-y-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="font-semibold text-slate-900">{reportModalTx.resourceName}</div>
                  <div className="text-slate-500 font-mono">Tx #{reportModalTx.id} · {reportModalTx.quantity} units</div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Damage / Missing Item Explanation *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={damageDescription}
                    onChange={(e) => setDamageDescription(e.target.value)}
                    placeholder="Specify whether item was broken in transit, missing pieces, non-functional lenses/cords, etc..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-1 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Condition Photograph Proof (Optional)
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCameraOpen(true)}
                      className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 rounded-lg text-xs font-medium flex items-center gap-1.5"
                    >
                      <Camera className="w-4 h-4 text-slate-600" />
                      <span>{damagePhoto ? 'Replace Photo' : 'Capture / Upload Photo'}</span>
                    </button>
                    {damagePhoto && (
                      <span className="text-emerald-700 font-medium">Photograph attached</span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReportModalTx(null)}
                    className="py-1.5 px-3 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-1.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold"
                  >
                    Submit Formal Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <CameraUploadModal
        isOpen={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onImageSelected={(url) => setDamagePhoto(url)}
        currentImage={damagePhoto}
        title="Document Damaged Condition"
      />
    </div>
  );
};
