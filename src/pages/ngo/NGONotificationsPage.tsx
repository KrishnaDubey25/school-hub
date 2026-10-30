import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStoredData, saveStoredData } from '../../services/storage';
import { Bell, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NGONotificationsPage: React.FC = () => {
  const { currentNGO, currentUser } = useAuth();
  const [store, setStore] = useState(getStoredData());
  const ngoId = currentNGO?.id || currentUser?.ngoId || '';

  const notifications = store.notifications.filter(
    (n) => n.recipientRole === 'ngo' || n.recipientRole === 'all' || n.recipientId === ngoId
  );

  const markAllRead = () => {
    const updated = {
      ...store,
      notifications: store.notifications.map((n) =>
        n.recipientRole === 'ngo' || n.recipientRole === 'all' || n.recipientId === ngoId
          ? { ...n, read: true }
          : n
      ),
    };
    saveStoredData(updated);
    setStore(updated);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            NGO Notifications & Clearance Alerts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Administrative approval notices, delivery verifications, and urgent school requirements alerts.
          </p>
        </div>

        <button
          type="button"
          onClick={markAllRead}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold shadow-xs"
        >
          <Check className="w-3.5 h-3.5 text-amber-600" />
          <span>Mark All Read</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No notifications on record for your NGO account.
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 transition-colors flex items-start justify-between gap-4 ${
                !notif.read ? 'bg-amber-50/40 hover:bg-amber-50/60' : 'hover:bg-slate-50'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900">{notif.title}</span>
                  {!notif.read && <span className="w-2 h-2 rounded-full bg-amber-600" />}
                </div>
                <p className="text-xs text-slate-600">{notif.message}</p>
                {notif.link && (
                  <Link
                    to={notif.link}
                    className="inline-block text-xs font-semibold text-amber-700 hover:underline pt-1"
                  >
                    View Details →
                  </Link>
                )}
              </div>

              <div className="text-[11px] font-mono text-slate-400 shrink-0">
                {new Date(notif.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
