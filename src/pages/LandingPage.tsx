import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { DemoSwitcherBanner } from '../components/common/DemoSwitcherBanner';
import { CollageBackground } from '../components/common/CollageBackground';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  Shield,
  Building2,
  Heart,
  ArrowRight,
  Check,
  Sparkles,
  Layers,
  Repeat,
  Gift,
  FileText,
  Mail,
  ChevronRight,
  X,
  ExternalLink,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsRole } = useAuth();
  const { stats, showToast } = useData();

  // Hover state to illuminate corresponding background collage panel
  const [hoveredRole, setHoveredRole] = useState<'admin' | 'school' | 'ngo' | null>(null);

  // Quick modals for About & Compliance
  const [activeModal, setActiveModal] = useState<'about' | 'contact' | 'terms' | null>(null);

  const handleRoleSelect = (role: 'admin' | 'school' | 'ngo') => {
    loginAsRole(role);
    showToast(`Accessing ${role.toUpperCase()} Portal`, 'info');
    if (role === 'admin') navigate('/admin');
    else if (role === 'school') navigate('/school');
    else if (role === 'ngo') navigate('/ngo');
  };

  return (
    <div className="relative min-h-screen text-zinc-100 flex flex-col bg-black selection:bg-amber-400 selection:text-black">
      {/* 100% Sharp, Unblurred Triptych Collage Background */}
      <CollageBackground activeRoleHover={hoveredRole} />

      {/* Main Elevated Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <DemoSwitcherBanner />
        <Navbar />

        {/* HERO & THREE ROLES SHOWCASE */}
        <main className="flex-1 flex flex-col justify-between px-4 sm:px-6 lg:px-8 py-10 lg:py-14 max-w-7xl mx-auto w-full">
          
          {/* Presidential Editorial Header */}
          <div className="text-center max-w-4xl mx-auto space-y-4 mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-zinc-950/70 border border-white/15 text-xs font-mono tracking-widest text-zinc-300 uppercase shadow-xl backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>National Public Education Resource Grid</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] drop-shadow-2xl">
              Share Resources.{' '}
              <span className="italic font-normal bg-gradient-to-r from-amber-200 via-amber-300 to-amber-100 bg-clip-text text-transparent">
                Strengthen Schools.
              </span>
              <br />
              Empower Every Student.
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 font-normal max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              A sovereign collaborative network enabling government schools to share surplus educational assets, borrow specialized STEM laboratories, and receive verified NGO endowments.
            </p>
          </div>

          {/* THE THREE ROLES (MONOLITHIC EDITORIAL CARDS) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-14">
            
            {/* ROLE 1: CENTRAL ADMINISTRATOR */}
            <div
              onMouseEnter={() => setHoveredRole('admin')}
              onMouseLeave={() => setHoveredRole(null)}
              className="group relative rounded-2xl bg-zinc-950/80 border border-white/10 hover:border-blue-400/50 p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)] backdrop-blur-md"
            >
              <div className="space-y-5">
                {/* Header Tag & Embellishment */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-300 flex items-center justify-center transition-all group-hover:scale-110 group-hover:border-blue-400">
                    <Shield className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase px-2.5 py-1 rounded bg-white/5 border border-white/10">
                    ROLE 01 // DEO
                  </span>
                </div>

                <div>
                  <h2 className="font-display text-2xl font-bold text-white group-hover:text-blue-200 transition-colors">
                    Central Administrator
                  </h2>
                  <p className="text-xs font-mono text-blue-400 tracking-wide mt-1 uppercase">
                    District Education Directorate
                  </p>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                  Sovereign nodal control overseeing institutional UDISE verification, NGO accreditation audits, inter-school logistics dispatch, and platform arbitration.
                </p>

                {/* Capabilities list */}
                <div className="pt-3 border-t border-white/10 space-y-2.5 text-xs text-zinc-300">
                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 border border-blue-500/20">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Approve & audit school & NGO registrations</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 border border-blue-500/20">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Coordinate district pickup & delivery logistics</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 border border-blue-500/20">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Track inventory flows, disputes, and compliance</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => handleRoleSelect('admin')}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-900/60 to-blue-800/80 hover:from-blue-700 hover:to-blue-600 border border-blue-400/40 text-white font-medium text-xs tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer group-hover:border-blue-300"
                >
                  <span>Launch Admin Portal</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                <div className="text-[10px] text-center text-zinc-500 mt-2.5 font-mono">
                  Full Authority & Regulatory Oversight
                </div>
              </div>
            </div>

            {/* ROLE 2: GOVERNMENT SCHOOL (HERO PILLAR) */}
            <div
              onMouseEnter={() => setHoveredRole('school')}
              onMouseLeave={() => setHoveredRole(null)}
              className="group relative rounded-2xl bg-zinc-950/85 border-2 border-emerald-500/50 hover:border-emerald-400 p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_25px_60px_rgba(16,185,129,0.2)] backdrop-blur-md ring-1 ring-emerald-500/20"
            >
              {/* Sovereign Crown Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-mono text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest shadow-lg border border-emerald-300/40 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                <span>Primary Beneficiary</span>
              </div>

              <div className="space-y-5">
                {/* Header Tag */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-center justify-center transition-all group-hover:scale-110 group-hover:border-emerald-300">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-[10px] tracking-widest text-emerald-300 uppercase px-2.5 py-1 rounded bg-emerald-950/40 border border-emerald-700/50">
                    ROLE 02 // UDISE+
                  </span>
                </div>

                <div>
                  <h2 className="font-display text-2xl font-bold text-white group-hover:text-emerald-200 transition-colors">
                    Government School
                  </h2>
                  <p className="text-xs font-mono text-emerald-400 tracking-wide mt-1 uppercase">
                    Institutional Custodian & Principal
                  </p>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                  Schools publish surplus lab apparatus or computers for peer sharing, catalog urgent classroom deficits, and claim direct philanthropic endowments.
                </p>

                {/* Capabilities list */}
                <div className="pt-3 border-t border-white/10 space-y-2.5 text-xs text-zinc-300">
                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/20">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Offer surplus inventory for inter-school lending</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/20">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Submit & discover verified classroom deficits</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/20">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Confirm digital pickups, returns & donation receipts</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => handleRoleSelect('school')}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 cursor-pointer group-hover:scale-[1.02]"
                >
                  <span>Access School Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="text-[10px] text-center text-zinc-500 mt-2.5 font-mono">
                  Inventory Management & Peer Borrowing
                </div>
              </div>
            </div>

            {/* ROLE 3: VERIFIED NGO */}
            <div
              onMouseEnter={() => setHoveredRole('ngo')}
              onMouseLeave={() => setHoveredRole(null)}
              className="group relative rounded-2xl bg-zinc-950/80 border border-white/10 hover:border-amber-400/50 p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(245,158,11,0.15)] backdrop-blur-md"
            >
              <div className="space-y-5">
                {/* Header Tag */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 flex items-center justify-center transition-all group-hover:scale-110 group-hover:border-amber-400">
                    <Heart className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase px-2.5 py-1 rounded bg-white/5 border border-white/10">
                    ROLE 03 // CSR 80G
                  </span>
                </div>

                <div>
                  <h2 className="font-display text-2xl font-bold text-white group-hover:text-amber-200 transition-colors">
                    Verified NGO
                  </h2>
                  <p className="text-xs font-mono text-amber-400 tracking-wide mt-1 uppercase">
                    Philanthropic Foundation & CSR Partner
                  </p>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                  Foundations browse authentic, authenticated deficit lists across schools and donate brand-new hardware, books, and lab gear directly to classrooms.
                </p>

                {/* Capabilities list */}
                <div className="pt-3 border-t border-white/10 space-y-2.5 text-xs text-zinc-300">
                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/20">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Browse verified school requirements by district</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/20">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Pledge, dispatch, and track direct donation batches</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/20">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Receive instant digital institutional receipts</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => handleRoleSelect('ngo')}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-900/60 to-amber-800/80 hover:from-amber-700 hover:to-amber-600 border border-amber-400/40 text-white font-medium text-xs tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer group-hover:border-amber-300"
                >
                  <span>Open NGO Grant Portal</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                <div className="text-[10px] text-center text-zinc-500 mt-2.5 font-mono">
                  Direct Classroom Impact & Grant Records
                </div>
              </div>
            </div>

          </div>

          {/* THODA INFORMATION: MINIMALIST ESSENTIAL ARCHITECTURE BAR */}
          <div className="rounded-2xl bg-zinc-950/75 border border-white/10 p-6 sm:p-8 backdrop-blur-md mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-white/10">
              
              {/* Stat 1 */}
              <div className="px-3 pt-3 md:pt-0">
                <div className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                  Verified Institutions
                </div>
                <div className="font-display text-3xl sm:text-4xl font-bold text-white mt-1">
                  {stats.totalRegisteredSchools || 14}
                </div>
                <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  100% UDISE+ Nodal Audited
                </div>
              </div>

              {/* Stat 2 */}
              <div className="px-3 pt-3 md:pt-0">
                <div className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                  Available Equipment
                </div>
                <div className="font-display text-3xl sm:text-4xl font-bold text-white mt-1">
                  420+
                </div>
                <div className="text-xs text-zinc-400 mt-1">
                  Laptops, Desks, STEM & Lab Units
                </div>
              </div>

              {/* Stat 3 */}
              <div className="px-3 pt-3 md:pt-0">
                <div className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                  Completed Dispatches
                </div>
                <div className="font-display text-3xl sm:text-4xl font-bold text-white mt-1">
                  28
                </div>
                <div className="text-xs text-amber-400 mt-1 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Inter-School & NGO Deliveries
                </div>
              </div>

              {/* Stat 4 */}
              <div className="px-3 pt-3 md:pt-0">
                <div className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                  Active Vetted NGOs
                </div>
                <div className="font-display text-3xl sm:text-4xl font-bold text-white mt-1">
                  {stats.registeredNGOs || 6}
                </div>
                <div className="text-xs text-zinc-400 mt-1">
                  CSR Endowments & Book Drives
                </div>
              </div>

            </div>

            {/* 3-Step National Protocol Flow */}
            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 font-mono text-xs font-bold text-zinc-300 flex items-center justify-center shrink-0">
                  01
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Institutional Audit
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                    Schools index under-utilized apparatus and submit verified deficits directly to district servers.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 font-mono text-xs font-bold text-zinc-300 flex items-center justify-center shrink-0">
                  02
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Cluster Peer Sharing
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                    Nearby schools borrow lab equipment and extra furniture on a structured, zero-cost government loan.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 font-mono text-xs font-bold text-zinc-300 flex items-center justify-center shrink-0">
                  03
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Philanthropic Matching
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                    Vetted CSR trusts step in to permanently purchase and donate assets that cannot be shared locally.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </main>

        {/* REFINED FOOTER */}
        <footer className="border-t border-white/10 bg-black/80 py-6 text-xs text-zinc-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-display font-semibold text-zinc-200">School Resource Hub</span>
              <span>— Centralized Government School Asset Management</span>
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={() => setActiveModal('about')}
                className="hover:text-zinc-200 transition-colors cursor-pointer"
              >
                Operational Charter
              </button>
              <button
                onClick={() => setActiveModal('contact')}
                className="hover:text-zinc-200 transition-colors cursor-pointer"
              >
                District Nodal Office
              </button>
              <button
                onClick={() => setActiveModal('terms')}
                className="hover:text-zinc-200 transition-colors cursor-pointer"
              >
                Resource Security Rules
              </button>
            </div>
          </div>
        </footer>

      </div>

      {/* LUXURY EDITORIAL MODALS */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-zinc-950 border border-white/15 rounded-2xl max-w-xl w-full p-7 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg border border-white/10 hover:border-white/20"
            >
              <X className="w-5 h-5" />
            </button>

            {activeModal === 'about' && (
              <>
                <div className="font-mono text-[10px] text-amber-400 tracking-widest uppercase">
                  National Protocol Charter
                </div>
                <h3 className="font-display text-2xl font-bold text-white">
                  About School Resource Hub
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  School Resource Hub eliminates wasteful parallel public procurement by creating a unified district pool. Excess computers, laboratory equipment, library sets, and desks are audited, mapped, and dynamically routed between government institutions before taxpayer capital is expended on new purchases.
                </p>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300 space-y-2">
                  <div className="font-semibold text-white">Guiding Operational Principles:</div>
                  <ul className="list-disc list-inside space-y-1 text-zinc-400">
                    <li>Zero bureaucratic friction for inter-school borrowing</li>
                    <li>Transparent delivery tracking with geo-stamped receipts</li>
                    <li>Direct donor-to-school NGO channel with 80G documentation</li>
                  </ul>
                </div>
              </>
            )}

            {activeModal === 'contact' && (
              <>
                <div className="font-mono text-[10px] text-blue-400 tracking-widest uppercase">
                  District Secretariat
                </div>
                <h3 className="font-display text-2xl font-bold text-white">
                  District Nodal Coordination Office
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  The Central Administration is operated through the District Education Officer's (DEO) Secretariat for Education and Logistics Coordination.
                </p>
                <div className="space-y-2.5 text-xs text-zinc-300 font-mono">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-zinc-500">SECRETARIAT:</span> DEO Education Complex, Civil Lines, Nodal Center
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-zinc-500">DISPATCH HELPLINE:</span> +91 (011) 2389-4401 (Mon-Sat, 9AM-5PM)
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-zinc-500">UDISE+ INQUIRIES:</span> nodal.officer@eduhub.gov.in
                  </div>
                </div>
              </>
            )}

            {activeModal === 'terms' && (
              <>
                <div className="font-mono text-[10px] text-emerald-400 tracking-widest uppercase">
                  Statutory Rules
                </div>
                <h3 className="font-display text-2xl font-bold text-white">
                  Resource Care & Custody Rules
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  All borrowed equipment remains the statutory property of the lending institution. The borrowing school principal assumes institutional responsibility for proper operation, routine maintenance, and prompt return at the expiry of the loan window.
                </p>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300 space-y-1.5">
                  <div>1. Damage or missing items must be reported within 24 hours via the portal.</div>
                  <div>2. NGO donations become permanent non-transferable school property.</div>
                  <div>3. All physical movements require a system-generated Dispatch Slip.</div>
                </div>
              </>
            )}

            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-semibold text-black bg-white hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer"
              >
                Dismiss Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
