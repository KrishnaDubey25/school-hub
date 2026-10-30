import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { ResourceRequirement } from '../../types';
import {
  Search,
  Filter,
  Gift,
  Building,
  School,
  ArrowRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'motion/react';

export const NGOBrowseNeedsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { store } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Distinct districts from schools
  const districts = Array.from(new Set(store.schools.map((s) => s.district))).filter(Boolean);

  const filteredNeeds = store.requirements.filter((req) => {
    const matchesSearch =
      req.resourceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDistrict = districtFilter === 'all' ? true : req.district === districtFilter;
    const matchesCategory = categoryFilter === 'all' ? true : req.category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' ? true : req.priority === priorityFilter;

    // Only open or partially met needs
    const isOpen = req.status === 'Open' || req.status === 'Partially Met';

    return matchesSearch && matchesDistrict && matchesCategory && matchesPriority && isOpen;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Browse Government School Needs & Urgent Requests
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Discover verified resource shortages submitted by government schools and commit targeted philanthropic support.
          </p>
        </div>

        <div className="text-xs text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
          Open Requirements: <span className="font-bold text-slate-900">{filteredNeeds.length}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by required equipment, school name, district, or description..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-1 focus:ring-teal-700 bg-white text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 outline-hidden"
          >
            <option value="all">All Districts</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 outline-hidden"
          >
            <option value="all">All Categories</option>
            <option value="Computers and IT">Computers & IT</option>
            <option value="Furniture">Furniture</option>
            <option value="Educational Materials">Educational Materials</option>
            <option value="Laboratory Equipment">Laboratory Equipment</option>
            <option value="Sports Equipment">Sports Equipment</option>
            <option value="Infrastructure">Infrastructure</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 outline-hidden"
          >
            <option value="all">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
          </select>
        </div>
      </div>

      {/* Grid of School Needs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredNeeds.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
            No active school requirements match your filter criteria.
          </div>
        ) : (
          filteredNeeds.map((need) => (
            <div
              key={need.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-amber-400 transition-colors space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-teal-700 uppercase tracking-wider">
                    {need.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      need.priority === 'Urgent'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : need.priority === 'High'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {need.priority} Urgency
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 leading-snug">{need.resourceName}</h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {need.description}
                </p>

                <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-100 space-y-1">
                  <div>
                    School: <strong>{need.schoolName}</strong>
                  </div>
                  <div>Location: {need.district}, {need.state}</div>
                  <div>
                    Required by:{' '}
                    <span className="font-mono text-slate-700">{need.requiredByDate}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">Quantity Needed</div>
                  <div className="font-mono font-bold text-sm text-slate-900 tabular-nums">
                    {need.quantityRequired} units
                  </div>
                </div>

                <Link
                  to={`/ngo/offer-donation?reqId=${need.id}`}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>Offer Donation</span>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
