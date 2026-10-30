import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ResourceRequirement, ResourceItem } from '../../types';
import {
  PackageCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Boxes,
  ArrowRight,
  X,
  AlertCircle,
  Building,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminRequestsPage: React.FC = () => {
  const { store, deleteRequirement, showToast } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [matchingModalRequirement, setMatchingModalRequirement] = useState<ResourceRequirement | null>(null);

  const filteredRequirements = store.requirements.filter((req) => {
    const matchesSearch =
      req.resourceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.district.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' ? true : req.category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' ? true : req.priority === priorityFilter;

    return matchesSearch && matchesCategory && matchesPriority;
  });

  // Calculate matching available surplus resources from other schools
  const getMatchingResources = (req: ResourceRequirement): ResourceItem[] => {
    return store.resources.filter(
      (res) =>
        res.category === req.category &&
        res.providerSchoolId !== req.schoolId &&
        res.availableQuantity > 0 &&
        res.condition !== 'Damaged' &&
        res.condition !== 'Needs Repair'
    );
  };

  const handleDeleteRequirement = (id: string, name: string) => {
    if (window.confirm(`Admin: Remove requirement listing "${name}"?`)) {
      deleteRequirement(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-indigo-600" />
            School Resource Requirements Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor educational requirements published by government schools and identify surplus matching potential.
          </p>
        </div>

        <div className="text-xs text-slate-600 bg-white px-3.5 py-2 rounded-lg border border-slate-200 shadow-xs flex items-center gap-2">
          <span>Active Requirements:</span>
          <span className="font-bold text-slate-900">{store.requirements.length} postings</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by required asset, requesting school, or district..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-indigo-600 bg-white text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 outline-hidden focus:ring-2 focus:ring-indigo-600"
          >
            <option value="all">All Categories</option>
            <option value="Computers and IT">Computers & IT</option>
            <option value="Furniture">Furniture</option>
            <option value="Educational Materials">Books & Library</option>
            <option value="Laboratory Equipment">Science Lab</option>
            <option value="Sports Equipment">Sports Goods</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 outline-hidden focus:ring-2 focus:ring-indigo-600"
          >
            <option value="all">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Requirements List */}
      <div className="space-y-4">
        {filteredRequirements.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500 bg-white rounded-xl border border-dashed border-slate-300 space-y-3">
            <Boxes className="w-9 h-9 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700 text-sm">No requirement postings match your filters.</p>
            <p className="text-slate-400">Schools will list requirements as academic needs arise.</p>
          </div>
        ) : (
          filteredRequirements.map((req) => {
            const matches = getMatchingResources(req);
            return (
              <motion.div
                key={req.id}
                whileHover={{ y: -2, transition: { duration: 0.15 } }}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-slate-300 transition-all"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        req.priority === 'Urgent'
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : req.priority === 'High'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {req.priority} Priority
                    </span>
                    <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                      {req.category}
                    </span>
                    <span className="text-slate-400 text-xs">•</span>
                    <span className="text-xs text-slate-500 font-mono">
                      Needed by: {new Date(req.requiredByDate).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900">{req.resourceName}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2">{req.description}</p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1 text-slate-700 font-medium">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {req.schoolName} ({req.district}, {req.state})
                    </span>
                    <span>
                      Quantity Needed:{' '}
                      <strong className="font-mono text-slate-900">{req.quantityRequired} units</strong>
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 border-t lg:border-t-0 pt-3 lg:pt-0 shrink-0">
                  <button
                    type="button"
                    onClick={() => setMatchingModalRequirement(req)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors ${
                      matches.length > 0
                        ? 'bg-teal-700 hover:bg-teal-800 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{matches.length} Surplus Match{matches.length === 1 ? '' : 'es'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteRequirement(req.id, req.resourceName)}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    title="Remove requirement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Match Modal */}
      <AnimatePresence>
        {matchingModalRequirement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 text-slate-800 space-y-4 max-h-[85vh] overflow-y-auto border border-slate-200"
            >
              <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Surplus Matches for {matchingModalRequirement.resourceName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Requested by: <strong>{matchingModalRequirement.schoolName}</strong> ({matchingModalRequirement.quantityRequired} units needed)
                  </p>
                </div>
                <button
                  onClick={() => setMatchingModalRequirement(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {getMatchingResources(matchingModalRequirement).length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
                    No neighboring schools currently have surplus in &quot;{matchingModalRequirement.category}&quot;. Recommended next action: Facilitate NGO donation commitment.
                  </div>
                ) : (
                  getMatchingResources(matchingModalRequirement).map((res) => (
                    <div
                      key={res.id}
                      className="p-4 rounded-xl border border-slate-200 hover:border-teal-500 transition-colors bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-xs text-slate-900">{res.name}</div>
                        <div className="text-[11px] text-slate-600">
                          Available at: <strong>{res.providerSchoolName}</strong> ({res.providerDistrict})
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Condition: <span className="font-medium text-emerald-700">{res.condition}</span> · Surplus Available: <span className="font-mono font-bold text-slate-800">{res.availableQuantity} units</span>
                        </div>
                        {res.lendingNotes && (
                          <div className="text-[11px] text-slate-500 italic mt-0.5">
                            Note: {res.lendingNotes}
                          </div>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs font-semibold">
                          Ready for Inter-School Loan
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setMatchingModalRequirement(null)}
                  className="py-1.5 px-4 bg-slate-900 text-white rounded-lg text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
