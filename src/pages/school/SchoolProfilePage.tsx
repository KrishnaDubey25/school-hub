import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStoredData, saveStoredData, logActivity } from '../../services/storage';
import { CameraUploadModal } from '../../components/common/CameraUploadModal';
import {
  School,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Camera,
  MapPin,
  Mail,
  Phone,
  Users,
  Check,
} from 'lucide-react';

export const SchoolProfilePage: React.FC = () => {
  const { currentSchool, currentUser, refreshSession } = useAuth();
  const [store, setStore] = useState(getStoredData());

  const school = currentSchool || store.schools[0];

  const [principalName, setPrincipalName] = useState(school?.principalName || '');
  const [phone, setPhone] = useState(school?.phone || '');
  const [studentCount, setStudentCount] = useState<number>(school?.studentCount || 0);
  const [address, setAddress] = useState(school?.address || '');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(school?.photoUrl);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!school) return;

    const updated = {
      ...store,
      schools: store.schools.map((s) =>
        s.id === school.id
          ? {
              ...s,
              principalName,
              phone,
              studentCount: Number(studentCount),
              address,
              photoUrl,
            }
          : s
      ),
    };

    saveStoredData(updated);
    setStore(updated);
    refreshSession();
    logActivity('school', school.schoolName, 'School Profile Updated', 'Updated principal contact and enrollment info');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            School Institutional Profile
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified government school details, administrative contact records, and enrollment data.
          </p>
        </div>

        <span
          className={`self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize ${
            school?.verificationStatus === 'approved'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}
        >
          {school?.verificationStatus === 'approved' ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          )}
          <span>Status: {school?.verificationStatus}</span>
        </span>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>School institutional profile updated successfully.</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        {/* Campus Photo */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Campus Photograph
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-40 aspect-4/3 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
              {photoUrl ? (
                <img src={photoUrl} alt="Campus" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                  No Image
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setCameraOpen(true)}
              className="px-3.5 py-2 border border-slate-300 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5"
            >
              <Camera className="w-4 h-4 text-teal-700" />
              <span>{photoUrl ? 'Replace Photo (Camera / Upload)' : 'Capture or Upload Photo'}</span>
            </button>
          </div>
        </div>

        {/* Readonly UDISE & School Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Official School Name
            </label>
            <input
              type="text"
              disabled
              value={school?.schoolName || ''}
              className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-600 rounded-lg text-xs font-medium cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              UDISE+ Code (Government Registry)
            </label>
            <input
              type="text"
              disabled
              value={school?.udiseCode || ''}
              className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-600 rounded-lg text-xs font-mono font-bold cursor-not-allowed"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
            <input
              type="text"
              disabled
              value={school?.state || ''}
              className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-600 rounded-lg text-xs cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">District</label>
            <input
              type="text"
              disabled
              value={school?.district || ''}
              className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-600 rounded-lg text-xs cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Taluka / Block</label>
            <input
              type="text"
              disabled
              value={school?.cityOrTaluka || ''}
              className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-600 rounded-lg text-xs cursor-not-allowed"
            />
          </div>
        </div>

        {/* Editable Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Principal / Headmaster Name *
            </label>
            <input
              type="text"
              required
              value={principalName}
              onChange={(e) => setPrincipalName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contact Phone Number *
            </label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Total Enrolled Students *
            </label>
            <input
              type="number"
              min={0}
              required
              value={studentCount}
              onChange={(e) => setStudentCount(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Registered School Email
            </label>
            <input
              type="text"
              disabled
              value={school?.email || ''}
              className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-600 rounded-lg text-xs cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Complete Postal Address *
          </label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Save Profile Updates</span>
          </button>
        </div>
      </form>

      <CameraUploadModal
        isOpen={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onImageSelected={(url) => setPhotoUrl(url)}
        currentImage={photoUrl}
        title="Update School Campus Photograph"
      />
    </div>
  );
};
