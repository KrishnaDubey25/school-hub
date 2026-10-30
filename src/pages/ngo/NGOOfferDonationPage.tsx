import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ResourceCategory, DonationOffer } from '../../types';
import {
  Gift,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  School,
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

export const NGOOfferDonationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentNGO, currentUser } = useAuth();
  const { store, addDonation } = useData();

  const reqId = searchParams.get('reqId');
  const matchedReq = reqId ? store.requirements.find((r) => r.id === reqId) : null;

  const [targetSchoolId, setTargetSchoolId] = useState(matchedReq?.schoolId || store.schools[0]?.id || '');
  const [resourceName, setResourceName] = useState(matchedReq?.resourceName || '');
  const [category, setCategory] = useState<ResourceCategory>(matchedReq?.category || 'Computers and IT');
  const [description, setDescription] = useState(
    matchedReq
      ? `Fulfilling requirement for ${matchedReq.resourceName} posted by ${matchedReq.schoolName}.`
      : ''
  );
  const [quantityOffered, setQuantityOffered] = useState<number | ''>(
    matchedReq ? matchedReq.quantityRequired : 10
  );
  const [condition, setCondition] = useState<'New' | 'Good'>('New');
  const [estimatedValue, setEstimatedValue] = useState<number | ''>(50000);
  const [notes, setNotes] = useState('Donated under Education Inclusion CSR Project.');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (matchedReq) {
      setTargetSchoolId(matchedReq.schoolId);
      setResourceName(matchedReq.resourceName);
      setCategory(matchedReq.category);
      setQuantityOffered(matchedReq.quantityRequired);
      setDescription(`Fulfilling requirement for ${matchedReq.resourceName} posted by ${matchedReq.schoolName}.`);
    }
  }, [matchedReq]);

  const fillSampleOffer = () => {
    setResourceName('Classroom STEM Physics & Chemistry Lab Experiment Sets');
    setCategory('Laboratory Equipment');
    setDescription('Brand-new modular student experiment kits with glass test tubes, prism sets, magnets, lenses, and illustrated experiment guides in regional languages.');
    setQuantityOffered(15);
    setCondition('New');
    setEstimatedValue(35000);
    setNotes('Donated under STEM for Rural Schools CSR initiative. Ready for immediate dispatch upon administrative clearance.');
    setErrors({});
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!targetSchoolId) errs.targetSchoolId = 'Please select a beneficiary school.';
    if (!resourceName.trim()) errs.resourceName = 'Resource name is required.';
    if (!description.trim()) errs.description = 'Donation description is required.';
    if (quantityOffered === '' || Number(quantityOffered) <= 0) {
      errs.quantityOffered = 'Quantity must be at least 1 unit.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) return;

    if (currentUser?.status === 'pending') {
      setErrorMessage('Your NGO registration is currently pending administrative verification. Unverified NGOs cannot submit formal donation offers.');
      return;
    }

    const ngoId = currentNGO?.id || currentUser?.ngoId || 'ngo-1';
    const ngoName = currentNGO?.ngoName || currentUser?.name || 'NGO Partner';

    const selectedSchool = store.schools.find((s) => s.id === targetSchoolId);
    const schoolName = selectedSchool?.schoolName || 'Government School';
    const district = selectedSchool?.district || 'District';

    const newOffer: DonationOffer = {
      id: `don-${Date.now()}`,
      requirementId: matchedReq ? matchedReq.id : undefined,
      ngoId,
      ngoName,
      targetSchoolId,
      targetSchoolName: schoolName,
      targetDistrict: district,
      resourceName,
      category,
      description,
      quantityOffered: Number(quantityOffered),
      condition,
      status: 'Offer Submitted',
      estimatedValue: estimatedValue ? Number(estimatedValue) : undefined,
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addDonation(newOffer);
    navigate('/ngo/my-donations');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Submit Material Donation Commitment
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Commit educational equipment, computers, lab kits, or study furniture to a specific government school.
          </p>
        </div>

        <button
          type="button"
          onClick={fillSampleOffer}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-semibold border border-amber-200 transition-colors self-start sm:self-auto shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Fill Sample Offer</span>
        </button>
      </div>

      {matchedReq && (
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 text-xs flex items-start gap-3">
          <School className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">Fulfilling Verified School Need #{matchedReq.id}</div>
            <div className="text-teal-800 mt-0.5">
              Target: <strong>{matchedReq.schoolName}</strong> ({matchedReq.district}) · Need: {matchedReq.quantityRequired} units of {matchedReq.resourceName}
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Target Government School *
          </label>
          <select
            value={targetSchoolId}
            onChange={(e) => setTargetSchoolId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden bg-white text-slate-900"
          >
            {store.schools.map((s) => (
              <option key={s.id} value={s.id}>
                {s.schoolName} ({s.district}, {s.state} - UDISE #{s.udiseCode})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Resource Item Name *
          </label>
          <input
            type="text"
            value={resourceName}
            onChange={(e) => setResourceName(e.target.value)}
            placeholder="e.g. Dell Core-i5 Desktop Workstations or Student Dual Desks"
            className={`w-full px-3 py-2 border rounded-lg text-xs outline-hidden ${
              errors.resourceName ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
            }`}
          />
          {errors.resourceName && (
            <span className="text-[11px] text-red-600 mt-1 block">{errors.resourceName}</span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ResourceCategory)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden bg-white text-slate-900"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Quantity to Donate (Complete or Partial) *
            </label>
            <input
              type="number"
              min={1}
              value={quantityOffered}
              onChange={(e) => setQuantityOffered(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g. 10"
              className={`w-full px-3 py-2 border rounded-lg text-xs font-mono outline-hidden ${
                errors.quantityOffered ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
              }`}
            />
            {errors.quantityOffered && (
              <span className="text-[11px] text-red-600 mt-1 block">{errors.quantityOffered}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Material Condition *
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as 'New' | 'Good')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden bg-white text-slate-900"
            >
              <option value="New">New (Factory fresh / Mint with warranty)</option>
              <option value="Good">Good (Refurbished / Certified operational)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Estimated Value in INR (₹)
            </label>
            <input
              type="number"
              min={0}
              value={estimatedValue}
              onChange={(e) => setEstimatedValue(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g. 75000"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Donation Description & Technical Specifications *
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Item technical specs, software preinstalled, dimensions, included manuals..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            CSR Project / Donor Notes
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Funded under Annual Corporate CSR Grant."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden"
          />
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate('/ngo')}
            className="py-2 px-4 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="py-2 px-5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <span>Submit Donation Commitment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
