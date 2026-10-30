import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DemoSwitcherBanner } from '../../components/common/DemoSwitcherBanner';
import { ShieldCheck, Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const initialRole = (searchParams.get('role') as UserRole) || 'school';
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  useEffect(() => {
    const roleParam = searchParams.get('role') as UserRole;
    if (roleParam && ['admin', 'school', 'ngo'].includes(roleParam)) {
      setSelectedRole(roleParam);
      fillPresetForRole(roleParam);
    } else {
      fillPresetForRole(selectedRole);
    }
  }, [searchParams]);

  const fillPresetForRole = (role: UserRole) => {
    setErrorMessage(null);
    if (role === 'admin') {
      setEmail('admin@schoolresourcehub.gov.in');
      setPassword('admin123');
    } else if (role === 'school') {
      setEmail('principal.model19@gov.in');
      setPassword('school123');
    } else if (role === 'ngo') {
      setEmail('contact@shikshasetu.org');
      setPassword('ngo123');
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    fillPresetForRole(role);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    const result = login(email, selectedRole, password);
    if (result.success) {
      if (selectedRole === 'admin') navigate('/admin');
      else if (selectedRole === 'school') navigate('/school');
      else if (selectedRole === 'ngo') navigate('/ngo');
    } else {
      setErrorMessage(result.error || 'Failed to sign in. Please verify your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <DemoSwitcherBanner />

      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xl font-bold text-slate-900 hover:text-teal-700 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-teal-700 flex items-center justify-center text-white shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span>School Resource Hub</span>
            </Link>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Sign In to Your Portal
            </h2>
            <p className="text-xs text-slate-500">
              Select your authorized platform role to access the workspace
            </p>
          </div>

          {/* Role Tabs */}
          <div className="p-1 bg-slate-200/80 rounded-xl grid grid-cols-3 gap-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleRoleSelect('school')}
              className={`py-2 px-3 rounded-lg transition-all ${
                selectedRole === 'school'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              School
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('ngo')}
              className={`py-2 px-3 rounded-lg transition-all ${
                selectedRole === 'ngo'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              NGO Partner
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              className={`py-2 px-3 rounded-lg transition-all ${
                selectedRole === 'admin'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Administrator
            </button>
          </div>

          {/* Form Box */}
          <div className="bg-white p-7 rounded-2xl shadow-sm border border-slate-200 space-y-5">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@organization.gov.in"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-700 focus:border-teal-700 outline-hidden bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setForgotModalOpen(true);
                    }}
                    className="text-[11px] text-teal-700 hover:text-teal-800 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-9 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-700 focus:border-teal-700 outline-hidden bg-white text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-teal-700 focus:ring-teal-700"
                  />
                  <span>Remember this browser</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Sign In as {selectedRole === 'admin' ? 'Administrator' : selectedRole === 'school' ? 'School' : 'NGO'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Quick Demo Pre-fills */}
            <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-2">
              <div className="font-semibold text-slate-700 text-[11px] uppercase tracking-wider">
                Demonstration Quick Fill:
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('admin');
                    fillPresetForRole('admin');
                  }}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium"
                >
                  Admin (Central Officer)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('school');
                    setEmail('principal.model19@gov.in');
                    setPassword('school123');
                  }}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium"
                >
                  Govt Model SSS 19
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('school');
                    setEmail('new.school@gov.in');
                    setPassword('school123');
                  }}
                  className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded text-[11px] font-medium border border-amber-200"
                >
                  Pending School (Rampur)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('ngo');
                    fillPresetForRole('ngo');
                  }}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium"
                >
                  Shiksha Setu NGO
                </button>
              </div>
            </div>
          </div>

          {/* Registration Navigation */}
          <div className="text-center text-xs text-slate-600 space-y-1">
            <p>
              Need to register an institution?{' '}
              <Link to="/register-school" className="text-teal-700 font-semibold hover:underline">
                Register School
              </Link>{' '}
              or{' '}
              <Link to="/register-ngo" className="text-teal-700 font-semibold hover:underline">
                Register NGO
              </Link>
            </p>
            <p className="text-[11px] text-slate-400">
              *Central Administrator accounts are restricted and pre-provisioned.
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Demo Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Reset Portal Password</h3>
            {forgotSent ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Prototype Demonstration Simulation</span>
                </div>
                <p>
                  In this local prototype, mock reset instructions for <strong>{forgotEmail}</strong> have been simulated. In production, an authorized password recovery link is dispatched to official government email servers.
                </p>
                <button
                  onClick={() => {
                    setForgotModalOpen(false);
                    setForgotSent(false);
                  }}
                  className="w-full py-1.5 bg-slate-900 text-white rounded text-xs font-semibold"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <p className="text-slate-600">
                  Enter your registered institutional or organizational email to simulate password reset:
                </p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@school.gov.in"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-700 outline-hidden"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setForgotModalOpen(false)}
                    className="py-1.5 px-3 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setForgotSent(true)}
                    className="py-1.5 px-4 bg-teal-700 text-white rounded-lg font-semibold hover:bg-teal-800"
                  >
                    Send Reset Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
