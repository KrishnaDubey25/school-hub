import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { motion } from 'motion/react';
import {
  School,
  Building2,
  PackageCheck,
  ArrowLeftRight,
  Gift,
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronRight,
  Check,
  X,
  UserCheck,
} from 'lucide-react';

export const AdminOverviewPage: React.FC = () => {
  const { store, stats, updateSchool, updateNGO } = useData();

  const pendingSchools = store.schools.filter((s) => s.verificationStatus === 'pending');
  const pendingNGOs = store.ngos.filter((n) => n.verificationStatus === 'pending');
  const pendingDonations = store.donations.filter((d) => d.status === 'Offer Submitted');
  const pendingCoordination = store.transactions.filter(
    (t) => t.status === 'Lender Approved' || (t.status === 'Requested' && !t.deliveryCoordinator)
  );
  const activeDeliveries = store.transactions.filter((t) => t.status === 'In Transit');

  const handleQuickApproveSchool = (schoolId: string) => {
    updateSchool(schoolId, { verificationStatus: 'approved' });
  };

  const handleQuickApproveNGO = (ngoId: string) => {
    updateNGO(ngoId, { verificationStatus: 'approved' });
  };

  return (
    <div className="space-y-8">
      {/* Title & Central Admin Notice */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Central Directorate Overview
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          High-level operational metrics, institutional verification queues, and active inter-school logistics.
        </p>
      </div>

      {/* 10 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Total Schools</span>
            <School className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {stats.totalRegisteredSchools}
          </div>
          <div className="text-[11px] text-slate-400">{stats.verifiedSchools} verified</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-amber-700 font-medium flex items-center justify-between">
            <span>Pending Schools</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600 tabular-nums">
            {stats.pendingSchoolApprovals}
          </div>
          <div className="text-[11px] text-slate-400">Awaiting UDISE audit</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Partner NGOs</span>
            <Building2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {stats.registeredNGOs}
          </div>
          <div className="text-[11px] text-slate-400">{stats.pendingNGOApprovals} pending verification</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Open Needs</span>
            <PackageCheck className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-teal-700 tabular-nums">
            {stats.activeResourceRequests}
          </div>
          <div className="text-[11px] text-slate-400">Published requirements</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Active Loans</span>
            <ArrowLeftRight className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-700 tabular-nums">
            {stats.activeBorrowingTransactions}
          </div>
          <div className="text-[11px] text-slate-400">Inter-school items</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Pending Donations</span>
            <Gift className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600 tabular-nums">
            {stats.pendingDonations}
          </div>
          <div className="text-[11px] text-slate-400">Awaiting director review</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>In Transit</span>
            <Truck className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-blue-600 tabular-nums">
            {stats.pendingDeliveries}
          </div>
          <div className="text-[11px] text-slate-400">Dispatched shipments</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Completed Loans</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">
            {stats.completedTransactions}
          </div>
          <div className="text-[11px] text-slate-400">Safely returned/fulfilled</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Donations Confirmed</span>
            <CheckCircle className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-teal-800 tabular-nums">
            {stats.totalDonationsDelivered}
          </div>
          <div className="text-[11px] text-slate-400">Permanently transferred</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Students Impacted</span>
            <UserCheck className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {stats.studentsImpactedEstimate.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400">Across verified campuses</div>
        </div>
      </div>

      {/* Main Review Queues Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Queue 1: Pending School Approvals */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <School className="w-4 h-4 text-teal-700" />
              <h2 className="text-sm font-bold text-slate-900">
                Pending School Registrations ({pendingSchools.length})
              </h2>
            </div>
            <Link to="/admin/schools" className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {pendingSchools.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                All registered government schools are verified. No pending applications.
              </div>
            ) : (
              pendingSchools.map((s) => (
                <div key={s.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="space-y-1 pr-4">
                    <div className="text-xs font-bold text-slate-900">{s.schoolName}</div>
                    <div className="text-[11px] text-slate-500">
                      UDISE: <span className="font-mono">{s.udiseCode}</span> · {s.district}, {s.state}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Principal: {s.principalName} · {s.studentCount} students
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleQuickApproveSchool(s.id)}
                      className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <Link
                      to={`/admin/schools`}
                      className="px-2.5 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-medium"
                    >
                      Audit
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Queue 2: Pending NGO Approvals */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Pending NGO Verifications ({pendingNGOs.length})
              </h2>
            </div>
            <Link to="/admin/ngos" className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {pendingNGOs.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                All registered NGOs are reviewed and active.
              </div>
            ) : (
              pendingNGOs.map((n) => (
                <div key={n.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="space-y-1 pr-4">
                    <div className="text-xs font-bold text-slate-900">{n.ngoName}</div>
                    <div className="text-[11px] text-slate-500">
                      Reg: <span className="font-mono">{n.registrationNumber}</span> · {n.district}, {n.state}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Rep: {n.authorizedRepresentative} · {n.areasOfSupport.join(', ')}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleQuickApproveNGO(n.id)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <Link
                      to={`/admin/ngos`}
                      className="px-2.5 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-medium"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Queue 3: Donations Awaiting Review */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Donation Offers Requiring Review ({pendingDonations.length})
              </h2>
            </div>
            <Link to="/admin/donations" className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1">
              <span>Manage</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {pendingDonations.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No new donation offers currently pending administrative clearance.
              </div>
            ) : (
              pendingDonations.map((d) => (
                <div key={d.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="space-y-1 pr-4">
                    <div className="text-xs font-bold text-slate-900">{d.resourceName}</div>
                    <div className="text-[11px] text-slate-600">
                      Offered by: <strong>{d.ngoName}</strong> → Target: {d.targetSchoolName}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Quantity: <span className="font-mono font-semibold">{d.quantityOffered} units</span> · Condition: {d.condition}
                    </div>
                  </div>
                  <Link
                    to="/admin/donations"
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shrink-0"
                  >
                    Review Offer
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Queue 4: Deliveries Requiring Coordination */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Deliveries In Transit / Coordination ({activeDeliveries.length})
              </h2>
            </div>
            <Link to="/admin/deliveries" className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1">
              <span>Delivery Hub</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {activeDeliveries.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No active delivery shipments in transit at this time.
              </div>
            ) : (
              activeDeliveries.map((t) => (
                <div key={t.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="space-y-1 pr-4">
                    <div className="text-xs font-bold text-slate-900">{t.resourceName}</div>
                    <div className="text-[11px] text-slate-600">
                      From: {t.lenderSchoolName} → To: {t.borrowerSchoolName}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Coordinator: {t.deliveryCoordinator || 'Not assigned'} · Expected: {t.expectedDeliveryDate || 'TBD'}
                    </div>
                  </div>
                  <Link
                    to="/admin/deliveries"
                    className="px-3 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold shrink-0"
                  >
                    Track Dispatch
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Platform Activity Audit Log */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900">Recent Platform Operations & Logs</h2>
          <Link to="/admin/logs" className="text-xs font-medium text-teal-700 hover:underline">
            View Complete Audit Log
          </Link>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {store.activityLogs.slice(0, 6).map((log) => (
            <div key={log.id} className="py-2.5 flex items-start justify-between gap-4">
              <div>
                <span className="font-semibold text-slate-900">{log.action}:</span>{' '}
                <span className="text-slate-600">{log.details}</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono shrink-0">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
