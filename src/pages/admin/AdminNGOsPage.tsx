import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { NGOProfile, UserStatus } from '../../types';
import {
  Search,
  Check,
  X,
  AlertTriangle,
  Eye,
  Building2,
  CheckCircle2,
  Clock,
  Ban,
  RotateCw,
  Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminNGOsPage: React.FC = () => {
  const { store, updateNGO, deleteNGO } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedNGO, setSelectedNGO] = useState<NGOProfile | null>(null);

  const [actionModal, setActionModal] = useState<{
    type: 'reject' | 'suspend' | null;
    ngo: NGOProfile | null;
  }>({ type: null, ngo: null });
  const [actionReason, setActionReason] = useState('');

  const filteredNGOs = store.ngos.filter((ngo) => {
    const matchesSearch =
      ngo.ngoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ngo.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ngo.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ngo.authorizedRepresentative.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ? true : ngo.verificationStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleApprove = (ngoId: string) => {
    updateNGO(ngoId, {
      verificationStatus: 'approved',
      rejectionReason: undefined,
      suspensionReason: undefined,
    });
    if (selectedNGO?.id === ngoId) {
      setSelectedNGO({ ...selectedNGO, verificationStatus: 'approved' });
    }
  };

  const handleReactivate = (ngoId: string) => {
    handleApprove(ngoId);
  };

  const handleConfirmActionWithReason = () => {
    if (!actionModal.ngo || !actionModal.type) return;
    const ngoId = actionModal.ngo.id;
    const isReject = actionModal.type === 'reject';
    const newStatus: UserStatus = isReject ? 'rejected' : 'suspended';

    updateNGO(ngoId, {
      verificationStatus: newStatus,
      rejectionReason: isReject ? actionReason : actionModal.ngo.rejectionReason,
      suspensionReason: !isReject ? actionReason : actionModal.ngo.suspensionReason,
    });

    setActionModal({ type: null, ngo: null });
    setActionReason('');
    if (selectedNGO?.id === ngoId) {
      setSelectedNGO({ ...selectedNGO, verificationStatus: newStatus });
    }
  };

  const handleDeleteNGO = (ngoId: string, ngoName: string) => {
    if (window.confirm(`Admin: Remove ${ngoName} and its user credentials?`)) {
      deleteNGO(ngoId);
      if (selectedNGO?.id === ngoId) setSelectedNGO(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            NGO & Philanthropic Partner Registry
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verify non-profit credentials, evaluate supported categories, and maintain donor accountability.
          </p>
        </div>

        <div className="text-xs text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
          Showing <span className="font-bold text-slate-900">{filteredNGOs.length}</span> of {store.ngos.length} NGOs
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by NGO name, registration number, representative, or district..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-1 focus:ring-teal-700 bg-white text-slate-900"
          />
        </div>

        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'approved', 'pending', 'suspended'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors capitalize ${
                statusFilter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'all' ? 'All NGOs' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Organization Name</th>
                <th className="py-3 px-4">Reg Number</th>
                <th className="py-3 px-4">Representative</th>
                <th className="py-3 px-4">Focus Sectors</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredNGOs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    No NGOs match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredNGOs.map((n) => (
                  <tr key={n.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{n.ngoName}</div>
                      <div className="text-[11px] text-slate-500">
                        {n.district}, {n.state}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                      {n.registrationNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div>{n.authorizedRepresentative}</div>
                      <div className="text-[11px] text-slate-500">{n.phone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="truncate max-w-[200px]" title={n.areasOfSupport.join(', ')}>
                        {n.areasOfSupport.join(', ')}
                      </div>
                      <div className="text-[11px] text-teal-700 font-medium">
                        {n.resourceCategoriesSupported.length} resource categories
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold capitalize ${
                          n.verificationStatus === 'approved'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : n.verificationStatus === 'pending'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                      >
                        {n.verificationStatus === 'approved' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {n.verificationStatus === 'pending' && <Clock className="w-3 h-3 text-amber-600" />}
                        {n.verificationStatus === 'suspended' && <Ban className="w-3 h-3 text-red-600" />}
                        <span>{n.verificationStatus}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedNGO(n)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {n.verificationStatus === 'pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApprove(n.id)}
                              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setActionModal({ type: 'reject', ngo: n })}
                              className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded text-xs font-medium"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {n.verificationStatus === 'approved' && (
                          <button
                            type="button"
                            onClick={() => setActionModal({ type: 'suspend', ngo: n })}
                            className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-xs font-medium"
                          >
                            Suspend
                          </button>
                        )}

                        {n.verificationStatus === 'suspended' && (
                          <button
                            type="button"
                            onClick={() => handleReactivate(n.id)}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold flex items-center gap-1"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                            <span>Reactivate</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedNGO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 text-slate-800 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">{selectedNGO.ngoName}</h3>
                <p className="text-xs text-slate-500 font-mono">Reg #{selectedNGO.registrationNumber}</p>
              </div>
              <button onClick={() => setSelectedNGO(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <div className="text-slate-400 font-medium">Representative</div>
                <div className="font-bold text-slate-800 mt-0.5">{selectedNGO.authorizedRepresentative}</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <div className="text-slate-400 font-medium">Official Contact</div>
                <div className="font-bold text-slate-800 mt-0.5">{selectedNGO.phone}</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg col-span-2">
                <div className="text-slate-400 font-medium">Email Address</div>
                <div className="font-bold text-slate-800 mt-0.5">{selectedNGO.email}</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg col-span-2">
                <div className="text-slate-400 font-medium">Registered Office</div>
                <div className="font-medium text-slate-800 mt-0.5">{selectedNGO.address}</div>
                <div className="text-slate-500 text-[11px]">{selectedNGO.district}, {selectedNGO.state}</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg col-span-2">
                <div className="text-slate-400 font-medium">Focus Areas</div>
                <div className="font-medium text-slate-800 mt-0.5">{selectedNGO.areasOfSupport.join(' · ')}</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg col-span-2">
                <div className="text-slate-400 font-medium">Resource Categories Supported</div>
                <div className="font-medium text-teal-800 mt-0.5">{selectedNGO.resourceCategoriesSupported.join(' · ')}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedNGO(null)}
                className="py-1.5 px-4 bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action modal */}
      {actionModal.type && actionModal.ngo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-slate-800 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 text-red-700 rounded-lg shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  {actionModal.type === 'reject' ? 'Reject NGO Application' : 'Suspend NGO Partner Account'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Organization: <strong>{actionModal.ngo.ngoName}</strong>
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reason for {actionModal.type === 'reject' ? 'Rejection' : 'Suspension'} *
              </label>
              <textarea
                rows={3}
                required
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="State regulatory non-compliance, unverified trust deed, or duplicate..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-1 focus:ring-red-600"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setActionModal({ type: null, ngo: null });
                  setActionReason('');
                }}
                className="py-1.5 px-3 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmActionWithReason}
                className="py-1.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold"
              >
                Confirm {actionModal.type === 'reject' ? 'Rejection' : 'Suspension'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
