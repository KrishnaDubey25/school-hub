import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Menu,
  X,
  ArrowRight,
  Shield,
  Building2,
  Heart,
  Landmark,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, loginAsRole } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardLink = () => {
    if (!currentUser) return '/login';
    if (currentUser.role === 'admin') return '/admin';
    if (currentUser.role === 'school') return '/school';
    if (currentUser.role === 'ngo') return '/ngo';
    return '/login';
  };

  return (
    <header className="sticky top-0 z-40 bg-black/65 backdrop-blur-md border-b border-white/10 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-20">
          
          {/* Brand Mark with Sovereign Seal & Typography */}
          <Link
            to="/"
            className="flex items-center gap-3.5 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/20 flex items-center justify-center text-amber-300/90 shadow-inner group-hover:border-amber-400/50 transition-all">
              <Landmark className="w-5 h-5 transition-transform group-hover:scale-105" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-amber-200 transition-colors leading-none">
                School Resource Hub
              </span>
              <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-400 uppercase mt-1">
                National Public Education Network
              </span>
            </div>
          </Link>

          {/* Quick Role Direct Access (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/60 border border-white/10 text-xs">
            <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase px-2">
              Fast Jump:
            </span>
            <button
              onClick={() => {
                loginAsRole('admin');
                navigate('/admin');
              }}
              className="px-3 py-1 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5 cursor-pointer font-medium"
            >
              <Shield className="w-3 h-3 text-blue-400" />
              <span>Admin</span>
            </button>
            <span className="text-zinc-600">/</span>
            <button
              onClick={() => {
                loginAsRole('school');
                navigate('/school');
              }}
              className="px-3 py-1 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5 cursor-pointer font-medium"
            >
              <Building2 className="w-3 h-3 text-emerald-400" />
              <span>School</span>
            </button>
            <span className="text-zinc-600">/</span>
            <button
              onClick={() => {
                loginAsRole('ngo');
                navigate('/ngo');
              }}
              className="px-3 py-1 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5 cursor-pointer font-medium"
            >
              <Heart className="w-3 h-3 text-amber-400" />
              <span>NGO</span>
            </button>
          </nav>

          {/* Right Action: Sign In or Dashboard */}
          <div className="hidden sm:flex items-center gap-3">
            {currentUser ? (
              <button
                onClick={() => navigate(getDashboardLink())}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-black bg-gradient-to-r from-amber-200 to-amber-300 hover:from-amber-300 hover:to-amber-400 rounded-lg transition-all shadow-[0_0_20px_rgba(251,191,36,0.2)] cursor-pointer"
              >
                <span>Dashboard ({currentUser.role})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
                >
                  Portal Sign In
                </Link>
                <Link
                  to="/register-school"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 border border-white/15 rounded-lg transition-all"
                >
                  <span>Register School</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-300 hover:text-white rounded-lg border border-white/10 bg-white/5"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-zinc-950/95 backdrop-blur-xl px-5 pt-4 pb-6 space-y-4">
          <div className="text-xs font-mono tracking-widest text-zinc-400 uppercase">
            Switch Portals:
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                loginAsRole('admin');
                setMobileMenuOpen(false);
                navigate('/admin');
              }}
              className="p-2.5 rounded-lg border border-blue-500/30 bg-blue-950/20 text-blue-200 text-xs font-medium flex flex-col items-center gap-1"
            >
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Admin</span>
            </button>
            <button
              onClick={() => {
                loginAsRole('school');
                setMobileMenuOpen(false);
                navigate('/school');
              }}
              className="p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-950/20 text-emerald-200 text-xs font-medium flex flex-col items-center gap-1"
            >
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>School</span>
            </button>
            <button
              onClick={() => {
                loginAsRole('ngo');
                setMobileMenuOpen(false);
                navigate('/ngo');
              }}
              className="p-2.5 rounded-lg border border-amber-500/30 bg-amber-950/20 text-amber-200 text-xs font-medium flex flex-col items-center gap-1"
            >
              <Heart className="w-4 h-4 text-amber-400" />
              <span>NGO</span>
            </button>
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <Link
              to="/school/find-resources"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-zinc-300 py-1.5"
            >
              Browse Surplus Catalog
            </Link>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-amber-300 py-1.5"
            >
              Portal Login Screen
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
