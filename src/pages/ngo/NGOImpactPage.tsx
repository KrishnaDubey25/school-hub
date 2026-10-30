import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStoredData } from '../../services/storage';
import { BarChart3, HeartHandshake, School, Users, CheckCircle2, Award } from 'lucide-react';

export const NGOImpactPage: React.FC = () => {
  const { currentNGO, currentUser } = useAuth();
  const store = getStoredData();
  const ngoId = currentNGO?.id || currentUser?.ngoId || '';

  const myDonations = store.donations.filter((d) => d.ngoId === ngoId);
  const delivered = myDonations.filter((d) => d.status === 'Delivered & Confirmed');

  const supportedSchoolIds = Array.from(new Set(myDonations.map((d) => d.targetSchoolId)));
  const supportedSchools = store.schools.filter((s) => supportedSchoolIds.includes(s.id));
  const estimatedStudentsReached = supportedSchools.reduce((acc, s) => acc + (s.studentCount || 0), 0);

  const totalValue = myDonations.reduce((acc, d) => acc + (d.estimatedValue || 0), 0);
  const totalUnits = myDonations.reduce((acc, d) => acc + d.quantityOffered, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Philanthropic Impact & Beneficiary Metrics
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Verifiable data reflecting educational equipment deployed to government schools and students reached.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Students Enrolled at Partner Schools</div>
          <div className="text-2xl font-bold font-mono text-amber-600 tabular-nums">
            {estimatedStudentsReached.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400">Direct & indirect beneficiaries</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Schools Supported</div>
          <div className="text-2xl font-bold font-mono text-teal-700 tabular-nums">
            {supportedSchools.length}
          </div>
          <div className="text-[11px] text-slate-400">Government campuses</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Total Material Units Donated</div>
          <div className="text-2xl font-bold font-mono text-indigo-700 tabular-nums">
            {totalUnits}
          </div>
          <div className="text-[11px] text-slate-400">Desks, lab kits, PCs & books</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Total CSR Value Deployed</div>
          <div className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">
            ₹{totalValue.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400">Educational infrastructure aid</div>
        </div>
      </div>

      {/* Supported Campuses List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <School className="w-4 h-4 text-teal-700" />
          <span>Government Schools Receiving Your Contributions</span>
        </h2>

        <div className="divide-y divide-slate-100">
          {supportedSchools.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No school donations recorded yet.
            </div>
          ) : (
            supportedSchools.map((s) => (
              <div key={s.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900">{s.schoolName}</div>
                  <div className="text-[11px] text-slate-500">
                    UDISE: {s.udiseCode} · {s.district}, {s.state} · Principal: {s.principalName}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs font-bold text-slate-800 tabular-nums">
                    {s.studentCount} students
                  </div>
                  <div className="text-[10px] text-emerald-700 font-medium">Active Partner</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
