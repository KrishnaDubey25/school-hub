import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterSchoolPage } from './pages/auth/RegisterSchoolPage';
import { RegisterNGOPage } from './pages/auth/RegisterNGOPage';

// Admin Pages
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminSchoolsPage } from './pages/admin/AdminSchoolsPage';
import { AdminNGOsPage } from './pages/admin/AdminNGOsPage';
import { AdminRequestsPage } from './pages/admin/AdminRequestsPage';
import { AdminInventoryPage } from './pages/admin/AdminInventoryPage';
import { AdminTransactionsPage } from './pages/admin/AdminTransactionsPage';
import { AdminDonationsPage } from './pages/admin/AdminDonationsPage';
import { AdminDeliveriesPage } from './pages/admin/AdminDeliveriesPage';
import { AdminComplaintsPage } from './pages/admin/AdminComplaintsPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminNotificationsPage } from './pages/admin/AdminNotificationsPage';
import { AdminLogsPage } from './pages/admin/AdminLogsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// School Pages
import { SchoolOverviewPage } from './pages/school/SchoolOverviewPage';
import { SchoolProfilePage } from './pages/school/SchoolProfilePage';
import { SchoolResourcesPage } from './pages/school/SchoolResourcesPage';
import { SchoolAddResourcePage } from './pages/school/SchoolAddResourcePage';
import { SchoolCreateRequirementPage } from './pages/school/SchoolCreateRequirementPage';
import { SchoolFindResourcesPage } from './pages/school/SchoolFindResourcesPage';
import { SchoolBorrowRequestsPage } from './pages/school/SchoolBorrowRequestsPage';
import { SchoolLendingRequestsPage } from './pages/school/SchoolLendingRequestsPage';
import { SchoolActiveTransactionsPage } from './pages/school/SchoolActiveTransactionsPage';
import { SchoolReturnsPage } from './pages/school/SchoolReturnsPage';
import { SchoolDonationsPage } from './pages/school/SchoolDonationsPage';
import { SchoolNotificationsPage } from './pages/school/SchoolNotificationsPage';
import { SchoolHistoryPage } from './pages/school/SchoolHistoryPage';
import { SchoolSettingsPage } from './pages/school/SchoolSettingsPage';

// NGO Pages
import { NGOOverviewPage } from './pages/ngo/NGOOverviewPage';
import { NGOProfilePage } from './pages/ngo/NGOProfilePage';
import { NGOBrowseNeedsPage } from './pages/ngo/NGOBrowseNeedsPage';
import { NGOOfferDonationPage } from './pages/ngo/NGOOfferDonationPage';
import { NGOMyDonationsPage } from './pages/ngo/NGOMyDonationsPage';
import { NGODeliveriesPage } from './pages/ngo/NGODeliveriesPage';
import { NGOImpactPage } from './pages/ngo/NGOImpactPage';
import { NGOHistoryPage } from './pages/ngo/NGOHistoryPage';
import { NGONotificationsPage } from './pages/ngo/NGONotificationsPage';
import { NGOSettingsPage } from './pages/ngo/NGOSettingsPage';

// Role-protected route wrapper
const ProtectedRoute: React.FC<{
  allowedRoles: ('admin' | 'school' | 'ngo')[];
  children: React.ReactNode;
}> = ({ allowedRoles, children }) => {
  const { currentUser, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-xs font-mono">
        Loading session...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    // Redirect to user's own home portal
    const target =
      currentUser.role === 'admin'
        ? '/admin'
        : currentUser.role === 'school'
        ? '/school'
        : '/ngo';
    return <Navigate to={target} replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

export default function App() {
  return (
    <DataProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register-school" element={<RegisterSchoolPage />} />
            <Route path="/register-ngo" element={<RegisterNGOPage />} />

            {/* Central Administrator Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminOverviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/schools"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminSchoolsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/ngos"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminNGOsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/requests"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminRequestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/inventory"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminInventoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/transactions"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminTransactionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/donations"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDonationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/deliveries"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDeliveriesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/complaints"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminComplaintsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminReportsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/notifications"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminNotificationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/logs"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLogsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminSettingsPage />
                </ProtectedRoute>
              }
            />

            {/* Government School Routes */}
            <Route
              path="/school"
              element={
                <ProtectedRoute allowedRoles={['school']}>
                  <SchoolOverviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/school/profile"
              element={
                <ProtectedRoute allowedRoles={['school']}>
                  <SchoolProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/school/resources"
              element={
                <ProtectedRoute allowedRoles={['school']}>
                  <SchoolResourcesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/school/add-resource"
              element={
                <ProtectedRoute allowedRoles={['school']}>
                  <SchoolAddResourcePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/school/create-requirement"
              element={
                <ProtectedRoute allowedRoles={['school']}>
                  <SchoolCreateRequirementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/school/find-resources"
              element={
                <ProtectedRoute allowedRoles={['school']}>
                  <SchoolFindResourcesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/school/borrow-requests"
              element={
                <ProtectedRoute allowedRoles={['school']}>
                  <SchoolBorrowRequestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/school/lending-requests"
              element={
                <ProtectedRoute allowedRoles={['school']}>
                  <SchoolLendingRequestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/school/active-transactions"
              element={
                <ProtectedRoute allowedRoles={['school']}>
                  <SchoolActiveTransactionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/school/returns"
              element={
                <ProtectedRoute allowedRoles={['school']}>
                  <SchoolReturnsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/school/donations"
              element={
                <ProtectedRoute allowedRoles={['school']}>
                  <SchoolDonationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/school/notifications"
              element={
                <ProtectedRoute allowedRoles={['school']}>
                  <SchoolNotificationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/school/history"
              element={
                <ProtectedRoute allowedRoles={['school']}>
                  <SchoolHistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/school/settings"
              element={
                <ProtectedRoute allowedRoles={['school']}>
                  <SchoolSettingsPage />
                </ProtectedRoute>
              }
            />

            {/* NGO Partner Routes */}
            <Route
              path="/ngo"
              element={
                <ProtectedRoute allowedRoles={['ngo']}>
                  <NGOOverviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ngo/profile"
              element={
                <ProtectedRoute allowedRoles={['ngo']}>
                  <NGOProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ngo/browse-needs"
              element={
                <ProtectedRoute allowedRoles={['ngo']}>
                  <NGOBrowseNeedsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ngo/offer-donation"
              element={
                <ProtectedRoute allowedRoles={['ngo']}>
                  <NGOOfferDonationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ngo/my-donations"
              element={
                <ProtectedRoute allowedRoles={['ngo']}>
                  <NGOMyDonationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ngo/deliveries"
              element={
                <ProtectedRoute allowedRoles={['ngo']}>
                  <NGODeliveriesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ngo/impact"
              element={
                <ProtectedRoute allowedRoles={['ngo']}>
                  <NGOImpactPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ngo/history"
              element={
                <ProtectedRoute allowedRoles={['ngo']}>
                  <NGOHistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ngo/notifications"
              element={
                <ProtectedRoute allowedRoles={['ngo']}>
                  <NGONotificationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ngo/settings"
              element={
                <ProtectedRoute allowedRoles={['ngo']}>
                  <NGOSettingsPage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </DataProvider>
  );
}
