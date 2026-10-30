import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStoredData, saveStoredData, logActivity } from '../../services/storage';
import { DonationOffer } from '../../types';
import { Gift, CheckCircle2, Truck, Clock, Check, HeartHandshake } from 'lucide-react';

export const SchoolDonationsPage: React.FC = () => {
  const { currentSchool, currentUser } = useAuth();
  const [store, setStore] = useState(getStoredData());
  const schoolId = currentSchool?.id || currentUser?.schoolId || '';

  const myDonations = store.donations.filter((d) => d.targetSchoolId === schoolId);

  const handleConfirmDeliveryReceipt = (donationId: string) => {
    const target = store.donations.find((d) => d.id === donationId);
    if (!target) return;

    const updated = {
      ...store,
      donations: store.donations.map((d) =>
        d.id === donationId
          ? {
              ...d,
              status: 'Delivered & Confirmed' as const,
              deliveryDate: new Date().toISOString().split('T')[0],
              updatedAt: new Date().toISOString(),
            }
          : d
      ),
    };

    saveStoredData(updated);
    setStore(updated);

    logActivity(
      'school',
      currentSchool?.schoolName || 'School',
      'Donation Delivery Confirmed',
      `Confirmed receipt of ${target.quantityOffered} units of ${target.resourceName} donated by ${target.ngoName}`
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Philanthropic NGO Donations Received & Scheduled
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          View material contributions, science kits, and equipment donated by verified NGO partners to our school.
        </p>
      </div>

      <div className="space-y-4">
        {myDonations.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
            No donation offers currently recorded for your institution.
          </div>
        ) : (
          myDonations.map((don) => (
            <div
              key={don.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-slate-300 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="p-1 bg-amber-50 text-amber-700 rounded">
                    <HeartHandshake className="w-4 h-4" />
                  </span>
                  <span className="font-bold text-xs text-slate-900">{don.resourceName}</span>
                  <span className="text-[11px] font-mono text-slate-400">Offer #{don.id}</span>
                </div>

                <p className="text-xs text-slate-600 max-w-2xl">{don.description}</p>

                <div className="text-[11px] text-slate-500 space-y-0.5 pt-1">
                  <div>
                    Donor NGO: <strong>{don.ngoName}</strong>
                  </div>
                  <div>
                    Quantity: <span className="font-mono font-bold text-slate-800">{don.quantityOffered} units</span> ({don.condition} condition)
                    {don.estimatedValue && ` · Value: ₹${don.estimatedValue.toLocaleString()}`}
                  </div>
                  {don.dispatchTrackingRef && (
                    <div className="text-blue-700 font-medium">
                      Waybill / Courier Ref: {don.dispatchTrackingRef}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                <div className="text-left sm:text-right">
                  <div className="text-[11px] text-slate-400">Status</div>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold mt-0.5 ${
                      don.status === 'Delivered & Confirmed'
                        ? 'text-emerald-700 font-bold'
                        : don.status === 'Dispatched by NGO'
                        ? 'text-blue-700'
                        : 'text-amber-700'
                    }`}
                  >
                    {don.status === 'Delivered & Confirmed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {don.status === 'Dispatched by NGO' && <Truck className="w-3.5 h-3.5" />}
                    {don.status === 'Offer Submitted' && <Clock className="w-3.5 h-3.5" />}
                    <span>{don.status}</span>
                  </span>
                </div>

                {don.status === 'Dispatched by NGO' && (
                  <button
                    type="button"
                    onClick={() => handleConfirmDeliveryReceipt(don.id)}
                    className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Confirm Receipt of Donated Items</span>
                  </button>
                )}

                {don.status === 'Delivered & Confirmed' && (
                  <div className="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 font-medium">
                    Delivered on {don.deliveryDate || 'Record'}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
