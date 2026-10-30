import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { SchoolProfile, UserStatus } from '../../types';
import {
  Search,
  Filter,
  Check,
  X,
  AlertTriangle,
  Eye,
  School,
  Building,
  CheckCircle2,
  Clock,
  Ban,
  RotateCw,
  Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminSchoolsPage: React.FC = () => {
  const { store, updateSchool, deleteSchool } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSchool, setSelectedSchool] = useState<SchoolProfile | null>(null);

  // Modal states for action with reason
  const [actionModal, setActionModal] = useState<{
    type: 'reject' | 'suspend' | null;
    school: SchoolProfile | null;
  }>({ type: null, school: null });
  const [actionReason, setActionReason] = useState('');

  const filteredSchools = store.schools.filter((school) => {
    const matchesSearch =
      school.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.udiseCode.includes(searchTerm) ||
      school.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.principalName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ? true : school.verificationStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleApprove = (schoolId: string) => {
    updateSchool(schoolId, {
      verificationStatus: 'approved',
      rejectionReason: undefined,
      suspensionReason: undefined,
    });
    if (selectedSchool?.id === schoolId) {
      setSelectedSchool({ ...selectedSchool, verificationStatus: 'approved' });
    }
  };

  const handleReactivate = (schoolId: string) => {
    handleApprove(schoolId);
  };

  const handleConfirmActionWithReason = () => {
    if (!actionModal.school || !actionModal.type) return;
    const schoolId = actionModal.school.id;
    const isReject = actionModal.type === 'reject';
    const newStatus: UserStatus = isReject ? 'rejected' : 'suspended';

    updateSchool(schoolId, {
      verificationStatus: newStatus,
      rejectionReason: isReject ? actionReason : actionModal.school.rejectionReason,
      suspensionReason: !isReject ? actionReason : actionModal.school.suspensionReason,
    });

    setActionModal({ type: null, school: null });
    setActionReason('');
    if (selectedSchool?.id === schoolId) {
      setSelectedSchool({ ...selectedSchool, verificationStatus: newStatus });
    }
  };

  const handleDeleteSchool = (schoolId: string, schoolName: string) => {
    if (window.confirm(`Admin: Remove ${schoolName} and its user credentials?`)) {
      deleteSchool(schoolId);
      if (selectedSchool?.id === schoolId) setSelectedSchool(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Government School Registry & Audit
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit UDISE+ institution credentials, grant portal access, and oversee school participation.
          </p>
        </div>

        {/* Quick count */}
        <div className="text-xs text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
          Showing <span className="font-bold text-slate-900">{filteredSchools.length}</span> of {store.schools.length} schools
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
            placeholder="Search by school name, UDISE code, principal, or district..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-1 focus:ring-teal-700 bg-white text-slate-900"
          />
        </div>

        {/* Status segmented filters */}
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
              {st === 'all' ? 'All Schools' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Schools Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">School Details</th>
                <th className="py-3 px-4">UDISE Code</th>
                <th className="py-3 px-4">District / State</th>
                <th className="py-3 px-4">Type & Enrollment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSchools.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    No schools match your search query.
                  </td>
                </tr>
              ) : (
                filteredSchools.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{s.schoolName}</div>
                      <div className="text-[11px] text-slate-500">
                        Principal: {s.principalName} · {s.phone}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                      {s.udiseCode}
                    </td>
                    <td className="py-3.5 px-4">
                      <div>{s.district}</div>
                      <div className="text-[11px] text-slate-500">{s.state}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div>{s.schoolType}</div>
                      <div className="text-[11px] font-mono text-slate-500 tabular-nums">
                        {s.studentCount} students
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold capitalize ${
                          s.verificationStatus === 'approved'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : s.verificationStatus === 'pending'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                      >
                        {s.verificationStatus === 'approved' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {s.verificationStatus === 'pending' && <Clock className="w-3 h-3 text-amber-600" />}
                        {s.verificationStatus === 'suspended' && <Ban className="w-3 h-3 text-red-600" />}
                        <span>{s.verificationStatus}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedSchool(s)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                          title="View Profile Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {s.verificationStatus === 'pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApprove(s.id)}
                              className="px-2.5 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded text-xs font-semibold flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setActionModal({ type: 'reject', school: s })}
                              className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded text-xs font-medium"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {s.verificationStatus === 'approved' && (
                          <button
                            type="button"
                            onClick={() => setActionModal({ type: 'suspend', school: s })}
                            className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-xs font-medium"
                          >
                            Suspend
                          </button>
                        )}

                        {s.verificationStatus === 'suspended' && (
                          <button
                            type="button"
                            onClick={() => handleReactivate(s.id)}
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

      {/* School Profile Inspection Modal */}
      {selectedSchool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-xl w-full p-6 text-slate-800 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">{selectedSchool.schoolName}</h3>
                <p className="text-xs text-slate-500">UDISE: {selectedSchool.udiseCode}</p>
              </div>
              <button onClick={() => setSelectedSchool(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedSchool.photoUrl && (
              <div className="aspect-16/9 rounded-lg overflow-hidden border border-slate-200">
                <img
                  src={selectedSchool.photoUrl}
                  alt={selectedSchool.schoolName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <div className="text-slate-400 font-medium">Principal</div>
                <div className="font-bold text-slate-800 mt-0.5">{selectedSchool.principalName}</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <div className="text-slate-400 font-medium">Contact Phone</div>
                <div className="font-bold text-slate-800 mt-0.5">{selectedSchool.phone}</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <div className="text-slate-400 font-medium">Official Email</div>
                <div className="font-bold text-slate-800 mt-0.5">{selectedSchool.email}</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <div className="text-slate-400 font-medium">Students Enrolled</div>
                <div className="font-bold text-slate-800 mt-0.5 font-mono tabular-nums">{selectedSchool.studentCount}</div>
              </div>
              <div className="col-span-2 p-2.5 bg-slate-50 rounded-lg">
                <div className="text-slate-400 font-medium">Campus Address</div>
                <div className="font-medium text-slate-800 mt-0.5">{selectedSchool.address}</div>
                <div className="text-slate-500 text-[11px]">{selectedSchool.cityOrTaluka}, {selectedSchool.district}, {selectedSchool.state}</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <div className="text-slate-400 font-medium">Registration Date</div>
                <div className="font-medium text-slate-800 mt-0.5 font-mono">{selectedSchool.registrationDate}</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <div className="text-slate-400 font-medium">Current Status</div>
                <div className="font-bold capitalize text-slate-800 mt-0.5">{selectedSchool.verificationStatus}</div>
              </div>
            </div>

            {selectedSchool.rejectionReason && (
              <div className="p-3 bg-red-50 text-red-800 rounded-lg text-xs">
                <strong>Rejection Reason:</strong> {selectedSchool.rejectionReason}
              </div>
            )}

            {selectedSchool.suspensionReason && (
              <div className="p-3 bg-red-50 text-red-800 rounded-lg text-xs">
                <strong>Suspension Notice:</strong> {selectedSchool.suspensionReason}
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex justify-between items-center gap-2">
              <button
                type="button"
                onClick={() => handleDeleteSchool(selectedSchool.id, selectedSchool.schoolName)}
                className="py-1.5 px-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete School Record</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedSchool(null)}
                className="py-1.5 px-4 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action with Reason Dialog (Reject or Suspend) */}
      {actionModal.type && actionModal.school && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-slate-800 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 text-red-700 rounded-lg shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  {actionModal.type === 'reject' ? 'Reject School Application' : 'Suspend School Account'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Institution: <strong>{actionModal.school.schoolName}</strong> ({actionModal.school.udiseCode})
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
                placeholder="e.g. Invalid UDISE code format, duplicate application, or non-compliance..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-1 focus:ring-red-600"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setActionModal({ type: null, school: null });
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
