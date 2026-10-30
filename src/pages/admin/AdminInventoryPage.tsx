import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ResourceItem } from '../../types';
import {
  Boxes,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Eye,
  X,
  Laptop,
  Image as ImageIcon,
  Trash2,
  Package,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminInventoryPage: React.FC = () => {
  const { store, deleteResource, showToast } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [conditionFilter, setConditionFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<ResourceItem | null>(null);

  const filteredResources = store.resources.filter((res) => {
    const matchesSearch =
      res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.providerSchoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.providerDistrict.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' ? true : res.category === categoryFilter;
    const matchesCondition = conditionFilter === 'all' ? true : res.condition === conditionFilter;

    return matchesSearch && matchesCategory && matchesCondition;
  });

  const handleDelete = (resourceId: string, name: string) => {
    if (window.confirm(`Admin Action: Remove "${name}" from master inventory?`)) {
      const res = deleteResource(resourceId);
      if (!res.success) {
        showToast('Cannot Delete', res.error || 'Active loan cycle exists', 'error');
      } else {
        if (selectedItem?.id === resourceId) setSelectedItem(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-600" />
            Platform Master Resource Inventory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Centralized register of all cataloged equipment, lab kits, computers, and furniture across schools.
          </p>
        </div>

        <div className="text-xs text-slate-600 bg-white px-3.5 py-2 rounded-lg border border-slate-200 shadow-xs flex items-center gap-2">
          <span>Total Cataloged:</span>
          <span className="font-bold text-slate-900">{store.resources.length} items</span>
          <span className="text-slate-300">•</span>
          <span className="font-mono tabular-nums font-semibold text-teal-700">
            {store.resources.reduce((acc, r) => acc + r.totalQuantity, 0)} units
          </span>
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
            placeholder="Search resources, provider schools, specifications, or locations..."
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
            <option value="Smart Classroom Tools">Smart Classroom</option>
          </select>

          <select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 outline-hidden focus:ring-2 focus:ring-indigo-600"
          >
            <option value="all">All Conditions</option>
            <option value="New">New</option>
            <option value="Good">Good</option>
            <option value="Needs Repair">Needs Repair</option>
            <option value="Damaged">Damaged</option>
          </select>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredResources.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-slate-500 bg-white rounded-xl border border-dashed border-slate-300 space-y-3">
            <Boxes className="w-9 h-9 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700 text-sm">No resources match the selected criteria.</p>
            <p className="text-slate-400">Try adjusting your search terms or filters.</p>
          </div>
        ) : (
          filteredResources.map((res) => (
            <motion.div
              key={res.id}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all"
            >
              <div>
                <div className="aspect-16/9 bg-slate-100 relative overflow-hidden border-b border-slate-100">
                  {res.photograph ? (
                    <img
                      src={res.photograph}
                      alt={res.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                      <ImageIcon className="w-8 h-8 text-slate-300" />
                      <span className="text-[10px] mt-1 text-slate-400">No Image</span>
                    </div>
                  )}

                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold shadow-xs ${
                        res.condition === 'New'
                          ? 'bg-emerald-600 text-white'
                          : res.condition === 'Good'
                          ? 'bg-teal-700 text-white'
                          : res.condition === 'Needs Repair'
                          ? 'bg-amber-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}
                    >
                      {res.condition}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider">
                    {res.category}
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">{res.name}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {res.description || 'No description provided.'}
                  </p>

                  <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-100 space-y-1">
                    <div>
                      School: <strong>{res.providerSchoolName}</strong>
                    </div>
                    <div>
                      Location: {res.location} ({res.providerDistrict})
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs">
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    {res.availableQuantity}
                  </span>{' '}
                  <span className="text-slate-500">of {res.totalQuantity} available</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedItem(res)}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded text-xs font-semibold transition-colors"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(res.id, res.name)}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    title="Admin: delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 text-slate-800 space-y-4 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                <div>
                  <h3 className="font-bold text-base text-slate-900">{selectedItem.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">Item ID: {selectedItem.id}</p>
                </div>
                <button onClick={() => setSelectedItem(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedItem.photograph && (
                <div className="aspect-16/9 rounded-lg overflow-hidden border border-slate-200">
                  <img
                    src={selectedItem.photograph}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <div className="text-slate-400 font-medium">Category</div>
                  <div className="font-bold text-slate-800 mt-0.5">{selectedItem.category}</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <div className="text-slate-400 font-medium">Condition</div>
                  <div className="font-bold text-slate-800 mt-0.5">{selectedItem.condition}</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <div className="text-slate-400 font-medium">Total Quantity</div>
                  <div className="font-bold text-slate-800 mt-0.5 font-mono tabular-nums">{selectedItem.totalQuantity} units</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <div className="text-slate-400 font-medium">Available for Loan</div>
                  <div className="font-bold text-teal-800 mt-0.5 font-mono tabular-nums">{selectedItem.availableQuantity} units</div>
                </div>
                <div className="col-span-2 p-2.5 bg-slate-50 rounded-lg">
                  <div className="text-slate-400 font-medium">Provider School</div>
                  <div className="font-bold text-slate-800 mt-0.5">{selectedItem.providerSchoolName}</div>
                  <div className="text-slate-500 text-[11px]">{selectedItem.providerDistrict}, {selectedItem.providerState}</div>
                </div>
                <div className="col-span-2 p-2.5 bg-slate-50 rounded-lg">
                  <div className="text-slate-400 font-medium">Campus Location & Notes</div>
                  <div className="font-medium text-slate-800 mt-0.5">{selectedItem.location}</div>
                  {selectedItem.lendingNotes && (
                    <div className="text-slate-600 text-[11px] mt-1 italic">
                      Lending terms: {selectedItem.lendingNotes}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => handleDelete(selectedItem.id, selectedItem.name)}
                  className="py-1.5 px-3 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Listing</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
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
