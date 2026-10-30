import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { DonationOffer, DonationStatus } from '../../types';
import {
  Gift,
  Search,
  Check,
  X,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminDonationsPage: React.FC = () => {
  const { store, updateDonation } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reviewModalOffer, setReviewModalOffer] = useState<DonationOffer | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const filteredDonations = store.donations.filter((d) => {
    const matchesSearch =
      d.resourceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.ngoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.targetSchoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' ? true : d.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleApproveDonation = (donationId: string) => {
    updateDonation(donationId, {
      status: 'Admin Approved',
      adminReviewNotes: reviewNotes || 'Approved by Central Resource Officer. Cleared for dispatch.',
    });
    setReviewModalOffer(null);
    setReviewNotes('');
  };

  const handleRejectDonation = (donationId: string) => {
    updateDonation(donationId, {
      status: 'Admin Rejected',
      adminReviewNotes: reviewNotes || 'Declined during administrative audit.',
    });
    setReviewModalOffer(null);
    setReviewNotes('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            NGO Material Donation Approvals
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate philanthropic donation commitments, verify equipment safety standards, and clear shipments.
          </p>
        </div>

        <div className="text-xs text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
          Total Offers: <span className="font-bold text-slate-900">{store.donations.length}</span>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by resource, donor NGO, target school, or ID..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-1 focus:ring-teal-700 bg-white text-slate-900"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
          {['all', 'Offer Submitted', 'Admin Approved', 'Dispatched by NGO', 'Delivered & Confirmed'].map(
            (st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'all' ? 'All Offers' : st}
              </button>
            )
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Offer ID & Resource</th>
                <th className="py-3 px-4">Donor NGO</th>
                <th className="py-3 px-4">Target Government School</th>
                <th className="py-3 px-4">Quantity & Est. Value</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredDonations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    No donation commitments found.
                  </td>
                </tr>
              ) : (
                filteredDonations.map((don) => (
                  <tr key={don.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{don.resourceName}</div>
                      <div className="text-[11px] font-mono text-slate-500">ID: {don.id} · {don.category}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{don.ngoName}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{don.targetSchoolName}</div>
                      <div className="text-[11px] text-slate-500">{don.targetDistrict}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-semibold text-slate-900 tabular-nums">
                        {don.quantityOffered} units ({don.condition})
                      </div>
                      {don.estimatedValue && (
                        <div className="text-[11px] font-mono text-slate-500 tabular-nums">
                          ₹{don.estimatedValue.toLocaleString()}
                        </div>
                      )}
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
                      {don.status === 'Offer Submitted' ? (
                        <button
                          type="button"
                          onClick={() => {
                            setReviewModalOffer(don);
                            setReviewNotes('');
                          }}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
                        >
                          Review & Clear
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setReviewModalOffer(don)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {reviewModalOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 text-slate-800 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {reviewModalOffer.status === 'Offer Submitted' ? 'Review Donation Offer' : 'Donation Details'}
                </h3>
                <p className="text-xs text-slate-500 font-mono">Offer #{reviewModalOffer.id}</p>
              </div>
              <button onClick={() => setReviewModalOffer(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                <div className="text-slate-400 font-medium">Resource Item</div>
                <div className="font-bold text-slate-900">{reviewModalOffer.resourceName}</div>
                <div className="text-slate-600">{reviewModalOffer.description}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-slate-400 font-medium">Donor NGO</div>
                  <div className="font-bold text-slate-800 mt-0.5">{reviewModalOffer.ngoName}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-slate-400 font-medium">Target School</div>
                  <div className="font-bold text-slate-800 mt-0.5">{reviewModalOffer.targetSchoolName}</div>
                  <div className="text-slate-500 text-[11px]">{reviewModalOffer.targetDistrict}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-slate-400 font-medium">Quantity Offered</div>
                  <div className="font-bold text-slate-800 font-mono tabular-nums mt-0.5">
                    {reviewModalOffer.quantityOffered} units ({reviewModalOffer.condition})
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-slate-400 font-medium">Current Status</div>
                  <div className="font-bold text-slate-800 mt-0.5 capitalize">{reviewModalOffer.status}</div>
                </div>
              </div>

              {reviewModalOffer.dispatchTrackingRef && (
                <div className="p-3 bg-blue-50 text-blue-900 rounded-lg space-y-1">
                  <div className="font-semibold">Dispatch Tracking Info:</div>
                  <div className="font-mono">{reviewModalOffer.dispatchTrackingRef}</div>
                  {reviewModalOffer.coordinatorName && <div>Coordinator: {reviewModalOffer.coordinatorName}</div>}
                </div>
              )}

              {reviewModalOffer.status === 'Offer Submitted' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Administrative Review Notes (Optional for Approval, Required for Rejection)
                  </label>
                  <textarea
                    rows={2}
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Enter compliance verification or comments..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden"
                  />
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setReviewModalOffer(null)}
                className="py-1.5 px-3 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600"
              >
                Close
              </button>

              {reviewModalOffer.status === 'Offer Submitted' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleRejectDonation(reviewModalOffer.id)}
                    className="py-1.5 px-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-semibold"
                  >
                    Reject Offer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApproveDonation(reviewModalOffer.id)}
                    className="py-1.5 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve Donation</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
