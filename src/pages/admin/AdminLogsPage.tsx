import React, { useState } from 'react';
import { getStoredData } from '../../services/storage';
import { ScrollText, Search, Shield, Filter, User } from 'lucide-react';

export const AdminLogsPage: React.FC = () => {
  const store = getStoredData();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredLogs = store.activityLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' ? true : log.actorRole === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Platform Activity & Audit Logs
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tamper-evident operational trail tracking institutional registrations, approvals, loan dispatches, and disputes.
          </p>
        </div>

        <div className="text-xs text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
          Recorded Events: <span className="font-bold text-slate-900">{store.activityLogs.length}</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by action, details, or actor name..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-1 focus:ring-teal-700 bg-white text-slate-900"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
          {['all', 'admin', 'school', 'ngo', 'System'].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors capitalize ${
                roleFilter === role
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {role === 'all' ? 'All Actors' : role}
            </button>
          ))}
        </div>
      </div>

      {/* Log list */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredLogs.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No activity logs match your criteria.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{log.action}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                        log.actorRole === 'admin'
                          ? 'bg-slate-900 text-white'
                          : log.actorRole === 'school'
                          ? 'bg-teal-50 text-teal-800 border border-teal-200'
                          : log.actorRole === 'ngo'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {log.actorRole}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{log.details}</p>
                  <div className="text-[11px] text-slate-400">
                    Actor: <span className="font-medium text-slate-600">{log.actorName}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono text-xs text-slate-500 tabular-nums">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
