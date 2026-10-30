import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStoredData, saveStoredData, logActivity, pushNotification } from '../../services/storage';
import { DonationOffer } from '../../types';
import {
  Truck,
  CheckCircle2,
  Clock,
  Calendar,
  Send,
  X,
  Check,
  Building,
} from 'lucide-react';

export const NGODeliveriesPage: React.FC = () => {
  const { currentNGO, currentUser } = useAuth();
  const [store, setStore] = useState(getStoredData());
  const ngoId = currentNGO?.id || currentUser?.ngoId || '';

  const [dispatchModalOffer, setDispatchModalOffer] = useState<DonationOffer | null>(null);
  const [trackingRef, setTrackingRef] = useState('');
  const [carrierName, setCarrierName] = useState('Govt Postal SpeedPost / BlueDart Logistics');
  const [dispatchDate, setDispatchDate] = useState(new Date().toISOString().split('T')[0]);

  const myDonations = store.donations.filter((d) => d.ngoId === ngoId);

  const handleOpenDispatch = (don: DonationOffer) => {
    setDispatchModalOffer(don);
    setTrackingRef(`NGO-DISP-${Math.floor(1000 + Math.random() * 9000)}`);
    setDispatchDate(new Date().toISOString().split('T')[0]);
  };

  const handleConfirmDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchModalOffer) return;

    const updated = {
      ...store,
      donations: store.donations.map((d) =>
        d.id === dispatchModalOffer.id
          ? {
              ...d,
              status: 'Dispatched by NGO' as const,
              dispatchTrackingRef: trackingRef,
              coordinatorName: carrierName,
              dispatchDate,
              updatedAt: new Date().toISOString(),
            }
          : d
      ),
    };

    saveStoredData(updated);
    setStore(updated);

    logActivity(
      'ngo',
      currentNGO?.ngoName || 'NGO Partner',
      'Donation Cargo Dispatched',
      `Dispatched ${dispatchModalOffer.quantityOffered} units of ${dispatchModalOffer.resourceName} to ${dispatchModalOffer.targetSchoolName} (Ref: ${trackingRef})`
    );

    // Notify school of incoming dispatch
    pushNotification(
      'school',
      dispatchModalOffer.targetSchoolId,
      'Donation Shipment Dispatched',
      `${currentNGO?.ngoName || 'Partner NGO'} dispatched ${dispatchModalOffer.quantityOffered} units of ${dispatchModalOffer.resourceName}. Tracking: ${trackingRef}.`,
      '/school/donations'
    );

    setDispatchModalOffer(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          NGO Donation Dispatch & Delivery Tracking
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Generate logistics waybills, dispatch cleared equipment donations, and follow custody until school acknowledgment.
        </p>
      </div>

      <div className="space-y-4">
        {myDonations.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
            No donation shipments currently recorded.
          </div>
        ) : (
          myDonations.map((don) => (
            <div
              key={don.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-slate-300 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-amber-50 text-amber-800 border border-amber-200">
                    Offer #{don.id}
                  </span>
                  <span className="font-bold text-xs text-slate-900">{don.resourceName}</span>
                </div>

                <div className="text-xs text-slate-600 space-y-0.5">
                  <div>
                    Beneficiary School: <strong>{don.targetSchoolName}</strong> ({don.targetDistrict})
                  </div>
                  <div>
                    Quantity: <span className="font-mono font-bold text-slate-800">{don.quantityOffered} units</span> ({don.condition})
                  </div>
                  {don.dispatchTrackingRef && (
                    <div className="text-[11px] text-blue-700 font-mono pt-1">
                      Carrier: {don.coordinatorName || 'Logistics'} · Waybill Ref: <strong>{don.dispatchTrackingRef}</strong> (Dispatched: {don.dispatchDate})
                    </div>
                  )}
                  {don.adminReviewNotes && (
                    <div className="text-[11px] text-slate-500 italic">
                      Admin clearance: {don.adminReviewNotes}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                <div className="text-left sm:text-right">
                  <div className="text-[11px] text-slate-400">Current Status</div>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold mt-0.5 ${
                      don.status === 'Delivered & Confirmed'
                        ? 'text-emerald-700 font-bold'
                        : don.status === 'Dispatched by NGO'
                        ? 'text-blue-700'
                        : don.status === 'Admin Approved'
                        ? 'text-teal-700 font-bold'
                        : 'text-amber-700'
                    }`}
                  >
                    {don.status === 'Delivered & Confirmed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {don.status === 'Dispatched by NGO' && <Truck className="w-3.5 h-3.5" />}
                    <span>{don.status}</span>
                  </span>
                </div>

                {don.status === 'Admin Approved' && (
                  <button
                    type="button"
                    onClick={() => handleOpenDispatch(don)}
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Enter Dispatch Reference</span>
                  </button>
                )}

                {don.status === 'Offer Submitted' && (
                  <span className="text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                    Awaiting Admin Approval
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Dispatch Modal */}
      {dispatchModalOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 text-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                Confirm Donation Dispatch & Cargo Carrier
              </h3>
              <button onClick={() => setDispatchModalOffer(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmDispatch} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                <div className="font-bold text-slate-900">{dispatchModalOffer.resourceName}</div>
                <div className="text-slate-600">
                  Target School: {dispatchModalOffer.targetSchoolName} ({dispatchModalOffer.quantityOffered} units)
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Logistics Carrier / Vehicle / Courier *
                </label>
                <input
                  type="text"
                  required
                  value={carrierName}
                  onChange={(e) => setCarrierName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Waybill / Consignment Tracking Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={trackingRef}
                    onChange={(e) => setTrackingRef(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Date of Handover / Dispatch *
                  </label>
                  <input
                    type="date"
                    required
                    value={dispatchDate}
                    onChange={(e) => setDispatchDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDispatchModalOffer(null)}
                  className="py-1.5 px-3 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-1.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Confirm Dispatch & Transmit Tracking</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
