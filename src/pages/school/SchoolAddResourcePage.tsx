import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { CameraUploadModal } from '../../components/common/CameraUploadModal';
import { ResourceCategory, ResourceCondition, ResourceItem } from '../../types';
import {
  Boxes,
  Camera,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react';

const CATEGORIES: ResourceCategory[] = [
  'Computers and IT',
  'Furniture',
  'Educational Materials',
  'Laboratory Equipment',
  'Sports Equipment',
  'Infrastructure',
  'Other School Resources',
];

export const SchoolAddResourcePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentSchool, currentUser } = useAuth();
  const { addResource } = useData();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ResourceCategory>('Computers and IT');
  const [description, setDescription] = useState('');
  const [totalQuantity, setTotalQuantity] = useState<number | ''>(5);
  const [condition, setCondition] = useState<ResourceCondition>('Good');
  const [location, setLocation] = useState('Central Campus Storage Room');
  const [lendingAvailability, setLendingAvailability] = useState(true);
  const [lendingNotes, setLendingNotes] = useState('Available for inter-school rotation for up to 6 months.');
  const [photograph, setPhotograph] = useState<string | undefined>(undefined);

  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fillSampleResource = () => {
    setName('Lenovo ThinkCentre Workstations with 19-inch LED Monitors');
    setCategory('Computers and IT');
    setDescription('Surplus desktop sets upgraded from the primary lab. Tested, operational, includes keyboards and optical mice.');
    setTotalQuantity(8);
    setCondition('Good');
    setLocation('Computer Science Annex Room 104');
    setLendingAvailability(true);
    setLendingNotes('Available for academic session borrowing; schools must provide safe transport cartons.');
    setPhotograph('/src/assets/images/hero_school_resource_hub_1793261016040.jpg');
    setErrors({});
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Resource Name is required.';
    if (!description.trim()) errs.description = 'Resource description is required.';
    if (totalQuantity === '' || Number(totalQuantity) <= 0) {
      errs.totalQuantity = 'Total Quantity must be at least 1 unit.';
    }
    if (!location.trim()) errs.location = 'Campus location is required.';

    if (condition === 'Damaged' && lendingAvailability) {
      errs.condition = 'Damaged items cannot be made available for ordinary student borrowing.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) return;

    if (currentUser?.status === 'pending') {
      setErrorMessage('Your school account is currently pending verification. Unverified schools cannot publish surplus for lending.');
      return;
    }

    const schoolId = currentSchool?.id || currentUser?.schoolId || 'school-1';
    const schoolName = currentSchool?.schoolName || currentUser?.name || 'Government School';
    const schoolDistrict = currentSchool?.district || 'District';
    const schoolState = currentSchool?.state || 'State';

    const qty = Number(totalQuantity);
    const newResource: ResourceItem = {
      id: `res-${Date.now()}`,
      providerSchoolId: schoolId,
      providerSchoolName: schoolName,
      providerDistrict: schoolDistrict,
      providerState: schoolState,
      name,
      category,
      description,
      totalQuantity: qty,
      availableQuantity: qty,
      reservedQuantity: 0,
      condition,
      photograph,
      location,
      availabilityStatus: condition === 'Needs Repair' ? 'Under Maintenance' : 'Available',
      lendingAvailability,
      lendingNotes: lendingAvailability ? lendingNotes : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addResource(newResource);
    navigate('/school/resources');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Catalog Surplus Educational Asset
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            List idle computers, excess desks, textbooks, or lab apparatus for inter-school borrowing.
          </p>
        </div>

        <button
          type="button"
          onClick={fillSampleResource}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg text-xs font-semibold border border-teal-200 transition-colors self-start sm:self-auto shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Fill Sample Resource</span>
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Resource Name & Specifications *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Dell OptiPlex Desktop Workstations with Keyboards"
            className={`w-full px-3 py-2 border rounded-lg text-xs outline-hidden ${
              errors.name ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
            }`}
          />
          {errors.name && <span className="text-[11px] text-red-600 mt-1 block">{errors.name}</span>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Resource Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ResourceCategory)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden bg-white text-slate-900"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Total Surplus Quantity Available *
            </label>
            <input
              type="number"
              min={1}
              value={totalQuantity}
              onChange={(e) => setTotalQuantity(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g. 10"
              className={`w-full px-3 py-2 border rounded-lg text-xs outline-hidden font-mono ${
                errors.totalQuantity ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
              }`}
            />
            {errors.totalQuantity && (
              <span className="text-[11px] text-red-600 mt-1 block">{errors.totalQuantity}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Physical Condition Rating *
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as ResourceCondition)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden bg-white text-slate-900"
            >
              <option value="New">New (Unopened / Mint condition)</option>
              <option value="Good">Good (Tested, functional with minor normal wear)</option>
              <option value="Needs Repair">Needs Repair (Requires maintenance before student use)</option>
              <option value="Damaged">Damaged (Unfit for loan)</option>
            </select>
            {errors.condition && (
              <span className="text-[11px] text-red-600 mt-1 block">{errors.condition}</span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Campus Storage Location *
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Science Block Room 102"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Detailed Description & Included Accessories *
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Specify brand, model, electrical requirements, user manuals, packaging..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden"
          />
        </div>

        {/* Camera / File Photograph Upload */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Item Photograph / Condition Proof
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              type="button"
              onClick={() => setCameraModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors"
            >
              <Camera className="w-4 h-4 text-teal-600" />
              <span>{photograph ? 'Change Photo / Take New Shot' : 'Capture or Upload Photograph'}</span>
            </button>

            {photograph ? (
              <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>Photograph attached ({condition} condition)</span>
              </div>
            ) : (
              <span className="text-xs text-slate-400">
                Recommended: Provide photographic evidence for district transparency.
              </span>
            )}
          </div>

          {photograph && (
            <div className="mt-3 aspect-16/9 max-w-xs rounded-lg overflow-hidden border border-slate-200">
              <img src={photograph} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Lending Availability Toggle */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
            <input
              type="checkbox"
              checked={lendingAvailability}
              onChange={(e) => setLendingAvailability(e.target.checked)}
              className="rounded border-slate-300 text-teal-700 focus:ring-teal-700"
            />
            <span>Make this surplus available for Inter-School Borrowing</span>
          </label>

          {lendingAvailability && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lending Notes / Seasonal Terms
              </label>
              <input
                type="text"
                value={lendingNotes}
                onChange={(e) => setLendingNotes(e.target.value)}
                placeholder="e.g. Loanable for exam practical periods up to 90 days."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden bg-white"
              />
            </div>
          )}
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate('/school/resources')}
            className="py-2 px-4 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="py-2 px-5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <span>Publish Resource to Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      <CameraUploadModal
        isOpen={cameraModalOpen}
        onClose={() => setCameraModalOpen(false)}
        onImageSelected={(url) => setPhotograph(url)}
        currentImage={photograph}
        title="Capture Resource Condition Photograph"
      />
    </div>
  );
};
