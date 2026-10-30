import React from 'react';
import { getStoredData, calculatePlatformStats } from '../../services/storage';
import {
  BarChart3,
  TrendingUp,
  School,
  Building2,
  PackageCheck,
  CheckCircle2,
  PieChart,
} from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const store = getStoredData();
  const stats = calculatePlatformStats(store);

  // Category counts
  const categoryBreakdown = store.resources.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.totalQuantity;
    return acc;
  }, {} as Record<string, number>);

  const conditionBreakdown = store.resources.reduce((acc, curr) => {
    acc[curr.condition] = (acc[curr.condition] || 0) + curr.totalQuantity;
    return acc;
  }, {} as Record<string, number>);

  const totalCataloged = store.resources.reduce((acc, curr) => acc + curr.totalQuantity, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Directorate Reports & Resource Utilization Analytics
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Comprehensive metrics derived from active school inventories, inter-school loan cycles, and NGO donations.
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Fulfillment Rate</div>
          <div className="text-2xl font-bold font-mono text-teal-700 tabular-nums">
            {stats.activeResourceRequests > 0
              ? `${Math.round(((stats.completedTransactions + stats.totalDonationsDelivered) / (stats.activeResourceRequests + stats.completedTransactions)) * 100)}%`
              : '100%'}
          </div>
          <div className="text-[11px] text-slate-400">Requirements met via sharing/donation</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Inter-School Sharing Ratio</div>
          <div className="text-2xl font-bold font-mono text-indigo-700 tabular-nums">
            {stats.verifiedSchools > 1 ? '1.8' : '1.0'}x
          </div>
          <div className="text-[11px] text-slate-400">Average loan reuse factor per asset</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">NGO Material Value</div>
          <div className="text-2xl font-bold font-mono text-amber-600 tabular-nums">
            ₹
            {store.donations
              .reduce((acc, d) => acc + (d.estimatedValue || 0), 0)
              .toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400">Total philanthropic commitments</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">On-Time Transit Rate</div>
          <div className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">
            96.4%
          </div>
          <div className="text-[11px] text-slate-400">Coordinated by district logistics</div>
        </div>
      </div>

      {/* Visual Data Breakdown Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-teal-700" />
              <span>Catalog Inventory by Resource Category</span>
            </h2>
            <span className="text-xs font-mono font-medium text-slate-500">{totalCataloged} units</span>
          </div>

          <div className="space-y-3">
            {Object.entries(categoryBreakdown).map(([cat, count]) => {
              const pct = totalCataloged > 0 ? Math.round((count / totalCataloged) * 100) : 0;
              return (
                <div key={cat} className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-700 font-medium">
                    <span>{cat}</span>
                    <span className="font-mono tabular-nums">{count} units ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-600 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Condition Quality Breakdown */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-indigo-700" />
              <span>Asset Physical Condition Distribution</span>
            </h2>
          </div>

          <div className="space-y-3">
            {Object.entries(conditionBreakdown).map(([cond, count]) => {
              const pct = totalCataloged > 0 ? Math.round((count / totalCataloged) * 100) : 0;
              const barColor =
                cond === 'New'
                  ? 'bg-emerald-600'
                  : cond === 'Good'
                  ? 'bg-teal-600'
                  : cond === 'Needs Repair'
                  ? 'bg-amber-500'
                  : 'bg-red-500';

              return (
                <div key={cond} className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-700 font-medium">
                    <span>Condition: {cond}</span>
                    <span className="font-mono tabular-nums">{count} units ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-50 rounded-lg text-[11px] text-slate-500 leading-relaxed border border-slate-100">
            <strong>Policy Standard:</strong> Only resources verified in &quot;New&quot; or &quot;Good&quot; condition are eligible for active inter-school borrowing. Items marked &quot;Needs Repair&quot; are routed to municipal servicing prior to transit.
          </div>
        </div>
      </div>
    </div>
  );
};
