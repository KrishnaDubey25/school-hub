import React, { useState } from 'react';
import { getStoredData, saveStoredData, logActivity } from '../../services/storage';
import { ComplaintDispute } from '../../types';
import {
  AlertTriangle,
  Search,
  CheckCircle2,
  Clock,
  MessageSquare,
  X,
  Check,
} from 'lucide-react';

export const AdminComplaintsPage: React.FC = () => {
  const [store, setStore] = useState(getStoredData());
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintDispute | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const handleResolve = (complaintId: string) => {
    const target = store.complaints.find((c) => c.id === complaintId);
    if (!target) return;

    const updated = {
      ...store,
      complaints: store.complaints.map((c) =>
        c.id === complaintId
          ? {
              ...c,
              status: 'Resolved' as const,
              resolutionNotes: resolutionNotes || 'Resolved following administrative review.',
            }
          : c
      ),
    };

    saveStoredData(updated);
    setStore(updated);
    logActivity('admin', 'Central Resource Officer', 'Dispute Resolved', `Resolved complaint #${target.id} submitted by ${target.reporterName}`);
    setSelectedComplaint(null);
    setResolutionNotes('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Complaints, Disputes & Damaged Asset Inquiries
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Resolve transit disputes, delay grievances, and damaged or missing equipment notices between schools.
          </p>
        </div>

        <div className="text-xs text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
          Open Inquiries: <span className="font-bold text-slate-900">{store.complaints.filter((c) => c.status !== 'Resolved').length}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {store.complaints.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No disputes or complaints reported on the platform.
            </div>
          ) : (
            store.complaints.map((comp) => (
              <div key={comp.id} className="p-5 hover:bg-slate-50/80 transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-amber-50 text-amber-700 rounded-md">
                      <AlertTriangle className="w-4 h-4" />
                    </span>
                    <span className="font-bold text-sm text-slate-900">{comp.title}</span>
                  </div>

                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold self-start sm:self-auto ${
                      comp.status === 'Resolved'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : comp.status === 'Investigating'
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {comp.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{comp.description}</p>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  <div>
                    Reported by: <strong>{comp.reporterName}</strong> ({comp.reporterRole}) · {new Date(comp.createdAt).toLocaleDateString()}
                  </div>

                  {comp.status !== 'Resolved' ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedComplaint(comp);
                        setResolutionNotes(comp.resolutionNotes || '');
                      }}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold"
                    >
                      Investigate & Resolve
                    </button>
                  ) : (
                    <div className="text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Resolution: {comp.resolutionNotes}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Resolution Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 text-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Resolve Complaint & Dispute</h3>
              <button onClick={() => setSelectedComplaint(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="font-semibold text-slate-900">{selectedComplaint.title}</div>
                <div className="text-slate-600 mt-1">{selectedComplaint.description}</div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Administrative Resolution Notes *
                </label>
                <textarea
                  rows={3}
                  required
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Detail logistics clarification, replacement arrangement, or mediation outcome..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-1 focus:ring-teal-700"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="py-1.5 px-3 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleResolve(selectedComplaint.id)}
                className="py-1.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark Dispute Resolved</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
