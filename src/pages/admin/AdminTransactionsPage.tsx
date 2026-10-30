import React, { useState } from 'react';
import { getStoredData, saveStoredData, logActivity } from '../../services/storage';
import { BorrowingTransaction, TransactionStatus } from '../../types';
import {
  ArrowLeftRight,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  AlertTriangle,
  Eye,
  X,
  UserCheck,
} from 'lucide-react';

export const AdminTransactionsPage: React.FC = () => {
  const [store, setStore] = useState(getStoredData());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTx, setSelectedTx] = useState<BorrowingTransaction | null>(null);

  const filteredTransactions = store.transactions.filter((t) => {
    const matchesSearch =
      t.resourceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.lenderSchoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.borrowerSchoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' ? true : t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Borrowing & Lending Transactions Oversight
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor active equipment loans between government schools, return deadlines, and condition integrity.
          </p>
        </div>

        <div className="text-xs text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
          Total Loan Cycles: <span className="font-bold text-slate-900">{store.transactions.length}</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by transaction ID, resource, lender, or borrower..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-1 focus:ring-teal-700 bg-white text-slate-900"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
          {['all', 'Requested', 'Admin Coordinated', 'In Transit', 'Received by Borrower', 'Returned to Lender'].map(
            (st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'all' ? 'All Transactions' : st}
              </button>
            )
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Transaction ID & Resource</th>
                <th className="py-3 px-4">Lender School</th>
                <th className="py-3 px-4">Borrower School</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Return Due Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{tx.resourceName}</div>
                      <div className="text-[11px] font-mono text-slate-500">ID: {tx.id} · {tx.category}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{tx.lenderSchoolName}</div>
                      <div className="text-[11px] text-slate-500">{tx.lenderDistrict}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{tx.borrowerSchoolName}</div>
                      <div className="text-[11px] text-slate-500">{tx.borrowerDistrict}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 tabular-nums">
                      {tx.quantity} units
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 tabular-nums">
                      {tx.returnDueDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                          tx.status === 'Received by Borrower'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : tx.status === 'In Transit'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : tx.status === 'Admin Coordinated'
                            ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                            : tx.status === 'Returned to Lender'
                            ? 'bg-slate-100 text-slate-700'
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
                        onClick={() => setSelectedTx(tx)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                        title="View Transaction Manifest"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Inspection Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 text-slate-800 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">Inter-School Loan Manifest</h3>
                <p className="text-xs text-slate-500 font-mono">Tx #{selectedTx.id}</p>
              </div>
              <button onClick={() => setSelectedTx(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                <div className="text-slate-400 font-medium">Resource Description</div>
                <div className="font-bold text-slate-900">{selectedTx.resourceName}</div>
                <div className="text-slate-600">Quantity: {selectedTx.quantity} units · Category: {selectedTx.category}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-slate-400 font-medium">Lending School</div>
                  <div className="font-bold text-slate-800 mt-0.5">{selectedTx.lenderSchoolName}</div>
                  <div className="text-slate-500 text-[11px]">{selectedTx.lenderDistrict}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-slate-400 font-medium">Borrowing School</div>
                  <div className="font-bold text-slate-800 mt-0.5">{selectedTx.borrowerSchoolName}</div>
                  <div className="text-slate-500 text-[11px]">{selectedTx.borrowerDistrict}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-slate-400 font-medium">Loan Start Date</div>
                  <div className="font-medium text-slate-800 font-mono mt-0.5">{selectedTx.requestedStartDate}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-slate-400 font-medium">Return Due Date</div>
                  <div className="font-bold text-amber-800 font-mono mt-0.5">{selectedTx.returnDueDate}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                <div className="text-slate-400 font-medium">Logistics Details</div>
                <div>Coordinator: <strong>{selectedTx.deliveryCoordinator || 'Pending Assignment'}</strong></div>
                {selectedTx.deliveryNotes && <div>Logistics Notes: {selectedTx.deliveryNotes}</div>}
                <div>Current Cycle Status: <span className="font-bold capitalize">{selectedTx.status}</span></div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="py-1.5 px-4 bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
