import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DemoSwitcherBanner } from '../../components/common/DemoSwitcherBanner';
import { CameraUploadModal } from '../../components/common/CameraUploadModal';
import { SchoolType } from '../../types';
import {
  School,
  ShieldCheck,
  Camera,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const RegisterSchoolPage: React.FC = () => {
  const navigate = useNavigate();
  const { registerSchool } = useAuth();

  const [schoolName, setSchoolName] = useState('');
  const [udiseCode, setUdiseCode] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [district, setDistrict] = useState('Pune');
  const [cityOrTaluka, setCityOrTaluka] = useState('');
  const [address, setAddress] = useState('');
  const [principalName, setPrincipalName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [schoolType, setSchoolType] = useState<SchoolType>('Secondary');
  const [studentCount, setStudentCount] = useState<number | ''>(450);
  const [password, setPassword] = useState('school123');
  const [confirmPassword, setConfirmPassword] = useState('school123');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);

  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const fillSampleData = () => {
    setSchoolName('Govt Secondary School, Shantinagar');
    setUdiseCode('272504' + Math.floor(10000 + Math.random() * 90000));
    setState('Maharashtra');
    setDistrict('Pune');
    setCityOrTaluka('Haveli');
    setAddress('Plot 15, Near Gram Panchayat Office, Shantinagar, Pune - 412207');
    setPrincipalName('Dr. Madhavrao Kadam');
    setPhone('+91 98230 ' + Math.floor(10000 + Math.random() * 90000));
    setEmail('principal.shantinagar.' + Math.floor(Math.random() * 1000) + '@gov.in');
    setSchoolType('Secondary');
    setStudentCount(520);
    setPassword('school123');
    setConfirmPassword('school123');
    setAcceptedTerms(true);
    setPhotoUrl('/src/assets/images/school_classroom_students_1793261016320.jpg');
    setFormErrors({});
    setGeneralError(null);
  };

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!schoolName.trim()) errors.schoolName = 'School Name is required.';
    if (!udiseCode.trim()) {
      errors.udiseCode = 'UDISE code is required.';
    } else if (!/^\d{11}$/.test(udiseCode.trim())) {
      errors.udiseCode = 'UDISE code must be exactly 11 digits (e.g. 27250204502).';
    }

    if (!state.trim()) errors.state = 'State is required.';
    if (!district.trim()) errors.district = 'District is required.';
    if (!cityOrTaluka.trim()) errors.cityOrTaluka = 'City or Taluka is required.';
    if (!address.trim()) errors.address = 'Complete school postal address is required.';
    if (!principalName.trim()) errors.principalName = 'Principal / Headmaster name is required.';

    if (!phone.trim()) {
      errors.phone = 'Contact number is required.';
    } else if (phone.replace(/\D/g, '').length < 10) {
      errors.phone = 'Valid 10-digit phone number is required.';
    }

    if (!email.trim()) {
      errors.email = 'Institutional email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Valid email address format is required.';
    }

    if (studentCount === '' || Number(studentCount) < 0) {
      errors.studentCount = 'Student enrollment must be a positive integer.';
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
      errors.acceptedTerms = 'You must accept the resource sharing code and platform terms.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validate()) return;

    const res = registerSchool(
      {
        schoolName,
        udiseCode,
        state,
        district,
        cityOrTaluka,
        address,
        principalName,
        phone,
        email,
        schoolType,
        studentCount: Number(studentCount),
        photoUrl,
      },
      password
    );

    if (res.success) {
      navigate('/school');
    } else {
      setGeneralError(res.error || 'Failed to register school.');
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
                Government School Institutional Registration
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Register your school to catalog surplus assets, borrow lab & IT gear, and receive educational donations.
              </p>
            </div>

            <button
              type="button"
              onClick={fillSampleData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg text-xs font-semibold border border-teal-200 transition-colors self-start sm:self-auto shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Fill Sample School Data</span>
            </button>
          </div>

          {generalError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{generalError}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
            {/* Section 1: School Identity */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <School className="w-4 h-4 text-teal-700" />
                <span>1. Institution Identification</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official School Name *
                  </label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="e.g. Govt Model Higher Secondary School"
                    className={`w-full px-3 py-2 border rounded-lg text-xs outline-hidden ${
                      formErrors.schoolName ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.schoolName && (
                    <span className="text-[11px] text-red-600 mt-1 block">{formErrors.schoolName}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    UDISE+ Code (11 digits) *
                  </label>
                  <input
                    type="text"
                    maxLength={11}
                    value={udiseCode}
                    onChange={(e) => setUdiseCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 27250204502"
                    className={`w-full px-3 py-2 border rounded-lg text-xs font-mono outline-hidden ${
                      formErrors.udiseCode ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.udiseCode && (
                    <span className="text-[11px] text-red-600 mt-1 block">{formErrors.udiseCode}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    School Level / Type *
                  </label>
                  <select
                    value={schoolType}
                    onChange={(e) => setSchoolType(e.target.value as SchoolType)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden bg-white text-slate-900"
                  >
                    <option value="Primary">Primary (Class 1-5)</option>
                    <option value="Upper Primary">Upper Primary (Class 6-8)</option>
                    <option value="Secondary">Secondary (Class 9-10)</option>
                    <option value="Higher Secondary">Higher Secondary (Class 11-12)</option>
                    <option value="Composite">Composite (Class 1-12)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Total Enrolled Students *
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={studentCount}
                    onChange={(e) => setStudentCount(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 850"
                    className={`w-full px-3 py-2 border rounded-lg text-xs outline-hidden ${
                      formErrors.studentCount ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.studentCount && (
                    <span className="text-[11px] text-red-600 mt-1 block">{formErrors.studentCount}</span>
                  )}
                </div>

                {/* School Photograph */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Campus Photograph (Optional)
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCameraModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium"
                    >
                      <Camera className="w-3.5 h-3.5 text-teal-600" />
                      <span>{photoUrl ? 'Replace Photo' : 'Upload / Camera'}</span>
                    </button>
                    {photoUrl && (
                      <span className="text-xs text-emerald-700 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-4 h-4" /> Attached
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Location & Address */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                2. Geographical Location
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">State *</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">District *</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="District"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City / Taluka / Block *
                  </label>
                  <input
                    type="text"
                    value={cityOrTaluka}
                    onChange={(e) => setCityOrTaluka(e.target.value)}
                    placeholder="Taluka / Block"
                    className={`w-full px-3 py-2 border rounded-lg text-xs outline-hidden ${
                      formErrors.cityOrTaluka ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.cityOrTaluka && (
                    <span className="text-[11px] text-red-600 mt-1 block">{formErrors.cityOrTaluka}</span>
                  )}
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Complete Postal Address *
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Campus street address with PIN code"
                    className={`w-full px-3 py-2 border rounded-lg text-xs outline-hidden ${
                      formErrors.address ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.address && (
                    <span className="text-[11px] text-red-600 mt-1 block">{formErrors.address}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Principal & Authentication */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                3. Authorized Representative & Access Credentials
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Principal / Authorized Representative *
                  </label>
                  <input
                    type="text"
                    value={principalName}
                    onChange={(e) => setPrincipalName(e.target.value)}
                    placeholder="Full Name"
                    className={`w-full px-3 py-2 border rounded-lg text-xs outline-hidden ${
                      formErrors.principalName ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.principalName && (
                    <span className="text-[11px] text-red-600 mt-1 block">{formErrors.principalName}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className={`w-full px-3 py-2 border rounded-lg text-xs outline-hidden ${
                      formErrors.phone ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.phone && (
                    <span className="text-[11px] text-red-600 mt-1 block">{formErrors.phone}</span>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official School Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="principal.school@gov.in"
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
                    Password *
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-xs outline-hidden ${
                      formErrors.password ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                    }`}
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
                    className={`w-full px-3 py-2 border rounded-lg text-xs outline-hidden ${
                      formErrors.confirmPassword ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.confirmPassword && (
                    <span className="text-[11px] text-red-600 mt-1 block">{formErrors.confirmPassword}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-teal-700 focus:ring-teal-700"
                />
                <span>
                  I certify that I am the authorized representative of this government educational institution. I agree to comply with the Central Resource Management Guidelines and maintain accountability for borrowed items.
                </span>
              </label>
              {formErrors.acceptedTerms && (
                <span className="text-[11px] text-red-600 mt-1 block">{formErrors.acceptedTerms}</span>
              )}
            </div>

            {/* Submit button */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
              <Link to="/login" className="text-xs text-slate-500 hover:text-slate-800">
                Already registered? Sign In
              </Link>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <span>Submit School Registration</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Camera modal for school photograph */}
      <CameraUploadModal
        isOpen={cameraModalOpen}
        onClose={() => setCameraModalOpen(false)}
        onImageSelected={(url) => setPhotoUrl(url)}
        currentImage={photoUrl}
        title="School Campus / Facility Photograph"
      />
    </div>
  );
};
