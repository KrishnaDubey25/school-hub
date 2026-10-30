import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  Shield,
  School,
  HeartHandshake,
  RotateCcw,
  ChevronDown,
  Check,
  Plus,
  Sparkles,
  Trash2,
  Database,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { QuickEntryModal } from './QuickEntryModal';

export const DemoSwitcherBanner: React.FC = () => {
  const { currentUser, switchUserById } = useAuth();
  const { store, isCleanMode, switchToBlankSlate, restoreSampleData, showToast } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const navigate = useNavigate();

  const handleSwitch = (userId: string, targetPath: string) => {
    switchUserById(userId);
    setIsOpen(false);
    navigate(targetPath);
  };

  const handleBlankSlateToggle = () => {
    if (isCleanMode) {
      if (window.confirm('Restore initial sample demo data (realistic schools, surplus inventory, and donation requests)?')) {
        restoreSampleData();
      }
    } else {
      if (
        window.confirm(
          'Wipe sample dummy data and switch to Clean / Real Data Mode? You will have a blank slate to input your own actual schools, resources, and requirements!'
        )
      ) {
        switchToBlankSlate();
      }
    }
  };

  return (
    <>
      <div className="bg-zinc-950/90 text-zinc-300 text-xs border-b border-white/10 relative z-30 shadow-md backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3">
          {/* Persona & Mode Badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-white tracking-wide flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-teal-400" />
              School Resource Hub:
            </span>

            {/* Mode Indicator Pill */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                isCleanMode
                  ? 'bg-emerald-950/70 border-emerald-700/60 text-emerald-300'
                  : 'bg-indigo-950/70 border-indigo-700/60 text-indigo-300'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isCleanMode ? 'bg-emerald-400 animate-pulse' : 'bg-indigo-400'
                }`}
              />
              {isCleanMode ? 'Real Data Mode (Blank Slate)' : 'Sample Demo Data'}
            </span>

            <span className="text-slate-500 hidden sm:inline">•</span>

            <span className="text-slate-400 hidden sm:inline">Active User:</span>
            <span className="font-mono text-teal-300 font-medium">
              {currentUser ? currentUser.name : 'Guest Visitor'}
            </span>
            {currentUser && (
              <span className="text-slate-400 capitalize text-[11px]">
                ({currentUser.role})
              </span>
            )}
          </div>

          {/* Quick Actions & Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Direct "+ Add Real Data" Quick Action Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => setIsQuickAddOpen(true)}
              className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-md text-xs font-semibold shadow-xs transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>+ Add Real Data</span>
            </motion.button>

            {/* Persona Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium border border-slate-700 transition-colors"
              >
                <span>Switch Role</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-1 w-76 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 py-2 z-50 overflow-hidden"
                  >
                    <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Central Administrator
                    </div>
                    {store.users
                      .filter((u) => u.role === 'admin')
                      .map((u) => (
                        <button
                          key={u.id}
                          onClick={() => handleSwitch(u.id, '/admin')}
                          className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between group transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-indigo-600" />
                            <div>
                              <div className="text-xs font-semibold text-slate-800">{u.name}</div>
                              <div className="text-[10px] text-slate-500">{u.email}</div>
                            </div>
                          </div>
                          {currentUser?.id === u.id && <Check className="w-4 h-4 text-teal-600" />}
                        </button>
                      ))}

                    <div className="my-1 border-t border-slate-100" />
                    <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Schools</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {store.users.filter((u) => u.role === 'school').length} registered
                      </span>
                    </div>
                    {store.users
                      .filter((u) => u.role === 'school')
                      .slice(0, 5)
                      .map((u) => (
                        <button
                          key={u.id}
                          onClick={() => handleSwitch(u.id, '/school')}
                          className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between group transition-colors"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <School className="w-4 h-4 text-teal-600 shrink-0" />
                            <div className="truncate">
                              <div className="text-xs font-medium text-slate-800 truncate">{u.name}</div>
                              <div className="text-[10px] text-slate-500">
                                Status: <span className="capitalize">{u.status}</span>
                              </div>
                            </div>
                          </div>
                          {currentUser?.id === u.id && <Check className="w-4 h-4 text-teal-600 shrink-0" />}
                        </button>
                      ))}

                    <div className="my-1 border-t border-slate-100" />
                    <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span>NGOs</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {store.users.filter((u) => u.role === 'ngo').length} registered
                      </span>
                    </div>
                    {store.users
                      .filter((u) => u.role === 'ngo')
                      .slice(0, 5)
                      .map((u) => (
                        <button
                          key={u.id}
                          onClick={() => handleSwitch(u.id, '/ngo')}
                          className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between group transition-colors"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <HeartHandshake className="w-4 h-4 text-amber-600 shrink-0" />
                            <div className="truncate">
                              <div className="text-xs font-medium text-slate-800 truncate">{u.name}</div>
                              <div className="text-[10px] text-slate-500">
                                Status: <span className="capitalize">{u.status}</span>
                              </div>
                            </div>
                          </div>
                          {currentUser?.id === u.id && <Check className="w-4 h-4 text-teal-600 shrink-0" />}
                        </button>
                      ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wipe dummy data / Restore toggle button */}
            <button
              type="button"
              onClick={handleBlankSlateToggle}
              title={
                isCleanMode
                  ? 'Switch back to preloaded realistic sample dataset'
                  : 'Clear all dummy inventory and requirements to input actual data'
              }
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors border ${
                isCleanMode
                  ? 'bg-emerald-950/80 hover:bg-emerald-900 border-emerald-700 text-emerald-200'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
              }`}
            >
              {isCleanMode ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Restore Sample Data</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Start Blank Slate (Real Data)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Global Quick Entry Modal */}
      <QuickEntryModal isOpen={isQuickAddOpen} onClose={() => setIsQuickAddOpen(false)} />
    </>
  );
};
