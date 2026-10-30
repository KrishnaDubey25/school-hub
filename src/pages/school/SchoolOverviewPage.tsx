import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  Boxes,
  PackageCheck,
  Inbox,
  Send,
  ArrowLeftRight,
  Gift,
  Clock,
  RotateCcw,
  PlusCircle,
  Search,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { motion } from 'motion/react';

export const SchoolOverviewPage: React.FC = () => {
  const { currentSchool, currentUser } = useAuth();
  const { store } = useData();

  const schoolId = currentSchool?.id || currentUser?.schoolId || '';

  // School's specific metrics
  const myResources = store.resources.filter((r) => r.providerSchoolId === schoolId);
  const myRequirements = store.requirements.filter((r) => r.schoolId === schoolId);
  const incomingRequests = store.transactions.filter(
    (t) => t.lenderSchoolId === schoolId && t.status === 'Requested'
  );
  const outgoingRequests = store.transactions.filter(
    (t) => t.borrowerSchoolId === schoolId && t.status === 'Requested'
  );
  const activeBorrowed = store.transactions.filter(
    (t) =>
      t.borrowerSchoolId === schoolId &&
      (t.status === 'Received by Borrower' || t.status === 'In Transit' || t.status === 'Admin Coordinated')
  );
  const resourcesLent = store.transactions.filter(
    (t) =>
      t.lenderSchoolId === schoolId &&
      (t.status === 'Received by Borrower' || t.status === 'In Transit' || t.status === 'Admin Coordinated')
  );
  const pendingDonations = store.donations.filter(
    (d) => d.targetSchoolId === schoolId && d.status !== 'Delivered & Confirmed'
  );

  // Suggested matching resources for our open requirements from other schools
  const openRequirementCategories = myRequirements
    .filter((r) => r.status === 'Open' || r.status === 'Partially Met')
    .map((r) => r.category);

  const suggestedMatches = store.resources.filter(
    (r) =>
      openRequirementCategories.includes(r.category) &&
      r.providerSchoolId !== schoolId &&
      r.availableQuantity > 0 &&
      r.condition !== 'Damaged' &&
      r.condition !== 'Needs Repair'
  );

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {currentSchool?.schoolName || 'Government School Dashboard'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            UDISE: <span className="font-mono font-medium">{currentSchool?.udiseCode || 'N/A'}</span> · {currentSchool?.district}, {currentSchool?.state} · {currentSchool?.studentCount || 0} enrolled students
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/school/create-requirement"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create Requirement</span>
          </Link>
          <Link
            to="/school/add-resource"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Boxes className="w-3.5 h-3.5 text-teal-600" />
            <span>Add Surplus Asset</span>
          </Link>
        </div>
      </div>

      {/* 8 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Our Cataloged Surplus</span>
            <Boxes className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {myResources.reduce((acc, r) => acc + r.availableQuantity, 0)}
          </div>
          <div className="text-[11px] text-slate-400">{myResources.length} items listed</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Active Needs</span>
            <PackageCheck className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-teal-700 tabular-nums">
            {myRequirements.filter((r) => r.status === 'Open').length}
          </div>
          <div className="text-[11px] text-slate-400">Published requirements</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-amber-700 font-medium flex items-center justify-between">
            <span>Incoming Loan Requests</span>
            <Inbox className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600 tabular-nums">
            {incomingRequests.length}
          </div>
          <div className="text-[11px] text-slate-400">Schools asking for our surplus</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Outgoing Loan Requests</span>
            <Send className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-700 tabular-nums">
            {outgoingRequests.length}
          </div>
          <div className="text-[11px] text-slate-400">Pending lender review</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Currently Borrowed</span>
            <ArrowLeftRight className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {activeBorrowed.length}
          </div>
          <div className="text-[11px] text-slate-400">In use at our school</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Currently Lent</span>
            <ArrowLeftRight className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {resourcesLent.length}
          </div>
          <div className="text-[11px] text-slate-400">On loan to peer schools</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Pending Donations</span>
            <Gift className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-teal-800 tabular-nums">
            {pendingDonations.length}
          </div>
          <div className="text-[11px] text-slate-400">From verified NGOs</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Upcoming Returns</span>
            <RotateCcw className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600 tabular-nums">
            {activeBorrowed.filter((t) => t.returnDueDate).length}
          </div>
          <div className="text-[11px] text-slate-400">Within current semester</div>
        </div>
      </div>

      {/* Suggested Matching Resources Widget */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Search className="w-4 h-4 text-teal-700" />
              <span>Suggested Matching Resources from District Schools</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Available surplus at neighboring institutions that match your school&apos;s open requirements.
            </p>
          </div>
          <Link
            to="/school/find-resources"
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <span>Explore All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {suggestedMatches.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500">
            No direct surplus matches currently found for your school&apos;s open needs. You can browse all available items or create a new requirement.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestedMatches.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-teal-500 bg-slate-50/50 flex flex-col justify-between space-y-3 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-teal-700 uppercase">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {item.condition}
                    </span>
                  </div>
                  <h3 className="font-bold text-xs text-slate-900 mt-1">{item.name}</h3>
                  <div className="text-[11px] text-slate-600 mt-1">
                    At: <strong>{item.providerSchoolName}</strong> ({item.providerDistrict})
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Surplus Available: <span className="font-mono font-bold text-slate-800">{item.availableQuantity} units</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-end">
                  <Link
                    to={`/school/find-resources?focus=${item.id}`}
                    className="px-3 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <span>Request Borrow</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Two Column Grid: Incoming Requests & Active Return Dates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incoming requests */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Inbox className="w-4 h-4 text-amber-600" />
              <span>Incoming Lending Requests ({incomingRequests.length})</span>
            </h2>
            <Link to="/school/lending-requests" className="text-xs font-semibold text-teal-700 hover:underline">
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {incomingRequests.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No schools are currently requesting items from your surplus inventory.
              </div>
            ) : (
              incomingRequests.map((req) => (
                <div key={req.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-bold text-xs text-slate-900">{req.resourceName}</div>
                    <div className="text-[11px] text-slate-600">
                      Borrower: <strong>{req.borrowerSchoolName}</strong> ({req.borrowerDistrict})
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Quantity: <span className="font-mono font-bold">{req.quantity} units</span> · Return Due: {req.returnDueDate}
                    </div>
                  </div>
                  <Link
                    to="/school/lending-requests"
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
                  >
                    Respond
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Active Transactions & Return schedules */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Active Loans & Return Deadlines</span>
            </h2>
            <Link to="/school/active-transactions" className="text-xs font-semibold text-teal-700 hover:underline">
              View Details
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {activeBorrowed.length === 0 && resourcesLent.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No active loans currently in transit or in use.
              </div>
            ) : (
              [...activeBorrowed, ...resourcesLent].slice(0, 4).map((tx) => (
                <div key={tx.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-bold text-xs text-slate-900">{tx.resourceName}</div>
                    <div className="text-[11px] text-slate-600">
                      {tx.borrowerSchoolId === schoolId ? 'Borrowed from: ' + tx.lenderSchoolName : 'Lent to: ' + tx.borrowerSchoolName}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Due: <span className="font-mono font-semibold text-amber-700">{tx.returnDueDate}</span> · Status: {tx.status}
                    </div>
                  </div>
                  <Link
                    to="/school/active-transactions"
                    className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium"
                  >
                    Manifest
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
