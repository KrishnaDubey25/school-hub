import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ResourceItem, BorrowingTransaction } from '../../types';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  Boxes,
  Eye,
  X,
  AlertCircle,
  Building,
  Image as ImageIcon,
} from 'lucide-react';

export const SchoolFindResourcesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentSchool, currentUser } = useAuth();
  const { store, addTransaction } = useData();

  const schoolId = currentSchool?.id || currentUser?.schoolId || '';

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [conditionFilter, setConditionFilter] = useState('all');

  // Request Borrow Modal State
  const [borrowModalResource, setBorrowModalResource] = useState<ResourceItem | null>(null);
  const [borrowQuantity, setBorrowQuantity] = useState<number>(2);
  const [requestedStartDate, setRequestedStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [returnDueDate, setReturnDueDate] = useState(
    new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0]
  );
  const [borrowPurpose, setBorrowPurpose] = useState('');
  const [borrowError, setBorrowError] = useState<string | null>(null);
  const [borrowSuccess, setBorrowSuccess] = useState(false);

  // Available resources from OTHER schools that are lendable
  const availableFromOthers = store.resources.filter(
    (res) =>
      res.providerSchoolId !== schoolId &&
      res.lendingAvailability &&
      res.availableQuantity > 0 &&
      res.condition !== 'Damaged'
  );

  const filteredResources = availableFromOthers.filter((res) => {
    const matchesSearch =
      res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.providerSchoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.providerDistrict.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' ? true : res.category === categoryFilter;
    const matchesCondition = conditionFilter === 'all' ? true : res.condition === conditionFilter;

    return matchesSearch && matchesCategory && matchesCondition;
  });

  const handleOpenBorrowModal = (resource: ResourceItem) => {
    setBorrowError(null);
    setBorrowSuccess(false);
    setBorrowModalResource(resource);
    setBorrowQuantity(Math.min(5, resource.availableQuantity));
    setBorrowPurpose(
      `Borrowing for student lab/classroom curriculum practicals at ${currentSchool?.schoolName || 'our school'}.`
    );
  };

  const handleSubmitBorrowRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setBorrowError(null);

    if (!borrowModalResource) return;

    if (currentUser?.status === 'pending') {
      setBorrowError('Your school account is currently pending verification. Unverified schools cannot create active borrowing transactions.');
      return;
    }

    if (borrowQuantity <= 0 || borrowQuantity > borrowModalResource.availableQuantity) {
      setBorrowError(`Please request between 1 and ${borrowModalResource.availableQuantity} available units.`);
      return;
    }

    if (!returnDueDate || returnDueDate <= requestedStartDate) {
      setBorrowError('Return due date must be after the start date.');
      return;
    }

    const txId = `tx-${Date.now()}`;
    const newTx: BorrowingTransaction = {
      id: txId,
      resourceId: borrowModalResource.id,
      resourceName: borrowModalResource.name,
      category: borrowModalResource.category,
      lenderSchoolId: borrowModalResource.providerSchoolId,
      lenderSchoolName: borrowModalResource.providerSchoolName,
      lenderDistrict: borrowModalResource.providerDistrict,
      borrowerSchoolId: schoolId,
      borrowerSchoolName: currentSchool?.schoolName || currentUser?.name || 'Borrower School',
      borrowerDistrict: currentSchool?.district || 'District',
      quantity: Number(borrowQuantity),
      status: 'Requested',
      requestedStartDate,
      returnDueDate,
      purpose: borrowPurpose,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addTransaction(newTx);

    setBorrowSuccess(true);
    setTimeout(() => {
      setBorrowModalResource(null);
      navigate('/school/borrow-requests');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            District Surplus Discovery & Inter-School Borrowing
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Browse verified available educational resources, laboratory apparatus, and computers listed by other government schools.
          </p>
        </div>

        <div className="text-xs text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
          Available Listings: <span className="font-bold text-slate-900">{filteredResources.length}</span>
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
            placeholder="Search by resource, provider school, district, or keywords..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-1 focus:ring-teal-700 bg-white text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 outline-hidden"
          >
            <option value="all">All Categories</option>
            <option value="Computers and IT">Computers & IT</option>
            <option value="Furniture">Furniture</option>
            <option value="Educational Materials">Educational Materials</option>
            <option value="Laboratory Equipment">Laboratory Equipment</option>
            <option value="Sports Equipment">Sports Equipment</option>
            <option value="Infrastructure">Infrastructure</option>
          </select>

          <select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 outline-hidden"
          >
            <option value="all">All Conditions</option>
            <option value="New">New</option>
            <option value="Good">Good</option>
            <option value="Needs Repair">Needs Repair</option>
          </select>
        </div>
      </div>

      {/* Marketplace Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredResources.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
            No lendable resources from other schools match your filter criteria.
          </div>
        ) : (
          filteredResources.map((res) => (
            <div
              key={res.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-colors"
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
                      <span className="text-[10px] mt-1 text-slate-400">Condition Documented</span>
                    </div>
                  )}

                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold shadow-xs ${
                        res.condition === 'New'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-teal-700 text-white'
                      }`}
                    >
                      {res.condition}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="text-[11px] font-semibold text-teal-700 uppercase tracking-wider">
                    {res.category}
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">{res.name}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {res.description}
                  </p>

                  <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-100 space-y-1">
                    <div>
                      Provider: <strong>{res.providerSchoolName}</strong>
                    </div>
                    <div>District: {res.providerDistrict}, {res.providerState}</div>
                    {res.lendingNotes && (
                      <div className="text-slate-600 italic">Terms: {res.lendingNotes}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs">
                  <span className="font-mono font-bold text-teal-800 tabular-nums">
                    {res.availableQuantity}
                  </span>{' '}
                  <span className="text-slate-500">units available</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenBorrowModal(res)}
                  className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Request Borrow</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Borrow Request Modal */}
      {borrowModalResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 text-slate-800 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">Request Inter-School Borrowing</h3>
                <p className="text-xs text-slate-500">Resource: {borrowModalResource.name}</p>
              </div>
              <button
                onClick={() => setBorrowModalResource(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {borrowSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Borrowing request submitted to {borrowModalResource.providerSchoolName}. Redirecting to tracking...</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitBorrowRequest} className="space-y-4 text-xs">
                {borrowError && (
                  <div className="p-3 bg-red-50 text-red-800 rounded-lg border border-red-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{borrowError}</span>
                  </div>
                )}

                <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                  <div className="font-semibold text-slate-900">Lender School</div>
                  <div className="text-slate-600">{borrowModalResource.providerSchoolName} ({borrowModalResource.providerDistrict})</div>
                  <div className="text-slate-500">Total available for loan: {borrowModalResource.availableQuantity} units</div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Quantity to Borrow (Units) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={borrowModalResource.availableQuantity}
                    required
                    value={borrowQuantity}
                    onChange={(e) => setBorrowQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Requested Loan Start Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={requestedStartDate}
                      onChange={(e) => setRequestedStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Return Due Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={returnDueDate}
                      onChange={(e) => setReturnDueDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Educational Purpose & Syllabus Need *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={borrowPurpose}
                    onChange={(e) => setBorrowPurpose(e.target.value)}
                    placeholder="Describe how students will use these resources..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setBorrowModalResource(null)}
                    className="py-1.5 px-3 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-1.5 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Borrow Request</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
