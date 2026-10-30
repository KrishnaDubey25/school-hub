import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  HeartHandshake,
  Gift,
  Clock,
  CheckCircle2,
  Building,
  Truck,
  Search,
  PlusCircle,
  BarChart3,
  ChevronRight,
  School,
} from 'lucide-react';
import { motion } from 'motion/react';

export const NGOOverviewPage: React.FC = () => {
  const { currentNGO, currentUser } = useAuth();
  const { store } = useData();
  const ngoId = currentNGO?.id || currentUser?.ngoId || '';

  const myDonations = store.donations.filter((d) => d.ngoId === ngoId);
  const activeCommitments = myDonations.filter(
    (d) => d.status === 'Offer Submitted' || d.status === 'Admin Approved' || d.status === 'Dispatched by NGO'
  );
  const pendingApprovals = myDonations.filter((d) => d.status === 'Offer Submitted');
  const completedDonations = myDonations.filter((d) => d.status === 'Delivered & Confirmed');
  const distinctSchoolsSupported = new Set(myDonations.map((d) => d.targetSchoolId)).size;
  const totalUnitsDonated = myDonations.reduce((acc, d) => acc + d.quantityOffered, 0);

  // Requirements matching NGO supported categories
  const supportedCategories = currentNGO?.resourceCategoriesSupported || ['Computers and IT', 'Laboratory Equipment'];
  const matchingSchoolNeeds = store.requirements.filter(
    (r) =>
      r.status === 'Open' &&
      (r.requestType === 'Permanent Need / Donation' || r.requestType === 'Either') &&
      supportedCategories.includes(r.category)
  );

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {currentNGO?.ngoName || 'NGO Partner Dashboard'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Registration: <span className="font-mono font-medium">{currentNGO?.registrationNumber || 'N/A'}</span> · {currentNGO?.district}, {currentNGO?.state} · Authorized Rep: {currentNGO?.authorizedRepresentative}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/ngo/browse-needs"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Browse School Needs</span>
          </Link>
          <Link
            to="/ngo/offer-donation"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Offer Donation</span>
          </Link>
        </div>
      </div>

      {/* 6 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Total Donations</div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {myDonations.length}
          </div>
          <div className="text-[11px] text-slate-400">Total commitments</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-amber-700 font-medium">Active Commitments</div>
          <div className="text-2xl font-bold font-mono text-amber-600 tabular-nums">
            {activeCommitments.length}
          </div>
          <div className="text-[11px] text-slate-400">In process</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Pending Approvals</div>
          <div className="text-2xl font-bold font-mono text-indigo-700 tabular-nums">
            {pendingApprovals.length}
          </div>
          <div className="text-[11px] text-slate-400">Under admin review</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-emerald-700 font-medium">Completed Deliveries</div>
          <div className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">
            {completedDonations.length}
          </div>
          <div className="text-[11px] text-slate-400">Verified by schools</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Schools Supported</div>
          <div className="text-2xl font-bold font-mono text-teal-700 tabular-nums">
            {distinctSchoolsSupported}
          </div>
          <div className="text-[11px] text-slate-400">Beneficiary campuses</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Units Donated</div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {totalUnitsDonated}
          </div>
          <div className="text-[11px] text-slate-400">Physical assets delivered</div>
        </div>
      </div>

      {/* School Requirements Matching NGO Interests */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Gift className="w-4 h-4 text-amber-600" />
              <span>School Requirements Matching Your Support Profile</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Government schools seeking donations in {supportedCategories.join(', ')}.
            </p>
          </div>
          <Link
            to="/ngo/browse-needs"
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
          >
            <span>Browse All Needs</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {matchingSchoolNeeds.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No active open requirements currently match your categories. Check back soon or browse all open requirements.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matchingSchoolNeeds.slice(0, 4).map((need) => (
              <div
                key={need.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-amber-500 bg-amber-50/20 flex flex-col justify-between space-y-3 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-amber-800 uppercase">
                      {need.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        need.priority === 'Urgent'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {need.priority} Priority
                    </span>
                  </div>
                  <h3 className="font-bold text-xs text-slate-900 mt-1">{need.resourceName}</h3>
                  <div className="text-[11px] text-slate-600 mt-1">
                    School: <strong>{need.schoolName}</strong> ({need.district}, {need.state})
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1">{need.description}</p>
                  <div className="text-[11px] text-slate-500 mt-1 font-mono">
                    Required: <strong>{need.quantityRequired} units</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-end">
                  <Link
                    to={`/ngo/offer-donation?reqId=${need.id}`}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs"
                  >
                    <span>Offer Donation</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Two Column Grid: Pending Donation Reviews & Active Deliveries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending approvals */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Pending Administrative Reviews ({pendingApprovals.length})</span>
            </h2>
            <Link to="/ngo/my-donations" className="text-xs font-semibold text-teal-700 hover:underline">
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {pendingApprovals.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No donation offers awaiting administrative clearance.
              </div>
            ) : (
              pendingApprovals.map((don) => (
                <div key={don.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-bold text-xs text-slate-900">{don.resourceName}</div>
                    <div className="text-[11px] text-slate-600">
                      Target: <strong>{don.targetSchoolName}</strong>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Quantity: {don.quantityOffered} units · Submitted: {new Date(don.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                    Awaiting Audit
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Active Deliveries */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Active Shipments & Waybills</span>
            </h2>
            <Link to="/ngo/deliveries" className="text-xs font-semibold text-teal-700 hover:underline">
              Tracking Hub
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {myDonations.filter((d) => d.status === 'Dispatched by NGO' || d.status === 'Admin Approved').length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No active shipments in transit.
              </div>
            ) : (
              myDonations
                .filter((d) => d.status === 'Dispatched by NGO' || d.status === 'Admin Approved')
                .map((don) => (
                  <div key={don.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-bold text-xs text-slate-900">{don.resourceName}</div>
                      <div className="text-[11px] text-slate-600">
                        Destination: {don.targetSchoolName}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {don.dispatchTrackingRef ? `Tracking: ${don.dispatchTrackingRef}` : 'Awaiting dispatch tracking entry'}
                      </div>
                    </div>
                    <Link
                      to="/ngo/deliveries"
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
                    >
                      Update Dispatch
                    </Link>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
