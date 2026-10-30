import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStoredData, saveStoredData } from '../../services/storage';
import { BorrowingTransaction } from '../../types';
import { Send, Clock, Truck, CheckCircle2, AlertTriangle, Eye, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SchoolBorrowRequestsPage: React.FC = () => {
  const { currentSchool, currentUser } = useAuth();
  const store = getStoredData();
  const schoolId = currentSchool?.id || currentUser?.schoolId || '';

  const outgoing = store.transactions.filter((t) => t.borrowerSchoolId === schoolId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Our Outgoing Borrow Requests
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track equipment requests submitted to neighboring schools, approvals, and dispatch status.
          </p>
        </div>

        <Link
          to="/school/find-resources"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-xs"
        >
          <span>Find More Resources</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Transaction / Resource</th>
                <th className="py-3 px-4">Lender School</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Scheduled Return</th>
                <th className="py-3 px-4">Request Status</th>
                <th className="py-3 px-4 text-right">Action / Manifest</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {outgoing.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    No outgoing borrow requests. Use &quot;Find Resources&quot; to borrow surplus assets.
                  </td>
                </tr>
              ) : (
                outgoing.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{tx.resourceName}</div>
                      <div className="text-[11px] font-mono text-slate-500">ID: {tx.id} · {tx.category}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{tx.lenderSchoolName}</div>
                      <div className="text-[11px] text-slate-500">{tx.lenderDistrict}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 tabular-nums">
                      {tx.quantity} units
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {tx.returnDueDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                          tx.status === 'Received by Borrower'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : tx.status === 'In Transit'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : tx.status === 'Lender Approved' || tx.status === 'Admin Coordinated'
                            ? 'bg-teal-50 text-teal-800 border border-teal-200'
                            : tx.status === 'Lender Rejected'
                            ? 'bg-red-50 text-red-800 border border-red-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {tx.status === 'Requested' && <Clock className="w-3 h-3 text-amber-600" />}
                        {tx.status === 'In Transit' && <Truck className="w-3 h-3 text-blue-600" />}
                        {tx.status === 'Received by Borrower' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        <span>{tx.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to="/school/active-transactions"
                        className="px-2.5 py-1 text-slate-700 hover:bg-slate-100 rounded text-xs font-semibold"
                      >
                        View Status
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
