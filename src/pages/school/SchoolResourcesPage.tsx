import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ResourceItem } from '../../types';
import {
  Boxes,
  PlusCircle,
  Search,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Edit2,
  X,
  Eye,
  Camera,
  Image as ImageIcon,
  Save,
  Check,
  Package,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SchoolResourcesPage: React.FC = () => {
  const { currentSchool, currentUser } = useAuth();
  const { store, updateResource, deleteResource, showToast } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<ResourceItem | null>(null);
  const [editingItem, setEditingItem] = useState<ResourceItem | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Form state for editing
  const [editForm, setEditForm] = useState({
    name: '',
    category: '',
    totalQuantity: 1,
    availableQuantity: 1,
    condition: 'Good' as ResourceItem['condition'],
    location: '',
    lendingAvailability: true,
    lendingNotes: '',
    description: '',
  });

  const schoolId = currentSchool?.id || currentUser?.schoolId || '';
  const myResources = store.resources.filter((r) => r.providerSchoolId === schoolId);

  const filteredResources = myResources.filter((r) => {
    return (
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleDeleteResource = (resourceId: string, resourceName: string) => {
    setDeleteError(null);
    if (window.confirm(`Are you sure you want to remove "${resourceName}" from your catalog?`)) {
      const res = deleteResource(resourceId);
      if (!res.success) {
        setDeleteError(res.error || 'Cannot delete resource.');
      }
    }
  };

  const handleToggleLending = (resourceId: string, currentVal: boolean) => {
    updateResource(resourceId, {
      lendingAvailability: !currentVal,
    });
  };

  const openEditModal = (item: ResourceItem) => {
    setEditingItem(item);
    setEditForm({
      name: item.name,
      category: item.category,
      totalQuantity: item.totalQuantity,
      availableQuantity: item.availableQuantity,
      condition: item.condition,
      location: item.location,
      lendingAvailability: item.lendingAvailability,
      lendingNotes: item.lendingNotes || '',
      description: item.description,
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!editForm.name.trim()) {
      showToast('Validation Error', 'Resource name is required', 'error');
      return;
    }

    updateResource(editingItem.id, {
      name: editForm.name.trim(),
      category: editForm.category as any,
      totalQuantity: Number(editForm.totalQuantity),
      availableQuantity: Math.min(Number(editForm.availableQuantity), Number(editForm.totalQuantity)),
      condition: editForm.condition,
      location: editForm.location.trim(),
      lendingAvailability: editForm.lendingAvailability,
      lendingNotes: editForm.lendingNotes.trim(),
      description: editForm.description.trim(),
    });

    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-teal-600" />
            Our School Surplus Inventory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage surplus educational equipment, computers, laboratory apparatus, and furniture cataloged by our school.
          </p>
        </div>

        <Link
          to="/school/add-resource"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Catalog New Resource</span>
        </Link>
      </div>

      {deleteError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{deleteError}</span>
          </div>
          <button onClick={() => setDeleteError(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search and Stats bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search our cataloged resources by title, category, or location..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-teal-700 bg-white text-slate-900"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
          <span className="font-semibold text-slate-700">{filteredResources.length}</span> listed items
          <span className="text-slate-300">•</span>
          <span className="font-semibold text-teal-700">
            {filteredResources.filter((r) => r.lendingAvailability).length}
          </span> available to loan
        </div>
      </div>

      {/* Resources Table / Grid with Motion */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredResources.length === 0 ? (
          <div className="col-span-full py-14 text-center text-xs text-slate-500 bg-white rounded-xl border border-dashed border-slate-300 space-y-4">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Boxes className="w-6 h-6 text-slate-400" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">No surplus resources currently listed</p>
              <p className="text-slate-500 text-xs mt-1">
                Add surplus assets to share with neighboring schools or update real inventory.
              </p>
            </div>
            <Link
              to="/school/add-resource"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Catalog First Resource</span>
            </Link>
          </div>
        ) : (
          filteredResources.map((res) => (
            <motion.div
              key={res.id}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-teal-200 transition-all"
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
                      <span className="text-[10px] mt-1 text-slate-400">No Image Uploaded</span>
                    </div>
                  )}

                  <div className="absolute top-2 right-2 flex gap-1">
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
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-teal-700 uppercase tracking-wider">
                      {res.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {res.id.slice(-6)}</span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 leading-snug">{res.name}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {res.description || 'No description provided.'}
                  </p>

                  <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-100 flex items-center justify-between">
                    <span className="truncate max-w-[150px]">Loc: {res.location}</span>
                    <span className="font-mono font-bold text-slate-800 tabular-nums">
                      {res.availableQuantity} / {res.totalQuantity} Avail
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Bar with Edit & Delete */}
              <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={res.lendingAvailability}
                    onChange={() => handleToggleLending(res.id, res.lendingAvailability)}
                    className="rounded border-slate-300 text-teal-700 focus:ring-teal-700 cursor-pointer"
                  />
                  <span>Lendable</span>
                </label>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setSelectedItem(res)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded transition-colors"
                    title="View details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openEditModal(res)}
                    className="p-1.5 text-teal-600 hover:text-teal-800 hover:bg-teal-50 rounded transition-colors"
                    title="Edit resource data"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteResource(res.id, res.name)}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Edit Resource Modal */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 text-slate-800 space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200"
            >
              <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                    <Edit2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Edit Resource Details</h3>
                    <p className="text-[11px] text-slate-500">Update live inventory records and lending terms</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingItem(null)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Resource Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-teal-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-teal-700"
                    >
                      <option value="Computers & IT">Computers & IT</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Books & Library">Books & Library</option>
                      <option value="Science Lab Equipment">Science Lab Equipment</option>
                      <option value="Sports Goods">Sports Goods</option>
                      <option value="Smart Classroom Tools">Smart Classroom Tools</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Condition *
                    </label>
                    <select
                      value={editForm.condition}
                      onChange={(e) => setEditForm({ ...editForm, condition: e.target.value as any })}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-teal-700"
                    >
                      <option value="New">New</option>
                      <option value="Good">Good</option>
                      <option value="Needs Repair">Needs Repair</option>
                      <option value="Damaged">Damaged</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Total Quantity *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={editForm.totalQuantity}
                      onChange={(e) => setEditForm({ ...editForm, totalQuantity: Number(e.target.value) })}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-teal-700 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Available to Loan *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={editForm.totalQuantity}
                      required
                      value={editForm.availableQuantity}
                      onChange={(e) => setEditForm({ ...editForm, availableQuantity: Number(e.target.value) })}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-teal-700 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Room / Campus Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-teal-700"
                    placeholder="e.g., Computer Lab 2, Room 104"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Description & Specifications
                  </label>
                  <textarea
                    rows={2}
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-teal-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lending Conditions / Return Rules
                  </label>
                  <input
                    type="text"
                    value={editForm.lendingNotes}
                    onChange={(e) => setEditForm({ ...editForm, lendingNotes: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-teal-700"
                    placeholder="e.g., Max loan 30 days, borrower provides transport"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="editLendable"
                    checked={editForm.lendingAvailability}
                    onChange={(e) => setEditForm({ ...editForm, lendingAvailability: e.target.checked })}
                    className="rounded border-slate-300 text-teal-700 focus:ring-teal-700"
                  />
                  <label htmlFor="editLendable" className="text-xs font-medium text-slate-700 cursor-pointer">
                    Enable this resource for inter-school borrowing requests
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Item View Modal */}
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
                <h3 className="font-bold text-base text-slate-900">{selectedItem.name}</h3>
                <button onClick={() => setSelectedItem(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedItem.photograph && (
                <div className="aspect-16/9 rounded-lg overflow-hidden border border-slate-200">
                  <img src={selectedItem.photograph} alt={selectedItem.name} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <div className="text-slate-400">Category</div>
                  <div className="font-bold text-slate-800 mt-0.5">{selectedItem.category}</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <div className="text-slate-400">Condition</div>
                  <div className="font-bold text-slate-800 mt-0.5">{selectedItem.condition}</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <div className="text-slate-400">Total Count</div>
                  <div className="font-bold text-slate-800 mt-0.5 font-mono tabular-nums">{selectedItem.totalQuantity} units</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <div className="text-slate-400">Available to Loan</div>
                  <div className="font-bold text-teal-800 mt-0.5 font-mono tabular-nums">{selectedItem.availableQuantity} units</div>
                </div>
                <div className="col-span-2 p-2.5 bg-slate-50 rounded-lg">
                  <div className="text-slate-400">Storage Location</div>
                  <div className="font-medium text-slate-800 mt-0.5">{selectedItem.location}</div>
                  {selectedItem.lendingNotes && (
                    <div className="text-slate-500 text-[11px] mt-1 italic">
                      Lending terms: {selectedItem.lendingNotes}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => {
                    const item = selectedItem;
                    setSelectedItem(null);
                    openEditModal(item);
                  }}
                  className="py-1.5 px-3 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Resource</span>
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
