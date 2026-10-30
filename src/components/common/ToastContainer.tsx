import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`pointer-events-auto p-3.5 rounded-xl border shadow-lg flex items-start gap-3 backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-white/95 border-emerald-300 text-slate-800'
                : toast.type === 'error'
                ? 'bg-white/95 border-red-300 text-slate-800'
                : 'bg-white/95 border-teal-300 text-slate-800'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-600" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-teal-600" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-900">{toast.title}</div>
              {toast.message && (
                <div className="text-[11px] text-slate-600 mt-0.5 leading-snug">{toast.message}</div>
              )}
            </div>

            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
