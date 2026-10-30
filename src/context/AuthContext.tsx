import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, SchoolProfile, NGOProfile } from '../types';
import { getStoredData, saveStoredData, logActivity, pushNotification } from '../services/storage';

interface AuthContextType {
  currentUser: User | null;
  currentSchool: SchoolProfile | null;
  currentNGO: NGOProfile | null;
  isLoading: boolean;
  login: (email: string, role: User['role'], password?: string) => { success: boolean; error?: string };
  logout: () => void;
  switchUserById: (userId: string) => boolean;
  loginAsRole: (role: User['role']) => boolean;
  registerSchool: (schoolData: Omit<SchoolProfile, 'id' | 'verificationStatus' | 'registrationDate'>, password?: string) => { success: boolean; error?: string; schoolId?: string };
  registerNGO: (ngoData: Omit<NGOProfile, 'id' | 'verificationStatus' | 'registrationDate'>, password?: string) => { success: boolean; error?: string; ngoId?: string };
  refreshSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_SESSION_KEY = 'school_resource_hub_current_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentSchool, setCurrentSchool] = useState<SchoolProfile | null>(null);
  const [currentNGO, setCurrentNGO] = useState<NGOProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncProfiles = (user: User | null) => {
    if (!user) {
      setCurrentSchool(null);
      setCurrentNGO(null);
      return;
    }
    const store = getStoredData();
    if (user.role === 'school' && user.schoolId) {
      const school = store.schools.find((s) => s.id === user.schoolId) || null;
      setCurrentSchool(school);
      setCurrentNGO(null);
    } else if (user.role === 'ngo' && user.ngoId) {
      const ngo = store.ngos.find((n) => n.id === user.ngoId) || null;
      setCurrentNGO(ngo);
      setCurrentSchool(null);
    } else {
      setCurrentSchool(null);
      setCurrentNGO(null);
    }
  };

