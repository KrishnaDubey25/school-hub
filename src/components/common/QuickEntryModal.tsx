import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  Plus,
  School,
  Boxes,
  FileQuestion,
  HeartHandshake,
  Check,
  Sparkles,
} from 'lucide-react';
import {
  ResourceCategory,
  ResourceCondition,
  RequirementPriority,
  RequirementType,
  SchoolType,
} from '../../types';

interface QuickEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'resource' | 'requirement' | 'school' | 'ngo';
}

const CATEGORIES: ResourceCategory[] = [
  'Computers and IT',
  'Furniture',
  'Educational Materials',
  'Laboratory Equipment',
  'Sports Equipment',
  'Infrastructure',
  'Other School Resources',
];

export const QuickEntryModal: React.FC<QuickEntryModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'resource',
}) => {
  const { store, addResource, addRequirement, addSchool, addNGO } = useData();
  const { currentSchool } = useAuth();
  const [activeTab, setActiveTab] = useState<'resource' | 'requirement' | 'school' | 'ngo'>(defaultTab);

  // 1. Resource state
  const [resSchoolId, setResSchoolId] = useState(currentSchool?.id || store.schools[0]?.id || '');
  const [resName, setResName] = useState('');
  const [resCategory, setResCategory] = useState<ResourceCategory>('Computers and IT');
  const [resQty, setResQty] = useState<number>(10);
  const [resCondition, setResCondition] = useState<ResourceCondition>('Good');
  const [resLocation, setResLocation] = useState('Central Campus Storage');
  const [resDesc, setResDesc] = useState('');
  const [resLendable, setResLendable] = useState(true);

  // 2. Requirement state
  const [reqSchoolId, setReqSchoolId] = useState(currentSchool?.id || store.schools[0]?.id || '');
  const [reqName, setReqName] = useState('');
  const [reqCategory, setReqCategory] = useState<ResourceCategory>('Computers and IT');
  const [reqQty, setReqQty] = useState<number>(10);
  const [reqPriority, setReqPriority] = useState<RequirementPriority>('High');
  const [reqType, setReqType] = useState<RequirementType>('Either');
  const [reqDesc, setReqDesc] = useState('');

  // 3. School state
  const [schName, setSchName] = useState('');
  const [schUdise, setSchUdise] = useState('');
  const [schState, setSchState] = useState('Maharashtra');
  const [schDistrict, setSchDistrict] = useState('Pune');
  const [schPrincipal, setSchPrincipal] = useState('');
  const [schPhone, setSchPhone] = useState('');
  const [schEmail, setSchEmail] = useState('');
  const [schStudents, setSchStudents] = useState<number>(500);

  // 4. NGO state
  const [ngoName, setNgoName] = useState('');
  const [ngoReg, setNgoReg] = useState('');
  const [ngoRep, setNgoRep] = useState('');
  const [ngoEmail, setNgoEmail] = useState('');
  const [ngoPhone, setNgoPhone] = useState('');
  const [ngoDistrict, setNgoDistrict] = useState('Pune');

  // Submit handlers
  const handleResourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resName.trim()) return;
    const targetSchool = store.schools.find((s) => s.id === resSchoolId) || store.schools[0];
    addResource({
      id: `res-${Date.now()}`,
      providerSchoolId: targetSchool?.id || 'school-custom',
      providerSchoolName: targetSchool?.schoolName || 'Govt School',
      providerDistrict: targetSchool?.district || 'District',
      providerState: targetSchool?.state || 'State',
      name: resName,
      category: resCategory,
      description: resDesc || `${resName} available for student use and borrowing.`,
      totalQuantity: Number(resQty),
      availableQuantity: Number(resQty),
      reservedQuantity: 0,
      condition: resCondition,
      location: resLocation,
      availabilityStatus: 'Available',
      lendingAvailability: resLendable,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setResName('');
    setResDesc('');
    onClose();
  };

  const handleRequirementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqName.trim()) return;
    const targetSchool = store.schools.find((s) => s.id === reqSchoolId) || store.schools[0];
    addRequirement({
      id: `req-${Date.now()}`,
      schoolId: targetSchool?.id || 'school-custom',
      schoolName: targetSchool?.schoolName || 'Govt School',
      district: targetSchool?.district || 'District',
      state: targetSchool?.state || 'State',
      resourceName: reqName,
      category: reqCategory,
      description: reqDesc || `Urgent need for ${reqName} for educational syllabus.`,
      quantityRequired: Number(reqQty),
      quantityFulfilled: 0,
      priority: reqPriority,
      requestType: reqType,
      status: 'Open',
      requiredByDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    });
    setReqName('');
    setReqDesc('');
    onClose();
  };

  const handleSchoolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schName.trim()) return;
    const sId = `school-${Date.now()}`;
    addSchool({
      id: sId,
      schoolName: schName,
      udiseCode: schUdise || `${Math.floor(10000000000 + Math.random() * 90000000000)}`,
      state: schState,
      district: schDistrict,
      cityOrTaluka: schDistrict,
      address: `${schDistrict} Main Campus`,
      principalName: schPrincipal || 'Principal',
      phone: schPhone || '+91 98000 00000',
      email: schEmail || `principal.${Date.now()}@gov.in`,
      schoolType: 'Secondary',
      studentCount: Number(schStudents),
      verificationStatus: 'approved',
      registrationDate: new Date().toISOString().split('T')[0],
    });
    setSchName('');
    setSchUdise('');
    setSchPrincipal('');
    onClose();
  };

  const handleNGOSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ngoName.trim()) return;
    const nId = `ngo-${Date.now()}`;
    addNGO({
      id: nId,
      ngoName,
      registrationNumber: ngoReg || `NGO-${Date.now().toString().slice(-6)}`,
      authorizedRepresentative: ngoRep || 'Authorized Director',
      email: ngoEmail || `contact.${Date.now()}@ngo.org`,
      phone: ngoPhone || '+91 99000 00000',
      state: 'State',
      district: ngoDistrict,
      address: `${ngoDistrict} Office`,
      areasOfSupport: ['Digital Literacy', 'Science & Innovation'],
      resourceCategoriesSupported: ['Computers and IT', 'Laboratory Equipment'],
      verificationStatus: 'approved',
      registrationDate: new Date().toISOString().split('T')[0],
    });
    setNgoName('');
    setNgoReg('');
    setNgoRep('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-teal-600" />
                <span>Add Real Entry to Platform</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Quickly insert your genuine data directly into the active system.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab buttons */}
          <div className="grid grid-cols-4 p-2 bg-slate-100 gap-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('resource')}
              className={`py-2 px-2 rounded-lg text-center transition-all ${
                activeTab === 'resource'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Surplus Asset
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('requirement')}
              className={`py-2 px-2 rounded-lg text-center transition-all ${
                activeTab === 'requirement'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              School Need
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('school')}
              className={`py-2 px-2 rounded-lg text-center transition-all ${
                activeTab === 'school'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              School
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ngo')}
              className={`py-2 px-2 rounded-lg text-center transition-all ${
                activeTab === 'ngo'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              NGO
            </button>
          </div>

          {/* Tab Contents */}
          <div className="p-6 overflow-y-auto space-y-4 text-xs">
            {activeTab === 'resource' && (
              <form onSubmit={handleResourceSubmit} className="space-y-4">
                {store.schools.length > 0 ? (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Provider School *
                    </label>
                    <select
                      value={resSchoolId}
                      onChange={(e) => setResSchoolId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden bg-white text-slate-900"
                    >
                      {store.schools.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.schoolName} ({s.district})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="p-2.5 bg-amber-50 text-amber-900 rounded-lg text-xs">
                    No schools registered yet. We will link this to your default school. You can also add a school in the &quot;School&quot; tab.
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Resource Name & Specs *
                  </label>
                  <input
                    type="text"
                    required
                    value={resName}
                    onChange={(e) => setResName(e.target.value)}
                    placeholder="e.g. HP Desktop Workstations (Core i5, 8GB RAM)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                    <select
                      value={resCategory}
                      onChange={(e) => setResCategory(e.target.value as ResourceCategory)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden bg-white text-slate-900"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Available Quantity *
                    </label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={resQty}
                      onChange={(e) => setResQty(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Condition *</label>
                    <select
                      value={resCondition}
                      onChange={(e) => setResCondition(e.target.value as ResourceCondition)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden bg-white text-slate-900"
                    >
                      <option value="New">New</option>
                      <option value="Good">Good (Working)</option>
                      <option value="Needs Repair">Needs Repair</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Location *</label>
                    <input
                      type="text"
                      value={resLocation}
                      onChange={(e) => setResLocation(e.target.value)}
                      placeholder="e.g. Lab Room 101"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={resDesc}
                    onChange={(e) => setResDesc(e.target.value)}
                    placeholder="Brief description of specifications or accessories..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Resource</span>
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'requirement' && (
              <form onSubmit={handleRequirementSubmit} className="space-y-4">
                {store.schools.length > 0 && (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Requesting School *
                    </label>
                    <select
                      value={reqSchoolId}
                      onChange={(e) => setReqSchoolId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden bg-white text-slate-900"
                    >
                      {store.schools.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.schoolName} ({s.district})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Resource Needed *
                  </label>
                  <input
                    type="text"
                    required
                    value={reqName}
                    onChange={(e) => setReqName(e.target.value)}
                    placeholder="e.g. Science Microscopes for Practical Exams"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                    <select
                      value={reqCategory}
                      onChange={(e) => setReqCategory(e.target.value as ResourceCategory)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden bg-white text-slate-900"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Quantity Needed *
                    </label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={reqQty}
                      onChange={(e) => setReqQty(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Priority *</label>
                    <select
                      value={reqPriority}
                      onChange={(e) => setReqPriority(e.target.value as RequirementPriority)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden bg-white text-slate-900"
                    >
                      <option value="Urgent">Urgent</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Type *</label>
                    <select
                      value={reqType}
                      onChange={(e) => setReqType(e.target.value as RequirementType)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden bg-white text-slate-900"
                    >
                      <option value="Either">Either (Borrow or Donation)</option>
                      <option value="Borrow">Borrow Only</option>
                      <option value="Permanent Need / Donation">Donation Preferred</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Need Justification</label>
                  <textarea
                    rows={2}
                    value={reqDesc}
                    onChange={(e) => setReqDesc(e.target.value)}
                    placeholder="Why this equipment is needed for students..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Post Requirement</span>
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'school' && (
              <form onSubmit={handleSchoolSubmit} className="space-y-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    School Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={schName}
                    onChange={(e) => setSchName(e.target.value)}
                    placeholder="e.g. Govt Girls Model High School"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">UDISE Code</label>
                    <input
                      type="text"
                      value={schUdise}
                      onChange={(e) => setSchUdise(e.target.value)}
                      placeholder="11-digit code"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Students Enrolled
                    </label>
                    <input
                      type="number"
                      value={schStudents}
                      onChange={(e) => setSchStudents(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">State</label>
                    <input
                      type="text"
                      value={schState}
                      onChange={(e) => setSchState(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">District</label>
                    <input
                      type="text"
                      value={schDistrict}
                      onChange={(e) => setSchDistrict(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Principal Name
                    </label>
                    <input
                      type="text"
                      value={schPrincipal}
                      onChange={(e) => setSchPrincipal(e.target.value)}
                      placeholder="Principal Full Name"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={schPhone}
                      onChange={(e) => setSchPhone(e.target.value)}
                      placeholder="+91..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Add Real School</span>
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'ngo' && (
              <form onSubmit={handleNGOSubmit} className="space-y-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NGO / Trust Name *</label>
                  <input
                    type="text"
                    required
                    value={ngoName}
                    onChange={(e) => setNgoName(e.target.value)}
                    placeholder="e.g. Prathamik Shiksha Sahyog Trust"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Registration #</label>
                    <input
                      type="text"
                      value={ngoReg}
                      onChange={(e) => setNgoReg(e.target.value)}
                      placeholder="Reg number"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">District</label>
                    <input
                      type="text"
                      value={ngoDistrict}
                      onChange={(e) => setNgoDistrict(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Representative</label>
                    <input
                      type="text"
                      value={ngoRep}
                      onChange={(e) => setNgoRep(e.target.value)}
                      placeholder="Full Name"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={ngoPhone}
                      onChange={(e) => setNgoPhone(e.target.value)}
                      placeholder="+91..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Register NGO</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
