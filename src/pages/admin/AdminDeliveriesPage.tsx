import React, { useState } from 'react';
import { getStoredData, saveStoredData, logActivity } from '../../services/storage';
import { BorrowingTransaction, TransactionStatus } from '../../types';
import {
  Truck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Calendar,
  User,
  Edit2,
  X,
  Check,
} from 'lucide-react';

export const AdminDeliveriesPage: React.FC = () => {
  const [store, setStore] = useState(getStoredData());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTxForCoord, setSelectedTxForCoord] = useState<BorrowingTransaction | null>(null);

  // Edit fields
  const [coordinator, setCoordinator] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const [status, setStatus] = useState<TransactionStatus>('Admin Coordinated');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  const activeDeliveries = store.transactions.filter(
    (t) => t.status !== 'Returned to Lender' && t.status !== 'Lender Rejected'
  );

  const filteredDeliveries = activeDeliveries.filter((t) => {
    return (
      t.resourceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.lenderSchoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.borrowerSchoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.deliveryCoordinator && t.deliveryCoordinator.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handleOpenCoordModal = (tx: BorrowingTransaction) => {
    setSelectedTxForCoord(tx);
    setCoordinator(tx.deliveryCoordinator || 'District Logistics Cell');
    setPickupDate(tx.pickupDate || new Date().toISOString().split('T')[0]);
    setExpectedDate(tx.expectedDeliveryDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
    setStatus(tx.status);
    setDeliveryNotes(tx.deliveryNotes || '');
  };

  const handleSaveCoordination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTxForCoord) return;

    const updated = {
      ...store,
      transactions: store.transactions.map((t) =>
        t.id === selectedTxForCoord.id
          ? {
              ...t,
              deliveryCoordinator: coordinator,
              pickupDate,
              expectedDeliveryDate: expectedDate,
              status,
              deliveryNotes,
              updatedAt: new Date().toISOString(),
            }
          : t
      ),
    };

    saveStoredData(updated);
    setStore(updated);
    logActivity(
      'admin',
      'Central Logistics Desk',
      'Delivery Manifest Updated',
      `Tx #${selectedTxForCoord.id} (${selectedTxForCoord.resourceName}): Status '${status}', Coordinator: ${coordinator}`
    );

    setSelectedTxForCoord(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Inter-School Delivery & Transit Coordination
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Assign district logistics coordinators, schedule pickup and delivery windows, and track equipment transit.
          </p>
        </div>

        <div className="text-xs text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
          Active Shipments: <span className="font-bold text-slate-900">{filteredDeliveries.length}</span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by resource, lender, borrower school, or logistics officer..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-1 focus:ring-teal-700 bg-white text-slate-900"
          />
        </div>
      </div>

      {/* Shipments List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Transaction / Cargo</th>
                <th className="py-3 px-4">Origin School</th>
                <th className="py-3 px-4">Destination School</th>
                <th className="py-3 px-4">Logistics Coordinator</th>
                <th className="py-3 px-4">Schedule Dates</th>
                <th className="py-3 px-4">Transit Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredDeliveries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    No active deliveries in the system.
                  </td>
                </tr>
              ) : (
                filteredDeliveries.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{tx.resourceName}</div>
                      <div className="text-[11px] font-mono text-slate-500">
                        Tx #{tx.id} · <span className="font-semibold text-slate-800">{tx.quantity} units</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{tx.lenderSchoolName}</div>
                      <div className="text-[11px] text-slate-500">{tx.lenderDistrict}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{tx.borrowerSchoolName}</div>
                      <div className="text-[11px] text-slate-500">{tx.borrowerDistrict}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">
                        {tx.deliveryCoordinator || (
                          <span className="text-amber-600 font-normal">Pending Assignment</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      <div>Pickup: {tx.pickupDate || 'TBD'}</div>
                      <div className="text-[11px] text-teal-700">ETA: {tx.expectedDeliveryDate || 'TBD'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                          tx.status === 'In Transit'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : tx.status === 'Received by Borrower'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : tx.status === 'Admin Coordinated'
                            ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {tx.status === 'In Transit' && <Truck className="w-3 h-3 text-blue-600" />}
                        {tx.status === 'Received by Borrower' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        <span>{tx.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenCoordModal(tx)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-semibold"
                      >
                        <Edit2 className="w-3 h-3 text-slate-600" />
                        <span>Coordinate</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Coordination Edit Modal */}
      {selectedTxForCoord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 text-slate-800 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Update Logistics Manifest
                </h3>
                <p className="text-xs text-slate-500 font-mono">Tx #{selectedTxForCoord.id}</p>
              </div>
              <button onClick={() => setSelectedTxForCoord(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoordination} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                <div className="font-bold text-slate-900">{selectedTxForCoord.resourceName}</div>
                <div className="text-slate-600">
                  From: {selectedTxForCoord.lenderSchoolName} → To: {selectedTxForCoord.borrowerSchoolName}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Assigned Logistics Coordinator / Carrier *
                </label>
                <input
                  type="text"
                  required
                  value={coordinator}
                  onChange={(e) => setCoordinator(e.target.value)}
                  placeholder="e.g. V. Raman (District Logistics Officer)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Scheduled Pickup Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Expected Delivery Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Transit Status *
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TransactionStatus)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden bg-white text-slate-900"
                >
                  <option value="Admin Coordinated">Admin Coordinated (Manifest Prepared)</option>
                  <option value="In Transit">In Transit (Dispatched on Vehicle)</option>
                  <option value="Received by Borrower">Received by Borrower (Delivered)</option>
                  <option value="Return Initiated">Return Initiated (Return Journey)</option>
                  <option value="Returned to Lender">Returned to Lender (Completed)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Logistics & Waybill Tracking Notes
                </label>
                <textarea
                  rows={2}
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="Vehicle number, dispatch receipt reference, contact phone..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTxForCoord(null)}
                  className="py-1.5 px-3 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-1.5 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Manifest & Notify Schools</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
