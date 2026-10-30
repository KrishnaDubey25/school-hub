import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  StorageData,
  getStoredData,
  saveStoredData,
  resetToDefaultData,
  clearToBlankSlate,
  calculatePlatformStats,
  logActivity,
  pushNotification,
} from '../services/storage';
import {
  ResourceItem,
  ResourceRequirement,
  BorrowingTransaction,
  DonationOffer,
  SchoolProfile,
  NGOProfile,
  ComplaintDispute,
  PlatformStats,
  User,
} from '../types';
import { ToastContainer, ToastItem } from '../components/common/ToastContainer';

interface DataContextType {
  store: StorageData;
  stats: PlatformStats;
  isCleanMode: boolean;
  // Resource Operations
  addResource: (item: ResourceItem) => void;
  updateResource: (id: string, partial: Partial<ResourceItem>) => void;
  deleteResource: (id: string) => { success: boolean; error?: string };
  // Requirement Operations
  addRequirement: (req: ResourceRequirement) => void;
  updateRequirement: (id: string, partial: Partial<ResourceRequirement>) => void;
  deleteRequirement: (id: string) => void;
  // Transaction Operations
  addTransaction: (tx: BorrowingTransaction) => void;
  updateTransaction: (id: string, partial: Partial<BorrowingTransaction>) => void;
  // Donation Operations
  addDonation: (don: DonationOffer) => void;
  updateDonation: (id: string, partial: Partial<DonationOffer>) => void;
  // School Operations
  addSchool: (school: SchoolProfile, createLogin?: boolean) => void;
  updateSchool: (id: string, partial: Partial<SchoolProfile>) => void;
  deleteSchool: (id: string) => void;
  // NGO Operations
  addNGO: (ngo: NGOProfile, createLogin?: boolean) => void;
  updateNGO: (id: string, partial: Partial<NGOProfile>) => void;
  deleteNGO: (id: string) => void;
  // Complaint Operations
  addComplaint: (comp: ComplaintDispute) => void;
  resolveComplaint: (id: string, notes: string) => void;
  // Platform Controls
  switchToBlankSlate: () => void;
  restoreSampleData: () => void;
  showToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [store, setStore] = useState<StorageData>(() => getStoredData());
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Sync with localStorage updates across tabs/events
  useEffect(() => {
    const handleStorageChange = () => {
      setStore(getStoredData());
    };
    window.addEventListener('school_hub_storage_updated', handleStorageChange);
    // The custom event covers updates in this tab; the native event covers
    // approvals made in another tab on the same origin.
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('school_hub_storage_updated', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const showToast = useCallback(
    (title: string, message?: string, type: 'success' | 'error' | 'info' = 'success') => {
      const id = `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      setToasts((prev) => [...prev, { id, title, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const isCleanMode = store.schools.length === 0;

  // Resource Operations
  const addResource = (item: ResourceItem) => {
    const next = {
      ...store,
      resources: [item, ...store.resources],
    };
    saveStoredData(next);
    setStore(next);
    logActivity('school', item.providerSchoolName, 'Resource Added', `Cataloged ${item.totalQuantity} units of ${item.name}`);
    showToast('Resource Added', `"${item.name}" has been added to your inventory.`, 'success');
  };

  const updateResource = (id: string, partial: Partial<ResourceItem>) => {
    const next = {
      ...store,
      resources: store.resources.map((r) => (r.id === id ? { ...r, ...partial, updatedAt: new Date().toISOString() } : r)),
    };
    saveStoredData(next);
    setStore(next);
    showToast('Resource Updated', 'Resource details updated successfully.', 'success');
  };

  const deleteResource = (id: string) => {
    const hasActiveTransactions = store.transactions.some(
      (t) => t.resourceId === id && t.status !== 'Returned to Lender' && t.status !== 'Lender Rejected'
    );
    if (hasActiveTransactions) {
      showToast('Cannot Delete', 'This resource is tied to an active loan cycle or shipment.', 'error');
      return { success: false, error: 'Resource has active transactions' };
    }
    const target = store.resources.find((r) => r.id === id);
    const next = {
      ...store,
      resources: store.resources.filter((r) => r.id !== id),
    };
    saveStoredData(next);
    setStore(next);
    logActivity('school', target?.providerSchoolName || 'School', 'Resource Deleted', `Removed listing: ${target?.name}`);
    showToast('Resource Deleted', `"${target?.name}" removed from inventory.`, 'info');
    return { success: true };
  };

  // Requirement Operations
  const addRequirement = (req: ResourceRequirement) => {
    const next = {
      ...store,
      requirements: [req, ...store.requirements],
    };
    saveStoredData(next);
    setStore(next);
    logActivity('school', req.schoolName, 'Requirement Published', `Requested ${req.quantityRequired} units of ${req.resourceName}`);
    showToast('Requirement Published', `Need for ${req.quantityRequired} units of "${req.resourceName}" posted.`, 'success');
  };

  const updateRequirement = (id: string, partial: Partial<ResourceRequirement>) => {
    const next = {
      ...store,
      requirements: store.requirements.map((r) => (r.id === id ? { ...r, ...partial } : r)),
    };
    saveStoredData(next);
    setStore(next);
    showToast('Requirement Updated', 'Requirement details updated.', 'success');
  };

  const deleteRequirement = (id: string) => {
    const target = store.requirements.find((r) => r.id === id);
    const next = {
      ...store,
      requirements: store.requirements.filter((r) => r.id !== id),
    };
    saveStoredData(next);
    setStore(next);
    showToast('Requirement Removed', `"${target?.resourceName}" removed.`, 'info');
  };

  // Transaction Operations
  const addTransaction = (tx: BorrowingTransaction) => {
    const next = {
      ...store,
      transactions: [tx, ...store.transactions],
      resources: store.resources.map((r) =>
        r.id === tx.resourceId
          ? {
              ...r,
              availableQuantity: Math.max(0, r.availableQuantity - tx.quantity),
              reservedQuantity: r.reservedQuantity + tx.quantity,
              updatedAt: new Date().toISOString(),
            }
          : r
      ),
    };
    saveStoredData(next);
    setStore(next);
    logActivity('school', tx.borrowerSchoolName, 'Borrow Request Sent', `Requested ${tx.quantity} units of ${tx.resourceName}`);
    showToast('Borrow Request Sent', `Request for ${tx.quantity} units sent to ${tx.lenderSchoolName}.`, 'success');
  };

  const updateTransaction = (id: string, partial: Partial<BorrowingTransaction>) => {
    const next = {
      ...store,
      transactions: store.transactions.map((t) => (t.id === id ? { ...t, ...partial, updatedAt: new Date().toISOString() } : t)),
    };
    saveStoredData(next);
    setStore(next);
    showToast('Transaction Updated', 'Loan transaction state updated.', 'success');
  };

  // Donation Operations
  const addDonation = (don: DonationOffer) => {
    const next = {
      ...store,
      donations: [don, ...store.donations],
    };
    saveStoredData(next);
    setStore(next);
    logActivity('ngo', don.ngoName, 'Donation Offered', `Offered ${don.quantityOffered} units of ${don.resourceName} to ${don.targetSchoolName}`);
    showToast('Donation Submitted', `Offered ${don.quantityOffered} units to ${don.targetSchoolName}.`, 'success');
  };

  const updateDonation = (id: string, partial: Partial<DonationOffer>) => {
    const next = {
      ...store,
      donations: store.donations.map((d) => (d.id === id ? { ...d, ...partial, updatedAt: new Date().toISOString() } : d)),
    };
    saveStoredData(next);
    setStore(next);
    showToast('Donation Updated', 'Donation record updated.', 'success');
  };

  // School Operations
  const addSchool = (school: SchoolProfile, createLogin = true) => {
    let nextUsers = [...store.users];
    if (createLogin) {
      nextUsers.push({
        id: `user-school-${Date.now()}`,
        email: school.email,
        role: 'school',
        name: `${school.principalName} (${school.schoolName})`,
        status: school.verificationStatus,
        schoolId: school.id,
        createdAt: new Date().toISOString(),
      });
    }
    const next = {
      ...store,
      schools: [school, ...store.schools],
      users: nextUsers,
    };
    saveStoredData(next);
    setStore(next);
    logActivity('school', school.principalName, 'School Registered', `Added school ${school.schoolName} (UDISE: ${school.udiseCode})`);
    showToast('School Added', `"${school.schoolName}" successfully added.`, 'success');
  };

  const updateSchool = (id: string, partial: Partial<SchoolProfile>) => {
    const school = store.schools.find((s) => s.id === id);
    const next = {
      ...store,
      schools: store.schools.map((s) => (s.id === id ? { ...s, ...partial } : s)),
      users: partial.verificationStatus
        ? store.users.map((user) =>
            user.schoolId === id ? { ...user, status: partial.verificationStatus! } : user
          )
        : store.users,
    };
    saveStoredData(next);
    setStore(next);
    showToast(
      partial.verificationStatus === 'approved' ? 'School Approved' : 'School Updated',
      partial.verificationStatus === 'approved'
        ? `${school?.schoolName || 'School'} can now sign in to the school portal.`
        : 'School record updated.',
      'success'
    );
  };

  const deleteSchool = (id: string) => {
    const target = store.schools.find((s) => s.id === id);
    const next = {
      ...store,
      schools: store.schools.filter((s) => s.id !== id),
      resources: store.resources.filter((r) => r.providerSchoolId !== id),
      requirements: store.requirements.filter((r) => r.schoolId !== id),
    };
    saveStoredData(next);
    setStore(next);
    showToast('School Removed', `"${target?.schoolName}" removed.`, 'info');
  };

  // NGO Operations
  const addNGO = (ngo: NGOProfile, createLogin = true) => {
    let nextUsers = [...store.users];
    if (createLogin) {
      nextUsers.push({
        id: `user-ngo-${Date.now()}`,
        email: ngo.email,
        role: 'ngo',
        name: `${ngo.authorizedRepresentative} (${ngo.ngoName})`,
        status: ngo.verificationStatus,
        ngoId: ngo.id,
        createdAt: new Date().toISOString(),
      });
    }
    const next = {
      ...store,
      ngos: [ngo, ...store.ngos],
      users: nextUsers,
    };
    saveStoredData(next);
    setStore(next);
    logActivity('ngo', ngo.authorizedRepresentative, 'NGO Added', `Added partner NGO ${ngo.ngoName}`);
    showToast('NGO Added', `"${ngo.ngoName}" added successfully.`, 'success');
  };

  const updateNGO = (id: string, partial: Partial<NGOProfile>) => {
    const ngo = store.ngos.find((n) => n.id === id);
    const next = {
      ...store,
      ngos: store.ngos.map((n) => (n.id === id ? { ...n, ...partial } : n)),
      users: partial.verificationStatus
        ? store.users.map((user) =>
            user.ngoId === id ? { ...user, status: partial.verificationStatus! } : user
          )
        : store.users,
    };
    saveStoredData(next);
    setStore(next);
    showToast(
      partial.verificationStatus === 'approved' ? 'NGO Approved' : 'NGO Updated',
      partial.verificationStatus === 'approved'
        ? `${ngo?.ngoName || 'NGO'} can now sign in to the NGO portal.`
        : 'NGO details updated.',
      'success'
    );
  };

  const deleteNGO = (id: string) => {
    const target = store.ngos.find((n) => n.id === id);
    const next = {
      ...store,
      ngos: store.ngos.filter((n) => n.id !== id),
    };
    saveStoredData(next);
    setStore(next);
    showToast('NGO Removed', `"${target?.ngoName}" removed.`, 'info');
  };

  // Complaint Operations
  const addComplaint = (comp: ComplaintDispute) => {
    const next = {
      ...store,
      complaints: [comp, ...store.complaints],
    };
    saveStoredData(next);
    setStore(next);
    showToast('Incident Reported', 'Dispute notice logged with Central Directorate.', 'info');
  };

  const resolveComplaint = (id: string, notes: string) => {
    const next = {
      ...store,
      complaints: store.complaints.map((c) =>
        c.id === id ? { ...c, status: 'Resolved' as const, resolutionNotes: notes } : c
      ),
    };
    saveStoredData(next);
    setStore(next);
    showToast('Dispute Resolved', 'Complaint marked resolved.', 'success');
  };

  // Switch to blank clean slate
  const switchToBlankSlate = () => {
    const blank = clearToBlankSlate();
    setStore(blank);
    showToast('Clean Workspace Activated', 'Sample simulated data cleared. Ready for your real data!', 'info');
  };

  const restoreSampleData = () => {
    const reset = resetToDefaultData();
    setStore(reset);
    showToast('Sample Data Restored', 'Verified sample government schools and equipment loaded.', 'success');
  };

  const stats = calculatePlatformStats(store);

  return (
    <DataContext.Provider
      value={{
        store,
        stats,
        isCleanMode,
        addResource,
        updateResource,
        deleteResource,
        addRequirement,
        updateRequirement,
        deleteRequirement,
        addTransaction,
        updateTransaction,
        addDonation,
        updateDonation,
        addSchool,
        updateSchool,
        deleteSchool,
        addNGO,
        updateNGO,
        deleteNGO,
        addComplaint,
        resolveComplaint,
        switchToBlankSlate,
        restoreSampleData,
        showToast,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
