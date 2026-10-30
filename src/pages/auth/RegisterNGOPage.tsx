import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DemoSwitcherBanner } from '../../components/common/DemoSwitcherBanner';
import { ResourceCategory } from '../../types';
import {
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const ALL_CATEGORIES: ResourceCategory[] = [
  'Computers and IT',
  'Furniture',
  'Educational Materials',
  'Laboratory Equipment',
  'Sports Equipment',
  'Infrastructure',
  'Other School Resources',
];

const COMMON_AREAS_OF_SUPPORT = [
  'Digital Inclusion & Coding Labs',
  'STEM Practical Experiments',
  'Library Books & Literacy',
  'Ergonomic Classroom Desks',
  'Sports Kits & Physical Education',
  'Clean Drinking Water & Sanitation',
];

export const RegisterNGOPage: React.FC = () => {
  const navigate = useNavigate();
  const { registerNGO } = useAuth();

  const [ngoName, setNgoName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [authorizedRepresentative, setAuthorizedRepresentative] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('Karnataka');
  const [district, setDistrict] = useState('Bengaluru Urban');
  const [address, setAddress] = useState('');
  const [selectedAreas, setSelectedAreas] = useState<string[]>([
    'Digital Inclusion & Coding Labs',
    'STEM Practical Experiments',
  ]);
  const [selectedCategories, setSelectedCategories] = useState<ResourceCategory[]>([
    'Computers and IT',
    'Laboratory Equipment',
  ]);
  const [password, setPassword] = useState('ngo123');
  const [confirmPassword, setConfirmPassword] = useState('ngo123');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const fillSampleData = () => {
    setNgoName('Prathamik Shiksha Vikas Foundation');
    setRegistrationNumber('NGO-KA-2023-' + Math.floor(1000 + Math.random() * 9000));
    setAuthorizedRepresentative('Kavita S. Rao');
    setEmail('partnerships.psvf.' + Math.floor(Math.random() * 1000) + '@ngo.org');
    setPhone('+91 98451 ' + Math.floor(10000 + Math.random() * 90000));
    setState('Karnataka');
    setDistrict('Bengaluru Urban');
    setAddress('84, 5th Main Road, Jayanagar 4th Block, Bengaluru - 560011');
    setSelectedAreas([
      'Digital Inclusion & Coding Labs',
      'STEM Practical Experiments',
      'Library Books & Literacy',
    ]);
    setSelectedCategories(['Computers and IT', 'Educational Materials', 'Laboratory Equipment']);
    setPassword('ngo123');
    setConfirmPassword('ngo123');
    setAcceptedTerms(true);
    setFormErrors({});
    setGeneralError(null);
  };

  const toggleCategory = (cat: ResourceCategory) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const toggleArea = (area: string) => {
    if (selectedAreas.includes(area)) {
      setSelectedAreas(selectedAreas.filter((a) => a !== area));
    } else {
      setSelectedAreas([...selectedAreas, area]);
    }
  };

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!ngoName.trim()) errors.ngoName = 'Organization Name is required.';
    if (!registrationNumber.trim()) errors.registrationNumber = 'NGO Registration Number is required.';
    if (!authorizedRepresentative.trim()) errors.authorizedRepresentative = 'Authorized Representative Name is required.';

    if (!email.trim()) {
      errors.email = 'Official organization email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Valid email address format is required.';
    }

    if (!phone.trim()) {
      errors.phone = 'Contact number is required.';
    }

    if (!state.trim()) errors.state = 'State is required.';
    if (!district.trim()) errors.district = 'District is required.';
    if (!address.trim()) errors.address = 'Registered address is required.';

    if (selectedCategories.length === 0) {
      errors.categories = 'Please select at least one resource category you plan to support.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (!acceptedTerms) {
      errors.acceptedTerms = 'You must accept the donation charter and transparency agreements.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validate()) return;

    const res = registerNGO(
      {
        ngoName,
        registrationNumber,
        authorizedRepresentative,
        email,
        phone,
        state,
        district,
        address,
        areasOfSupport: selectedAreas,
        resourceCategoriesSupported: selectedCategories,
      },
      password
    );

    if (res.success) {
      navigate('/ngo');
    } else {
      setGeneralError(res.error || 'Failed to submit NGO registration.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <DemoSwitcherBanner />

      <div className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800 mb-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>School Resource Hub</span>
              </Link>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                NGO & Philanthropic Partner Registration
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Register your non-profit or CSR foundation to support government schools with essential materials.
              </p>
            </div>

            <button
              type="button"
              onClick={fillSampleData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-semibold border border-amber-200 transition-colors self-start sm:self-auto shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Fill Sample NGO Data</span>
            </button>
          </div>

          {generalError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{generalError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
            {/* 1. Organization Details */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-amber-600" />
                <span>1. Organization Profile</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Organization / Trust / Foundation Name *
                  </label>
                  <input
                    type="text"
                    value={ngoName}
                    onChange={(e) => setNgoName(e.target.value)}
                    placeholder="e.g. Shiksha Setu Foundation"
                    className={`w-full px-3 py-2 border rounded-lg text-xs outline-hidden ${
                      formErrors.ngoName ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.ngoName && (
                    <span className="text-[11px] text-red-600 mt-1 block">{formErrors.ngoName}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Registration / Society / Trust Number *
                  </label>
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    placeholder="e.g. NGO-MH-2019-8842"
                    className={`w-full px-3 py-2 border rounded-lg text-xs font-mono outline-hidden ${
                      formErrors.registrationNumber ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.registrationNumber && (
                    <span className="text-[11px] text-red-600 mt-1 block">{formErrors.registrationNumber}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Authorized Representative Full Name *
                  </label>
                  <input
                    type="text"
                    value={authorizedRepresentative}
                    onChange={(e) => setAuthorizedRepresentative(e.target.value)}
                    placeholder="e.g. Anand Verma"
                    className={`w-full px-3 py-2 border rounded-lg text-xs outline-hidden ${
                      formErrors.authorizedRepresentative ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.authorizedRepresentative && (
                    <span className="text-[11px] text-red-600 mt-1 block">
                      {formErrors.authorizedRepresentative}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@organization.org"
                    className={`w-full px-3 py-2 border rounded-lg text-xs outline-hidden ${
                      formErrors.email ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.email && (
                    <span className="text-[11px] text-red-600 mt-1 block">{formErrors.email}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98111 22334"
                    className={`w-full px-3 py-2 border rounded-lg text-xs outline-hidden ${
                      formErrors.phone ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.phone && (
                    <span className="text-[11px] text-red-600 mt-1 block">{formErrors.phone}</span>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Registered Address */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                2. Registered Headquarters
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">State *</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">District *</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Registered Address *
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Office suite, street, postal code"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* 3. Resource Categories & Areas of Support */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                3. Focus Areas & Supported Resource Categories
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Resource Categories You Can Supply / Donate *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ALL_CATEGORIES.map((cat) => (
                      <label
                        key={cat}
                        className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                          selectedCategories.includes(cat)
                            ? 'bg-teal-50 border-teal-500 text-teal-900 font-medium'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat)}
                          onChange={() => toggleCategory(cat)}
                          className="rounded border-slate-300 text-teal-700 focus:ring-teal-700"
                        />
                        <span>{cat}</span>
                      </label>
                    ))}
                  </div>
                  {formErrors.categories && (
                    <span className="text-[11px] text-red-600 mt-1 block">{formErrors.categories}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Primary Philanthropic Focus Areas
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {COMMON_AREAS_OF_SUPPORT.map((area) => (
                      <label
                        key={area}
                        className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                          selectedAreas.includes(area)
                            ? 'bg-amber-50 border-amber-500 text-amber-900 font-medium'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedAreas.includes(area)}
                          onChange={() => toggleArea(area)}
                          className="rounded border-slate-300 text-amber-600 focus:ring-amber-600"
                        />
                        <span>{area}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Password */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                4. Portal Credentials
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden"
                  />
                  {formErrors.password && (
                    <span className="text-[11px] text-red-600 mt-1 block">{formErrors.password}</span>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden"
                  />
                  {formErrors.confirmPassword && (
                    <span className="text-[11px] text-red-600 mt-1 block">{formErrors.confirmPassword}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-amber-600 focus:ring-amber-600"
                />
                <span>
                  I declare that our organization operates in compliance with non-profit registration regulations. All educational materials offered for donation will be authentic, safe, and designated for non-commercial student benefit.
                </span>
              </label>
              {formErrors.acceptedTerms && (
                <span className="text-[11px] text-red-600 mt-1 block">{formErrors.acceptedTerms}</span>
              )}
            </div>

            {/* Submit */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
              <Link to="/login" className="text-xs text-slate-500 hover:text-slate-800">
                Already registered? Sign In
              </Link>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <span>Submit NGO Registration</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