  useEffect(() => {
    try {
      const savedUserId = localStorage.getItem(CURRENT_USER_SESSION_KEY);
      if (savedUserId) {
        const store = getStoredData();
        const found = store.users.find((u) => u.id === savedUserId);
        if (found) {
          setCurrentUser(found);
          syncProfiles(found);
        }
      }
    } catch (e) {
      console.error('Session load error', e);
    } finally {
      setIsLoading(false);
    }

    const handleStorageUpdate = () => {
      const store = getStoredData();
      if (currentUser) {
        const updated = store.users.find((u) => u.id === currentUser.id);
        if (updated) {
          setCurrentUser(updated);
          syncProfiles(updated);
        }
      }
    };

    window.addEventListener('school_hub_storage_updated', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);
    return () => {
      window.removeEventListener('school_hub_storage_updated', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, [currentUser?.id]);

  const login = (email: string, role: User['role'], _password?: string) => {
    const store = getStoredData();
    const user = store.users.find(
      (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase()
    );

    if (!user) {
      return { success: false, error: 'No account registered with this email address.' };
    }

    if (user.role !== role) {
      return {
        success: false,
        error: `This email is registered as "${user.role.toUpperCase()}", not "${role.toUpperCase()}". Please select the correct role tab.`,
      };
    }

    if (user.status === 'suspended') {
      return {
        success: false,
        error: 'This account has been suspended by the Central Administrator. Please contact support.',
      };
    }

    if (user.status === 'rejected') {
      return {
        success: false,
        error: 'Your registration was reviewed and not approved by the Central Administrator.',
      };
    }

    // Set user
    setCurrentUser(user);
    syncProfiles(user);
    localStorage.setItem(CURRENT_USER_SESSION_KEY, user.id);
    logActivity(user.role, user.name, 'User Sign In', `${user.name} logged into the platform portal.`);

    return { success: true };
  };

  const switchUserById = (userId: string): boolean => {
    const store = getStoredData();
    const found = store.users.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
      syncProfiles(found);
      localStorage.setItem(CURRENT_USER_SESSION_KEY, found.id);
      return true;
    }
    return false;
  };

  const loginAsRole = (role: User['role']): boolean => {
    const store = getStoredData();
    const targetUser =
      store.users.find((u) => u.role === role && u.status === 'approved') ||
      store.users.find((u) => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
      syncProfiles(targetUser);
      localStorage.setItem(CURRENT_USER_SESSION_KEY, targetUser.id);
      logActivity(targetUser.role, targetUser.name, 'Role Quick Switch', `Switched session to ${role.toUpperCase()}`);
      return true;
    }
    return false;
  };

  const logout = () => {
    if (currentUser) {
      logActivity(currentUser.role, currentUser.name, 'User Sign Out', `${currentUser.name} signed out.`);
    }
    setCurrentUser(null);
    setCurrentSchool(null);
    setCurrentNGO(null);
    localStorage.removeItem(CURRENT_USER_SESSION_KEY);
  };

  const registerSchool = (
    schoolData: Omit<SchoolProfile, 'id' | 'verificationStatus' | 'registrationDate'>,
    _password?: string
  ) => {
    const store = getStoredData();
    // Validate unique email
    const emailExists = store.users.some(
      (u) => u.email.trim().toLowerCase() === schoolData.email.trim().toLowerCase()
    );
    if (emailExists) {
      return { success: false, error: 'A user account with this email already exists.' };
    }

    // Validate unique UDISE code
    const udiseExists = store.schools.some(
      (s) => s.udiseCode.trim() === schoolData.udiseCode.trim()
    );
    if (udiseExists) {
      return { success: false, error: 'A school with this UDISE code is already registered in the system.' };
    }

    const schoolId = `school-${Date.now()}`;
    const userId = `user-school-${Date.now()}`;

    const newSchool: SchoolProfile = {
      ...schoolData,
      id: schoolId,
      verificationStatus: 'pending',
      registrationDate: new Date().toISOString().split('T')[0],
    };

    const newUser: User = {
      id: userId,
      email: schoolData.email,
      role: 'school',
      name: `${schoolData.principalName} (${schoolData.schoolName})`,
      status: 'pending',
      schoolId: schoolId,
      createdAt: new Date().toISOString(),
    };

    store.schools.push(newSchool);
    store.users.push(newUser);
    saveStoredData(store);

    logActivity('school', newSchool.principalName, 'School Registration Submitted', `New school registration for ${newSchool.schoolName} (UDISE: ${newSchool.udiseCode}).`);
    pushNotification(
      'admin',
      'user-admin-1',
      'New School Pending Verification',
      `${newSchool.schoolName} (${newSchool.district}, ${newSchool.state}) submitted registration.`,
      '/admin/schools'
    );

    // Auto-login to pending state so school sees their verification banner & profile
    setCurrentUser(newUser);
    setCurrentSchool(newSchool);
    localStorage.setItem(CURRENT_USER_SESSION_KEY, newUser.id);

    return { success: true, schoolId };
  };

  const registerNGO = (
    ngoData: Omit<NGOProfile, 'id' | 'verificationStatus' | 'registrationDate'>,
    _password?: string
  ) => {
    const store = getStoredData();
    // Validate unique email
    const emailExists = store.users.some(
      (u) => u.email.trim().toLowerCase() === ngoData.email.trim().toLowerCase()
    );
    if (emailExists) {
      return { success: false, error: 'A user account with this email already exists.' };
    }

    // Validate unique registration number
    const regExists = store.ngos.some(
      (n) => n.registrationNumber.trim().toLowerCase() === ngoData.registrationNumber.trim().toLowerCase()
    );
    if (regExists) {
      return { success: false, error: 'An NGO with this Registration Number is already registered.' };
    }

    const ngoId = `ngo-${Date.now()}`;
    const userId = `user-ngo-${Date.now()}`;

    const newNGO: NGOProfile = {
      ...ngoData,
      id: ngoId,
      verificationStatus: 'pending',
      registrationDate: new Date().toISOString().split('T')[0],
    };

    const newUser: User = {
      id: userId,
      email: ngoData.email,
      role: 'ngo',
      name: `${ngoData.authorizedRepresentative} (${ngoData.ngoName})`,
      status: 'pending',
      ngoId: ngoId,
      createdAt: new Date().toISOString(),
    };

    store.ngos.push(newNGO);
    store.users.push(newUser);
    saveStoredData(store);

    logActivity('ngo', newNGO.authorizedRepresentative, 'NGO Registration Submitted', `New NGO registration for ${newNGO.ngoName} (Reg: ${newNGO.registrationNumber}).`);
    pushNotification(
      'admin',
      'user-admin-1',
      'New NGO Pending Verification',
      `${newNGO.ngoName} registered under ${newNGO.state} education desk.`,
      '/admin/ngos'
    );

    // Auto-login to pending state so NGO sees their verification status
    setCurrentUser(newUser);
    setCurrentNGO(newNGO);
    localStorage.setItem(CURRENT_USER_SESSION_KEY, newUser.id);

    return { success: true, ngoId };
  };

  const refreshSession = () => {
    const store = getStoredData();
    if (currentUser) {
      const updated = store.users.find((u) => u.id === currentUser.id);
      if (updated) {
        setCurrentUser(updated);
        syncProfiles(updated);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentSchool,
        currentNGO,
        isLoading,
        login,
        logout,
        switchUserById,
        loginAsRole,
        registerSchool,
        registerNGO,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
