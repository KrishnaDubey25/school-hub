import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  ResourceCategory,
  RequirementPriority,
  RequirementType,
  ResourceRequirement,
} from '../../types';
import {
  FileQuestion,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
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

export const SchoolCreateRequirementPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentSchool, currentUser } = useAuth();
  const { addRequirement } = useData();

  const [resourceName, setResourceName] = useState('');
  const [category, setCategory] = useState<ResourceCategory>('Laboratory Equipment');
  const [description, setDescription] = useState('');
  const [quantityRequired, setQuantityRequired] = useState<number | ''>(8);
  const [priority, setPriority] = useState<RequirementPriority>('High');
  const [requestType, setRequestType] = useState<RequirementType>('Either');
  const [requiredByDate, setRequiredByDate] = useState('2026-11-20');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fillSampleNeed = () => {
    setResourceName('Compound Optical Microscopes for Board Practical Exams');
    setCategory('Laboratory Equipment');
    setDescription('Required for Class 10 and 12 Biology practical syllabus examinations. Students currently share 2 aged microscopes across 45 students.');
    setQuantityRequired(10);
    setPriority('Urgent');
    setRequestType('Either');
    setRequiredByDate('2026-11-25');
    setErrors({});
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!resourceName.trim()) errs.resourceName = 'Resource name is required.';
    if (!description.trim()) errs.description = 'Requirement description is required.';
    if (quantityRequired === '' || Number(quantityRequired) <= 0) {
      errs.quantityRequired = 'Quantity must be at least 1 unit.';
    }
    if (!requiredByDate) errs.requiredByDate = 'Required by date is required.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) return;

    if (currentUser?.status === 'pending') {
      setErrorMessage('Your school account is currently pending verification. Unverified accounts cannot post public requirements.');
      return;
    }

    const schoolId = currentSchool?.id || currentUser?.schoolId || 'school-1';
    const schoolName = currentSchool?.schoolName || currentUser?.name || 'Government School';
    const district = currentSchool?.district || 'District';
    const state = currentSchool?.state || 'State';

    const newReq: ResourceRequirement = {
      id: `req-${Date.now()}`,
      schoolId,
      schoolName,
      district,
      state,
      resourceName,
      category,
      description,
      quantityRequired: Number(quantityRequired),
      quantityFulfilled: 0,
      priority,
      requestType,
      status: 'Open',
      requiredByDate,
      createdAt: new Date().toISOString(),
    };

    addRequirement(newReq);
    navigate('/school/find-resources');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Publish School Resource Requirement
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit essential educational material needs to find surplus matches at neighboring schools or attract NGO donations.
          </p>
        </div>

        <button
          type="button"
          onClick={fillSampleNeed}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg text-xs font-semibold border border-teal-200 transition-colors self-start sm:self-auto shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Fill Sample Requirement</span>
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
            Resource Needed *
          </label>
          <input
            type="text"
            value={resourceName}
            onChange={(e) => setResourceName(e.target.value)}
            placeholder="e.g. Science Laboratory Compound Microscopes"
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category *
            </label>
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
              Quantity Required (Units) *
            </label>
            <input
              type="number"
              min={1}
              value={quantityRequired}
              onChange={(e) => setQuantityRequired(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g. 10"
              className={`w-full px-3 py-2 border rounded-lg text-xs outline-hidden font-mono ${
                errors.quantityRequired ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
              }`}
            />
            {errors.quantityRequired && (
              <span className="text-[11px] text-red-600 mt-1 block">{errors.quantityRequired}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Urgency / Priority *
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as RequirementPriority)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden bg-white text-slate-900"
            >
              <option value="Urgent">Urgent (Immediate Board/Term Need)</option>
              <option value="High">High (Current Semester)</option>
              <option value="Medium">Medium (Upcoming Term)</option>
              <option value="Low">Low (General Expansion)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Request Type Preference *
            </label>
            <select
              value={requestType}
              onChange={(e) => setRequestType(e.target.value as RequirementType)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden bg-white text-slate-900"
            >
              <option value="Either">Either (Borrow or Permanent Donation)</option>
              <option value="Borrow">Borrow Only (Inter-School Loan)</option>
              <option value="Permanent Need / Donation">Permanent Donation Preferred</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Required by Date *
            </label>
            <input
              type="date"
              value={requiredByDate}
              onChange={(e) => setRequiredByDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Need Justification & Classroom Context *
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain which classes or student groups will benefit, specific syllabus requirements..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden"
          />
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate('/school')}
            className="py-2 px-4 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="py-2 px-5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <span>Publish Requirement</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
