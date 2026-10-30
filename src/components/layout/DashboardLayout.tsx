import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { saveStoredData } from '../../services/storage';
import { motion, AnimatePresence } from 'motion/react';
import { QuickEntryModal } from '../common/QuickEntryModal';
import { RoleDetailsPanel } from '../common/RoleDetailsPanel';
import {
  LayoutDashboard,
  School,
  Building2,
  PackageCheck,
  Boxes,
  ArrowLeftRight,
  Gift,
  Truck,
  AlertTriangle,
  BarChart3,
  Bell,
  ScrollText,
  Settings,
  LogOut,
  PlusCircle,
  FileQuestion,
  Search,
  Inbox,
  Send,
  RotateCcw,
  History,
  Menu,
  X,
  ShieldCheck,
  Clock,
  CheckCircle,
  ExternalLink,
  Users,
} from 'lucide-react';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: number;
}

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, currentSchool, currentNGO, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [rolesGuideOpen, setRolesGuideOpen] = useState(false);

  const { store } = useData();

  // Filter notifications for this user / role
  const userNotifications = store.notifications.filter(
    (n) =>
      n.recipientRole === 'all' ||
      n.recipientRole === currentUser?.role ||
      n.recipientId === currentUser?.id ||
      (currentUser?.role === 'school' && n.recipientId === currentUser?.schoolId) ||
      (currentUser?.role === 'ngo' && n.recipientId === currentUser?.ngoId)
  );

  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const markAllNotificationsRead = () => {
    const updated = {
      ...store,
      notifications: store.notifications.map((n) => {
        if (
          n.recipientRole === 'all' ||
          n.recipientRole === currentUser?.role ||
          n.recipientId === currentUser?.id ||
          (currentUser?.role === 'school' && n.recipientId === currentUser?.schoolId) ||
          (currentUser?.role === 'ngo' && n.recipientId === currentUser?.ngoId)
        ) {
          return { ...n, read: true };
        }
        return n;
      }),
    };
    saveStoredData(updated);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Build navigation items based on role
  let navItems: SidebarItem[] = [];

  if (currentUser?.role === 'admin') {
    navItems = [
      { name: 'Overview', path: '/admin', icon: LayoutDashboard },
      {
        name: 'Schools',
        path: '/admin/schools',
        icon: School,
        badge: store.schools.filter((s) => s.verificationStatus === 'pending').length || undefined,
      },
      {
        name: 'NGOs',
        path: '/admin/ngos',
        icon: Building2,
        badge: store.ngos.filter((n) => n.verificationStatus === 'pending').length || undefined,
      },
      { name: 'Resource Requests', path: '/admin/requests', icon: PackageCheck },
      { name: 'Resource Inventory', path: '/admin/inventory', icon: Boxes },
      { name: 'Borrowing & Lending', path: '/admin/transactions', icon: ArrowLeftRight },
      {
        name: 'Donations',
        path: '/admin/donations',
        icon: Gift,
        badge: store.donations.filter((d) => d.status === 'Offer Submitted').length || undefined,
      },
      {
        name: 'Deliveries',
        path: '/admin/deliveries',
        icon: Truck,
        badge: store.transactions.filter((t) => t.status === 'In Transit').length || undefined,
      },
      {
        name: 'Complaints',
        path: '/admin/complaints',
        icon: AlertTriangle,
        badge: store.complaints.filter((c) => c.status === 'Open').length || undefined,
      },
      { name: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3 },
      { name: 'Notifications', path: '/admin/notifications', icon: Bell, badge: unreadCount || undefined },
      { name: 'Activity Logs', path: '/admin/logs', icon: ScrollText },
      { name: 'Settings', path: '/admin/settings', icon: Settings },
    ];
  } else if (currentUser?.role === 'school') {
    const schoolId = currentUser.schoolId || '';
    const incomingReqs = store.transactions.filter(
      (t) => t.lenderSchoolId === schoolId && t.status === 'Requested'
    ).length;

    navItems = [
      { name: 'Overview', path: '/school', icon: LayoutDashboard },
      { name: 'My School', path: '/school/profile', icon: School },
      { name: 'My Resources', path: '/school/resources', icon: Boxes },
      { name: 'Add Resource', path: '/school/add-resource', icon: PlusCircle },
      { name: 'Create Requirement', path: '/school/create-requirement', icon: FileQuestion },
      { name: 'Find Resources', path: '/school/find-resources', icon: Search },
      { name: 'Borrow Requests', path: '/school/borrow-requests', icon: Send },
      {
        name: 'Lending Requests',
        path: '/school/lending-requests',
        icon: Inbox,
        badge: incomingReqs || undefined,
      },
      { name: 'Active Transactions', path: '/school/active-transactions', icon: ArrowLeftRight },
      { name: 'Return Management', path: '/school/returns', icon: RotateCcw },
      { name: 'Donations', path: '/school/donations', icon: Gift },
      { name: 'Notifications', path: '/school/notifications', icon: Bell, badge: unreadCount || undefined },
      { name: 'History', path: '/school/history', icon: History },
      { name: 'Settings', path: '/school/settings', icon: Settings },
    ];
  } else if (currentUser?.role === 'ngo') {
    navItems = [
      { name: 'Overview', path: '/ngo', icon: LayoutDashboard },
      { name: 'Organization Profile', path: '/ngo/profile', icon: Building2 },
      { name: 'Browse School Needs', path: '/ngo/browse-needs', icon: Search },
      { name: 'Offer Donation', path: '/ngo/offer-donation', icon: PlusCircle },
      { name: 'My Donations', path: '/ngo/my-donations', icon: Gift },
      { name: 'Delivery Tracking', path: '/ngo/deliveries', icon: Truck },
      { name: 'Donation History', path: '/ngo/history', icon: History },
      { name: 'Impact', path: '/ngo/impact', icon: BarChart3 },
      { name: 'Notifications', path: '/ngo/notifications', icon: Bell, badge: unreadCount || undefined },
      { name: 'Settings', path: '/ngo/settings', icon: Settings },
    ];
  }

  // Verification status banner
  const isPending = currentUser?.status === 'pending';
  const isSuspended = currentUser?.status === 'suspended';

  // Format breadcrumb text
  const currentPathSegment = location.pathname.split('/').filter(Boolean);
  const breadcrumbText = currentPathSegment
    .map((seg) => seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))
    .join(' / ') || 'Overview';

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-slate-900 border-r border-slate-800 text-slate-200 shrink-0 select-none">
        {/* Brand */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-800 bg-slate-950/40">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight text-white leading-tight">School Resource Hub</div>
            <div className="text-[11px] text-teal-400 font-medium capitalize">
              {currentUser?.role === 'admin'
                ? 'Central Administrator'
                : currentUser?.role === 'school'
                ? 'Government School'
                : 'NGO Partner'}
            </div>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-xs font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.name}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive ? 'bg-white text-teal-900' : 'bg-teal-600 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom User Area */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/30">
          <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-slate-800/60 mb-2">
            <div className="truncate mr-2">
              <div className="text-xs font-medium text-slate-200 truncate">{currentUser?.name}</div>
              <div className="text-[10px] text-slate-400 truncate">{currentUser?.email}</div>
            </div>
            <span
              className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${
                currentUser?.status === 'approved'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-amber-950 text-amber-300 border border-amber-800'
              }`}
            >
              {currentUser?.status}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setRolesGuideOpen(true)}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs text-teal-300 hover:text-white hover:bg-teal-900/40 rounded transition-colors mb-2 border border-teal-800/50"
          >
            <Users className="w-3.5 h-3.5 text-teal-400" />
            <span>Role Details & Access</span>
          </button>

          <div className="flex items-center gap-1">
            <Link
              to="/"
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>Public Site</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs text-red-300 hover:text-red-100 hover:bg-red-900/40 rounded transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1.5 text-slate-500 hover:text-slate-800 lg:hidden rounded-md"
              aria-label="Open navigation sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb trail */}
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="text-slate-400">Portal</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-800 font-semibold">{breadcrumbText}</span>
            </div>
          </div>

          {/* Top Actions: Notifications, Info */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800">
                      Notifications ({userNotifications.length})
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[11px] font-medium text-teal-700 hover:text-teal-900"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {userNotifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-500">
                        No notifications to display.
                      </div>
                    ) : (
                      userNotifications.slice(0, 6).map((n) => (
                        <div
                          key={n.id}
                          className={`p-3 text-xs hover:bg-slate-50 transition-colors ${
                            !n.read ? 'bg-teal-50/40' : ''
                          }`}
                        >
                          <div className="font-semibold text-slate-800">{n.title}</div>
                          <div className="text-slate-600 mt-0.5">{n.message}</div>
                          <div className="text-[10px] text-slate-400 mt-1">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="px-4 pt-2 border-t border-slate-100 text-center">
                    <Link
                      to={`/${currentUser?.role}/notifications`}
                      onClick={() => setNotifDropdownOpen(false)}
                      className="text-xs font-semibold text-teal-700 hover:text-teal-900"
                    >
                      View All Notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Context chip */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 text-xs">
              <span className="text-slate-400">Context:</span>
              <span className="font-medium text-slate-700 truncate max-w-[160px]">
                {currentUser?.role === 'school'
                  ? currentSchool?.schoolName || currentUser.name
                  : currentUser?.role === 'ngo'
                  ? currentNGO?.ngoName || currentUser.name
                  : 'Central Logistics & Admin'}
              </span>
            </div>
          </div>
        </header>

        {/* Verification Status Warning (for pending or suspended accounts) */}
        {isPending && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Account Pending Verification:</strong> Your registration has been submitted and is awaiting Central Administrator review. Active borrowing and donations are unlocked once verified.
              </span>
            </div>
            {currentUser?.role === 'school' && (
              <span className="text-amber-800 underline font-medium">UDISE #{currentSchool?.udiseCode}</span>
            )}
          </div>
        )}

        {isSuspended && (
          <div className="bg-red-50 border-b border-red-200 px-6 py-3 flex items-center gap-2 text-xs text-red-900">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>
              <strong>Account Suspended:</strong> Platform transactions are temporarily frozen. Please contact the Central Administrator.
            </span>
          </div>
        )}

        {/* Viewport Content with Motion Page Transition */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>

      <QuickEntryModal isOpen={quickAddOpen} onClose={() => setQuickAddOpen(false)} />

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-72 bg-slate-900 text-slate-200 flex flex-col z-10 shadow-2xl">
            <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-400" />
                <span className="font-bold text-sm text-white">School Resource Hub</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium ${
                      isActive ? 'bg-teal-700 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-teal-600 text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="p-4 border-t border-slate-800">
              <button
                onClick={() => {
                  setMobileSidebarOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-red-300 hover:bg-red-950/30 rounded"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Details & Permissions Inspection Modal */}
      {rolesGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col">
            <button
              type="button"
              onClick={() => setRolesGuideOpen(false)}
              className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg hover:bg-slate-800 border border-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
            <RoleDetailsPanel />
          </div>
        </div>
      )}
    </div>
  );
};
