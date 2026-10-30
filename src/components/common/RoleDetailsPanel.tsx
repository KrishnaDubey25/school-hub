import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  Shield,
  School,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Lock,
  Sparkles,
  Users,
  FileCheck,
  Truck,
  AlertCircle,
  KeyRound,
} from 'lucide-react';

export type RoleKey = 'admin' | 'school' | 'ngo';

interface RoleDetailsPanelProps {
  initialRole?: RoleKey;
  className?: string;
  isCompact?: boolean;
}

export const RoleDetailsPanel: React.FC<RoleDetailsPanelProps> = ({
  initialRole = 'school',
  className = '',
  isCompact = false,
}) => {
  const [selectedRole, setSelectedRole] = useState<RoleKey>(initialRole);
  const { loginAsRole, currentUser } = useAuth();
  const { stats, showToast } = useData();
  const navigate = useNavigate();

  const handleQuickLogin = (role: RoleKey) => {
    loginAsRole(role);
    showToast(`Switched active session to ${role.toUpperCase()} role`, 'info');
    if (role === 'admin') navigate('/admin');
    else if (role === 'school') navigate('/school');
    else if (role === 'ngo') navigate('/ngo');
  };

  const roleData = {
    admin: {
      id: 'admin',
      title: 'Central Administrator',
      subtitle: 'District Education Officer / Directorate',
      badge: 'Full Platform Authority',
      badgeColor: 'bg-slate-900 text-white border-slate-700',
      icon: Shield,
      accentBg: 'bg-slate-900',
      accentText: 'text-slate-900',
      lightBg: 'bg-slate-50',
      borderColor: 'border-slate-300',
      activeCount: '1 Nodal Officer Active',
      verificationMethod: 'State Directorate Credentials + 2FA Token',
      description:
        'Controls platform governance, reviews all institutional registrations, supervises borrowing loans, schedules inter-school logistics, and handles disputes.',
      keyResponsibilities: [
        'Review and approve/reject Government School registrations via UDISE+ database check',
        'Verify NGO credentials including 12A, 80G tax exemptions and Darpan ID',
        'Coordinate district logistics, assign dispatch coordinators, and monitor transit routes',
        'Audit inter-school loan agreements, overdue borrowings, and reported damages',
        'Inspect system-wide compliance logs and maintain tamper-evident audit trails',
      ],
      permissions: [
        { label: 'School & NGO Approval / Suspension', allowed: true },
        { label: 'Dispatch & Logistics Assignment', allowed: true },
        { label: 'Audit Logs & Platform Metrics', allowed: true },
        { label: 'Dispute Arbitration & Resolution', allowed: true },
        { label: 'Direct Password Access / Edit', allowed: false, note: 'Strictly prohibited' },
        { label: 'Direct Modification of School Inventory', allowed: false, note: 'School custody only' },
      ],
      sampleUser: 'District Central Administrator (Officer Rajesh Verma)',
      primaryActionText: 'Sign In as Administrator',
      registerRoute: '/login?role=admin',
    },
    school: {
      id: 'school',
      title: 'Government School',
      subtitle: 'Principal / Headmaster / Asset Custodian',
      badge: 'UDISE+ Accredited',
      badgeColor: 'bg-teal-700 text-white border-teal-800',
      icon: School,
      accentBg: 'bg-teal-700',
      accentText: 'text-teal-700',
      lightBg: 'bg-teal-50',
      borderColor: 'border-teal-300',
      activeCount: `${stats.verifiedSchools} Verified Schools`,
      verificationMethod: 'Official UDISE Code (11 Digits) + Headmaster Email',
      description:
        'Enables government primary, secondary, and senior secondary schools to catalog surplus resources, publish urgent requirements, borrow equipment, and receive donations.',
      keyResponsibilities: [
        'Add surplus resources (desks, computers, science kits, books) with live Camera API photos',
        'Submit prioritized requirements for student deficits and track matching district inventory',
        'Send borrowing requests to nearby schools with requested loan duration and purpose',
        'Approve or decline inbound borrowing requests from peer government schools',
        'Confirm physical pickup, receipt inspection, and scheduled asset return',
      ],
      permissions: [
        { label: 'Catalog Surplus Equipment with Photos', allowed: true },
        { label: 'Publish Student Resource Deficits', allowed: true },
        { label: 'Send & Receive Inter-School Loan Requests', allowed: true },
        { label: 'Accept Verified NGO Donations', allowed: true },
        { label: 'Confirm Handover & File Return Audit', allowed: true },
        { label: 'Access Private Profiles of Other Schools', allowed: false, note: 'Restricted' },
      ],
      sampleUser: 'Govt Model Sr. Sec. School (UDISE: 07010100101)',
      primaryActionText: 'Sign In as School Principal',
      registerRoute: '/register-school',
    },
    ngo: {
      id: 'ngo',
      title: 'Verified NGO / CSR Partner',
      subtitle: 'Philanthropic Foundations & Trusts',
      badge: '80G / CSR Registered',
      badgeColor: 'bg-amber-600 text-white border-amber-700',
      icon: HeartHandshake,
      accentBg: 'bg-amber-600',
      accentText: 'text-amber-600',
      lightBg: 'bg-amber-50',
      borderColor: 'border-amber-300',
      activeCount: `${stats.registeredNGOs} Philanthropic Partners`,
      verificationMethod: 'NITI Aayog Darpan ID + 12A/80G Certificate Verification',
      description:
        'Empowers verified non-profit organizations and CSR departments to discover real classroom shortages, commit in-kind donations, and track tangible student impact.',
      keyResponsibilities: [
        'Browse real-time verified school deficits categorized by urgent priority and district',
        'Pledge full or partial material donations (new computers, desks, laboratory kits)',
        'Track central admin dispatch approval and delivery verification milestones',
        'Receive official digital handover acknowledgment and tax deduction compliance certificates',
        'Review transparent student impact metrics across supported government classrooms',
      ],
      permissions: [
        { label: 'Browse Verified School Deficits by District', allowed: true },
        { label: 'Pledge Full or Partial Material Donations', allowed: true },
        { label: 'Track Dispatch & Receiving Confirmation', allowed: true },
        { label: 'Download Verified Impact Handover Proof', allowed: true },
        { label: 'Initiate Inter-School Borrowing Loans', allowed: false, note: 'Schools only' },
        { label: 'Modify School Equipment Records', allowed: false, note: 'Restricted' },
      ],
      sampleUser: 'Shiksha Foundation NGO (Darpan: DL/2021/029182)',
      primaryActionText: 'Sign In as NGO Partner',
      registerRoute: '/register-ngo',
    },
  };

  const activeRoleInfo = roleData[selectedRole];
  const IconComponent = activeRoleInfo.icon;

  return (
    <div
      className={`bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden flex flex-col transition-all duration-300 ${className}`}
    >
      {/* Panel Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white border-b border-slate-700/80">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                Role Details & Governance
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono font-medium">
                  3 Personas
                </span>
              </h2>
              <p className="text-[11px] text-slate-300">
                Multi-tier access boundaries & real-time switching
              </p>
            </div>
          </div>

          {currentUser && (
            <div className="text-[10px] px-2 py-1 bg-white/10 rounded-md border border-white/15 text-slate-200 font-mono">
              Active: <span className="font-bold text-teal-300 uppercase">{currentUser.role}</span>
            </div>
          )}
        </div>

        {/* 3 Role Selection Tabs */}
        <div className="grid grid-cols-3 gap-1.5 mt-4 p-1 bg-slate-950/60 rounded-xl border border-slate-700/60">
          {(['school', 'admin', 'ngo'] as RoleKey[]).map((r) => {
            const info = roleData[r];
            const isSelected = selectedRole === r;
            const TabIcon = info.icon;
            return (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRole(r)}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-md scale-[1.02]'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <TabIcon className={`w-3.5 h-3.5 ${isSelected ? info.accentText : 'text-slate-400'}`} />
                <span className="truncate">{info.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Role Details Body */}
      <div className="p-5 space-y-5 overflow-y-auto max-h-[580px] custom-scrollbar">
        {/* Active Role Highlight Card */}
        <div className={`p-4 rounded-xl border ${activeRoleInfo.borderColor} ${activeRoleInfo.lightBg} space-y-3`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-xl ${activeRoleInfo.accentBg} text-white flex items-center justify-center shadow-sm shrink-0`}
              >
                <IconComponent className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-slate-900">{activeRoleInfo.title}</h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${activeRoleInfo.badgeColor}`}
                  >
                    {activeRoleInfo.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">{activeRoleInfo.subtitle}</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">{activeRoleInfo.description}</p>

          <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-600">
            <span className="font-medium text-slate-500">Live Active Count:</span>
            <span className="font-bold text-slate-900 font-mono">{activeRoleInfo.activeCount}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-600">
            <span className="font-medium text-slate-500">Identity Verification:</span>
            <span className="font-semibold text-slate-800 text-right truncate max-w-[200px]">
              {activeRoleInfo.verificationMethod}
            </span>
          </div>
        </div>

        {/* Key Responsibilities */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-teal-700" />
              Core Responsibilities & Workflows
            </h4>
            <span className="text-[10px] text-slate-400 font-medium">Standard Operating Protocol</span>
          </div>

          <div className="space-y-1.5 bg-slate-50/70 p-3 rounded-xl border border-slate-200/80">
            {activeRoleInfo.keyResponsibilities.map((resp, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{resp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Permissions & Safeguards Matrix */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-700" />
            Security & Permission Boundaries
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {activeRoleInfo.permissions.map((perm, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg border text-xs flex items-center justify-between gap-1.5 ${
                  perm.allowed
                    ? 'bg-emerald-50/60 border-emerald-200 text-slate-800'
                    : 'bg-rose-50/60 border-rose-200 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  {perm.allowed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  )}
                  <span className="truncate text-[11px] font-medium">{perm.label}</span>
                </div>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0 ${
                    perm.allowed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {perm.allowed ? 'Allowed' : perm.note || 'No Access'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Verified Profile */}
        <div className="p-3 rounded-xl bg-slate-100/80 border border-slate-200 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <KeyRound className="w-4 h-4 text-slate-500 shrink-0" />
            <div className="truncate">
              <div className="text-[10px] text-slate-500 font-medium">Demo Verified Profile:</div>
              <div className="font-semibold text-slate-800 truncate">{activeRoleInfo.sampleUser}</div>
            </div>
          </div>
        </div>

        {/* 1-Click Role Switcher & Action Buttons */}
        <div className="pt-2 space-y-2">
          <button
            type="button"
            onClick={() => handleQuickLogin(selectedRole)}
            className={`w-full py-2.5 px-4 rounded-xl text-white font-semibold text-xs transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow cursor-pointer ${activeRoleInfo.accentBg}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-Click Switch: {activeRoleInfo.primaryActionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="grid grid-cols-2 gap-2 text-center">
            <button
              type="button"
              onClick={() => navigate(activeRoleInfo.registerRoute)}
              className="py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors"
            >
              Sign In / Register
            </button>
            <button
              type="button"
              onClick={() => {
                const nextRole: RoleKey =
                  selectedRole === 'school' ? 'admin' : selectedRole === 'admin' ? 'ngo' : 'school';
                setSelectedRole(nextRole);
              }}
              className="py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors"
            >
              Inspect Next Role →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
