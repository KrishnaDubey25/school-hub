import {
  User,
  SchoolProfile,
  NGOProfile,
  ResourceItem,
  ResourceRequirement,
  BorrowingTransaction,
  DonationOffer,
  ComplaintDispute,
  ActivityLog,
  PlatformNotification,
  PlatformStats,
} from '../types';

const STORAGE_KEY = 'school_resource_hub_data_v1';

export interface StorageData {
  users: User[];
  schools: SchoolProfile[];
  ngos: NGOProfile[];
  resources: ResourceItem[];
  requirements: ResourceRequirement[];
  transactions: BorrowingTransaction[];
  donations: DonationOffer[];
  complaints: ComplaintDispute[];
  activityLogs: ActivityLog[];
  notifications: PlatformNotification[];
}

const DEFAULT_USERS: User[] = [
  {
    id: 'user-admin-1',
    email: 'admin@schoolresourcehub.gov.in',
    role: 'admin',
    name: 'Dr. S. K. Sharma (Central Resource Officer)',
    status: 'approved',
    createdAt: '2026-01-10T09:00:00Z',
  },
  {
    id: 'user-school-1',
    email: 'principal.model19@gov.in',
    role: 'school',
    name: 'Dr. Rajesh Mehra (Principal)',
    status: 'approved',
    schoolId: 'school-1',
    createdAt: '2026-01-15T10:30:00Z',
  },
  {
    id: 'user-school-2',
    email: 'principal.zphs@gov.in',
    role: 'school',
    name: 'Mrs. Sunita Patil (Headmistress)',
    status: 'approved',
    schoolId: 'school-2',
    createdAt: '2026-01-20T11:00:00Z',
  },
  {
    id: 'user-school-3',
    email: 'principal.gghss@gov.in',
    role: 'school',
    name: 'Mr. K. Annamalai (Vice Principal)',
    status: 'approved',
    schoolId: 'school-3',
    createdAt: '2026-02-01T08:45:00Z',
  },
  {
    id: 'user-school-4',
    email: 'new.school@gov.in',
    role: 'school',
    name: 'Devendra Nath (Principal)',
    status: 'pending',
    schoolId: 'school-4',
    createdAt: '2026-03-24T14:15:00Z',
  },
  {
    id: 'user-ngo-1',
    email: 'contact@shikshasetu.org',
    role: 'ngo',
    name: 'Anand Verma (Director of Programs)',
    status: 'approved',
    ngoId: 'ngo-1',
    createdAt: '2026-01-18T12:00:00Z',
  },
  {
    id: 'user-ngo-2',
    email: 'connect@vidyarambham.org',
    role: 'ngo',
    name: 'Meenakshi Sundaram (Executive Trustee)',
    status: 'approved',
    ngoId: 'ngo-2',
    createdAt: '2026-02-05T09:30:00Z',
  },
  {
    id: 'user-ngo-3',
    email: 'hello@ruraltechhelp.org',
    role: 'ngo',
    name: 'Rohit Kulkarni (Founder)',
    status: 'pending',
    ngoId: 'ngo-3',
    createdAt: '2026-03-26T16:00:00Z',
  },
];

const DEFAULT_SCHOOLS: SchoolProfile[] = [
  {
    id: 'school-1',
    schoolName: 'Govt Model Senior Secondary School, Sector 19',
    udiseCode: '04010101901',
    state: 'Chandigarh',
    district: 'Chandigarh',
    cityOrTaluka: 'Sector 19',
    address: 'Near Main Market, Sector 19-C, Chandigarh - 160019',
    principalName: 'Dr. Rajesh Mehra',
    phone: '+91 98765 43210',
    email: 'principal.model19@gov.in',
    schoolType: 'Higher Secondary',
    studentCount: 1240,
    photoUrl: '/src/assets/images/hero_school_resource_hub_1793261016040.jpg',
    verificationStatus: 'approved',
    registrationDate: '2026-01-15',
  },
  {
    id: 'school-2',
    schoolName: 'Zilla Parishad High School, Baramati',
    udiseCode: '27250204502',
    state: 'Maharashtra',
    district: 'Pune',
    cityOrTaluka: 'Baramati',
    address: 'Station Road, Baramati Taluka, District Pune - 413102',
    principalName: 'Mrs. Sunita Patil',
    phone: '+91 98220 11234',
    email: 'principal.zphs@gov.in',
    schoolType: 'Secondary',
    studentCount: 820,
    photoUrl: '/src/assets/images/school_classroom_students_1793261016320.jpg',
    verificationStatus: 'approved',
    registrationDate: '2026-01-20',
  },
  {
    id: 'school-3',
    schoolName: 'Govt Girls Higher Secondary School, Ashok Nagar',
    udiseCode: '33020301205',
    state: 'Tamil Nadu',
    district: 'Chennai',
    cityOrTaluka: 'Mambalam',
    address: '12th Avenue, Ashok Nagar, Chennai - 600083',
    principalName: 'Mr. K. Annamalai',
    phone: '+91 94440 98765',
    email: 'principal.gghss@gov.in',
    schoolType: 'Higher Secondary',
    studentCount: 950,
    photoUrl: '/src/assets/images/hero_school_resource_hub_1793261016040.jpg',
    verificationStatus: 'approved',
    registrationDate: '2026-02-01',
  },
  {
    id: 'school-4',
    schoolName: 'Govt High School Rampur',
    udiseCode: '09650401809',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    cityOrTaluka: 'Rampur Block',
    address: 'Post Office Rampur, Varanasi Rural - 221008',
    principalName: 'Devendra Nath',
    phone: '+91 99190 55432',
    email: 'new.school@gov.in',
    schoolType: 'Secondary',
    studentCount: 460,
    verificationStatus: 'pending',
    registrationDate: '2026-03-24',
  },
  {
    id: 'school-5',
    schoolName: 'Govt Model Composite High School, Indiranagar',
    udiseCode: '29200403310',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    cityOrTaluka: 'Indiranagar',
    address: '100 Feet Road, HAL 2nd Stage, Bengaluru - 560038',
    principalName: 'Smt. Geetha Rao',
    phone: '+91 98450 67890',
    email: 'principal.gmchs@gov.in',
    schoolType: 'Composite',
    studentCount: 710,
    photoUrl: '/src/assets/images/school_classroom_students_1793261016320.jpg',
    verificationStatus: 'approved',
    registrationDate: '2026-02-12',
  },
];

const DEFAULT_NGOS: NGOProfile[] = [
  {
    id: 'ngo-1',
    ngoName: 'Shiksha Setu Foundation',
    registrationNumber: 'NGO-MH-2019-8842',
    authorizedRepresentative: 'Anand Verma',
    email: 'contact@shikshasetu.org',
    phone: '+91 98111 22334',
    state: 'Maharashtra',
    district: 'Pune',
    address: 'Plot 42, Senapati Bapat Road, Pune - 411016',
    areasOfSupport: ['Digital Literacy', 'Science & Innovation', 'School Desks'],
    resourceCategoriesSupported: ['Computers and IT', 'Laboratory Equipment', 'Furniture'],
    verificationStatus: 'approved',
    registrationDate: '2026-01-18',
  },
  {
    id: 'ngo-2',
    ngoName: 'Vidyarambham Education Trust',
    registrationNumber: 'NGO-TN-2017-3109',
    authorizedRepresentative: 'Meenakshi Sundaram',
    email: 'connect@vidyarambham.org',
    phone: '+91 94451 88990',
    state: 'Tamil Nadu',
    district: 'Chennai',
    address: 'Old No. 18, Gandhi Mandapam Road, Kotturpuram, Chennai - 600085',
    areasOfSupport: ['STEM Lab Kits', 'Reading & Libraries', 'Sports for Youth'],
    resourceCategoriesSupported: ['Educational Materials', 'Laboratory Equipment', 'Sports Equipment'],
    verificationStatus: 'approved',
    registrationDate: '2026-02-05',
  },
  {
    id: 'ngo-3',
    ngoName: 'Rural Tech & Learning Initiative',
    registrationNumber: 'NGO-UP-2022-7714',
    authorizedRepresentative: 'Rohit Kulkarni',
    email: 'hello@ruraltechhelp.org',
    phone: '+91 97920 44332',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    address: 'B-12, Lanka Road, Varanasi - 221005',
    areasOfSupport: ['Classroom Hardware', 'Solar Classroom Power'],
    resourceCategoriesSupported: ['Computers and IT', 'Infrastructure'],
    verificationStatus: 'pending',
    registrationDate: '2026-03-26',
  },
];

const DEFAULT_RESOURCES: ResourceItem[] = [
  {
    id: 'res-1',
    providerSchoolId: 'school-1',
    providerSchoolName: 'Govt Model Senior Secondary School, Sector 19',
    providerDistrict: 'Chandigarh',
    providerState: 'Chandigarh',
    name: 'Dell OptiPlex 3070 Desktop Computers (Core i3 / 8GB / 256GB SSD)',
    category: 'Computers and IT',
    description: 'Excess computer laboratory workstations in excellent condition. Operating system installed and tested with keyboards, optical mice, and power cords.',
    totalQuantity: 20,
    availableQuantity: 14,
    reservedQuantity: 6,
    condition: 'Good',
    photograph: '/src/assets/images/hero_school_resource_hub_1793261016040.jpg',
    location: 'Computer Block A, Room 102',
    availabilityStatus: 'Available',
    lendingAvailability: true,
    lendingNotes: 'Available for inter-school borrowing for up to 6 months per semester.',
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-03-15T11:20:00Z',
  },
  {
    id: 'res-2',
    providerSchoolId: 'school-2',
    providerSchoolName: 'Zilla Parishad High School, Baramati',
    providerDistrict: 'Pune',
    providerState: 'Maharashtra',
    name: 'Dual Seater Wooden Classroom Desks & Benches',
    category: 'Furniture',
    description: 'Sturdy teak and metal dual desks fabricated for senior classes. Minor cosmetic wear, structurally pristine.',
    totalQuantity: 35,
    availableQuantity: 35,
    reservedQuantity: 0,
    condition: 'Good',
    photograph: '/src/assets/images/school_classroom_students_1793261016320.jpg',
    location: 'West Wing Hallway Depot',
    availabilityStatus: 'Available',
    lendingAvailability: true,
    lendingNotes: 'Lending available for up to 1 academic year to schools within Pune district.',
    createdAt: '2026-02-10T14:30:00Z',
    updatedAt: '2026-02-10T14:30:00Z',
  },
  {
    id: 'res-3',
    providerSchoolId: 'school-1',
    providerSchoolName: 'Govt Model Senior Secondary School, Sector 19',
    providerDistrict: 'Chandigarh',
    providerState: 'Chandigarh',
    name: 'Compound Optical Microscopes (100x-1000x Magnification)',
    category: 'Laboratory Equipment',
    description: 'Precision brass optical microscopes for high school biology syllabus with dust covers, glass slide sets, and adjustment tools.',
    totalQuantity: 12,
    availableQuantity: 6,
    reservedQuantity: 6,
    condition: 'Good',
    photograph: '/src/assets/images/hero_school_resource_hub_1793261016040.jpg',
    location: 'Bio Lab Central Cabinet',
    availabilityStatus: 'Partially Lent',
    lendingAvailability: true,
    lendingNotes: 'Available for term-based rotation to neighboring schools during board exam practicals.',
    createdAt: '2026-02-14T09:15:00Z',
    updatedAt: '2026-03-20T10:00:00Z',
  },
  {
    id: 'res-4',
    providerSchoolId: 'school-3',
    providerSchoolName: 'Govt Girls Higher Secondary School, Ashok Nagar',
    providerDistrict: 'Chennai',
    providerState: 'Tamil Nadu',
    name: 'NCERT Reference Textbooks & Science Olympiad Question Banks',
    category: 'Educational Materials',
    description: 'Complete sets of Class 9 to 12 Science, Mathematics, and Social Science reference volumes in clean condition.',
    totalQuantity: 80,
    availableQuantity: 70,
    reservedQuantity: 10,
    condition: 'Good',
    photograph: '/src/assets/images/school_classroom_students_1793261016320.jpg',
    location: 'Central Library, Bay 4',
    availabilityStatus: 'Available',
    lendingAvailability: true,
    lendingNotes: 'Lendable for student exam preparation cycles.',
    createdAt: '2026-02-18T16:00:00Z',
    updatedAt: '2026-03-10T12:00:00Z',
  },
  {
    id: 'res-5',
    providerSchoolId: 'school-1',
    providerSchoolName: 'Govt Model Senior Secondary School, Sector 19',
    providerDistrict: 'Chandigarh',
    providerState: 'Chandigarh',
    name: 'Complete Inter-School Cricket Training Kits',
    category: 'Sports Equipment',
    description: 'Official leather balls, English willow bats, leg guards, batting gloves, helmets, and wickets in heavy-duty canvas kit bags.',
    totalQuantity: 4,
    availableQuantity: 4,
    reservedQuantity: 0,
    condition: 'New',
    location: 'Sports Department Locker 3',
    availabilityStatus: 'Available',
    lendingAvailability: true,
    lendingNotes: 'Available for district tournaments or weekend inter-school sports events.',
    createdAt: '2026-02-25T11:45:00Z',
    updatedAt: '2026-02-25T11:45:00Z',
  },
  {
    id: 'res-6',
    providerSchoolId: 'school-5',
    providerSchoolName: 'Govt Model Composite High School, Indiranagar',
    providerDistrict: 'Bengaluru Urban',
    providerState: 'Karnataka',
    name: 'Epson High-Lumen Classroom Ceiling Projectors with 8ft Retractable Screens',
    category: 'Computers and IT',
    description: 'HDMI/VGA compatible ceiling projectors with power supplies and ceiling mounting brackets.',
    totalQuantity: 3,
    availableQuantity: 3,
    reservedQuantity: 0,
    condition: 'Good',
    location: 'Audio-Visual Lab A-2',
    availabilityStatus: 'Available',
    lendingAvailability: true,
    lendingNotes: 'Can be loaned for school exhibitions or teacher training workshops.',
    createdAt: '2026-03-01T15:20:00Z',
    updatedAt: '2026-03-01T15:20:00Z',
  },
  {
    id: 'res-7',
    providerSchoolId: 'school-2',
    providerSchoolName: 'Zilla Parishad High School, Baramati',
    providerDistrict: 'Pune',
    providerState: 'Maharashtra',
    name: 'Molded Plastic Student Exam Chairs (Requires Leg Weld/Nut Fastening)',
    category: 'Furniture',
    description: 'Sturdy molded shell chairs requiring minor tightening and bolt replacements. Kept in storage.',
    totalQuantity: 25,
    availableQuantity: 0,
    reservedQuantity: 0,
    condition: 'Needs Repair',
    location: 'Workshop Storage Room 04',
    availabilityStatus: 'Under Maintenance',
    lendingAvailability: false,
    lendingNotes: 'Not available for lending until scheduled municipal repair completes.',
    createdAt: '2026-03-05T08:30:00Z',
    updatedAt: '2026-03-05T08:30:00Z',
  },
];

const DEFAULT_REQUIREMENTS: ResourceRequirement[] = [
  {
    id: 'req-1',
    schoolId: 'school-3',
    schoolName: 'Govt Girls Higher Secondary School, Ashok Nagar',
    district: 'Chennai',
    state: 'Tamil Nadu',
    resourceName: 'Desktop Computers or Laptops for Coding Club',
    category: 'Computers and IT',
    description: 'We are starting a Python and Web Development initiative for 120 girls in Classes 9-11. We urgently need 15 computers to expand our limited lab capacity.',
    quantityRequired: 15,
    quantityFulfilled: 0,
    priority: 'Urgent',
    requestType: 'Either',
    status: 'Open',
    requiredByDate: '2026-11-15',
    createdAt: '2026-03-10T10:00:00Z',
  },
  {
    id: 'req-2',
    schoolId: 'school-2',
    schoolName: 'Zilla Parishad High School, Baramati',
    district: 'Pune',
    state: 'Maharashtra',
    resourceName: 'Compound Optical Microscopes for Board Practical Exams',
    category: 'Laboratory Equipment',
    description: 'Our senior secondary students have science practical exams approaching. We require 6-10 working compound microscopes for 3 months.',
    quantityRequired: 6,
    quantityFulfilled: 6,
    priority: 'High',
    requestType: 'Borrow',
    status: 'Fulfilled',
    requiredByDate: '2026-11-20',
    createdAt: '2026-03-12T14:00:00Z',
  },
  {
    id: 'req-3',
    schoolId: 'school-4',
    schoolName: 'Govt High School Rampur',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    resourceName: 'Dual Student Desks and Classroom Benches',
    category: 'Furniture',
    description: 'Two newly constructed classrooms lack student seating. Students are currently seated on mats. Permanent donation or long-term lending needed.',
    quantityRequired: 40,
    quantityFulfilled: 0,
    priority: 'Urgent',
    requestType: 'Permanent Need / Donation',
    status: 'Open',
    requiredByDate: '2026-11-30',
    createdAt: '2026-03-25T09:30:00Z',
  },
  {
    id: 'req-4',
    schoolId: 'school-5',
    schoolName: 'Govt Model Composite High School, Indiranagar',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    resourceName: 'Secondary School Physics & Chemistry Laboratory Glassware Kits',
    category: 'Laboratory Equipment',
    description: 'Beakers, test tubes, burettes, Bunsen burners, and reagent bottles for Class 10 science experiments.',
    quantityRequired: 8,
    quantityFulfilled: 0,
    priority: 'Medium',
    requestType: 'Either',
    status: 'Open',
    requiredByDate: '2026-12-05',
    createdAt: '2026-03-27T11:00:00Z',
  },
];

const DEFAULT_TRANSACTIONS: BorrowingTransaction[] = [
  {
    id: 'tx-101',
    requirementId: 'req-2',
    resourceId: 'res-3',
    resourceName: 'Compound Optical Microscopes (100x-1000x Magnification)',
    category: 'Laboratory Equipment',
    lenderSchoolId: 'school-1',
    lenderSchoolName: 'Govt Model Senior Secondary School, Sector 19',
    lenderDistrict: 'Chandigarh',
    borrowerSchoolId: 'school-2',
    borrowerSchoolName: 'Zilla Parishad High School, Baramati',
    borrowerDistrict: 'Pune',
    quantity: 6,
    status: 'In Transit',
    requestedStartDate: '2026-10-15',
    returnDueDate: '2027-01-15',
    purpose: 'Class 10 and 12 Biology practical examinations and hands-on preparation.',
    lenderNotes: 'Inspected and certified in full working condition. Includes 6 optical lenses and wooden storage boxes.',
    deliveryCoordinator: 'R. K. Verma (Govt Logistics Liaison)',
    pickupDate: '2026-10-22',
    expectedDeliveryDate: '2026-10-31',
    deliveryNotes: 'Dispatched via Inter-State Educational Equipment Courier, tracking #EDU-TR-8821.',
    damagedOrMissingReported: false,
    createdAt: '2026-03-14T11:00:00Z',
    updatedAt: '2026-03-22T14:30:00Z',
  },
  {
    id: 'tx-102',
    requirementId: undefined,
    resourceId: 'res-4',
    resourceName: 'NCERT Reference Textbooks & Science Olympiad Question Banks',
    category: 'Educational Materials',
    lenderSchoolId: 'school-3',
    lenderSchoolName: 'Govt Girls Higher Secondary School, Ashok Nagar',
    lenderDistrict: 'Chennai',
    borrowerSchoolId: 'school-5',
    borrowerSchoolName: 'Govt Model Composite High School, Indiranagar',
    borrowerDistrict: 'Bengaluru Urban',
    quantity: 10,
    status: 'Received by Borrower',
    requestedStartDate: '2026-09-01',
    returnDueDate: '2026-12-15',
    purpose: 'Inter-district preparation for State Science Olympiad contest.',
    lenderNotes: 'Packaged in sealed weather-resistant cartons.',
    deliveryCoordinator: 'P. Sundaram (Zonal Officer)',
    pickupDate: '2026-09-05',
    expectedDeliveryDate: '2026-09-08',
    deliveryNotes: 'Delivered and verified by Librarian Mrs. Pushpa.',
    damagedOrMissingReported: false,
    createdAt: '2026-08-28T09:00:00Z',
    updatedAt: '2026-09-08T16:15:00Z',
  },
  {
    id: 'tx-103',
    requirementId: 'req-1',
    resourceId: 'res-1',
    resourceName: 'Dell OptiPlex 3070 Desktop Computers',
    category: 'Computers and IT',
    lenderSchoolId: 'school-1',
    lenderSchoolName: 'Govt Model Senior Secondary School, Sector 19',
    lenderDistrict: 'Chandigarh',
    borrowerSchoolId: 'school-3',
    borrowerSchoolName: 'Govt Girls Higher Secondary School, Ashok Nagar',
    borrowerDistrict: 'Chennai',
    quantity: 6,
    status: 'Admin Coordinated',
    requestedStartDate: '2026-11-01',
    returnDueDate: '2027-04-30',
    purpose: 'Supplement girls coding workshop until permanent lab computers arrive.',
    lenderNotes: 'Approved by School Management Committee.',
    deliveryCoordinator: 'M. Saxena (Central Logistics Desk)',
    pickupDate: '2026-11-04',
    expectedDeliveryDate: '2026-11-09',
    deliveryNotes: 'Logistics coordinator assigned. Pickup manifest generated.',
    damagedOrMissingReported: false,
    createdAt: '2026-03-20T10:30:00Z',
    updatedAt: '2026-03-23T11:00:00Z',
  },
];

const DEFAULT_DONATIONS: DonationOffer[] = [
  {
    id: 'don-201',
    requirementId: 'req-1',
    ngoId: 'ngo-1',
    ngoName: 'Shiksha Setu Foundation',
    targetSchoolId: 'school-3',
    targetSchoolName: 'Govt Girls Higher Secondary School, Ashok Nagar',
    targetDistrict: 'Chennai',
    resourceName: 'Certified Refurbished Core i5 Workstations with Monitors',
    category: 'Computers and IT',
    description: 'Full desktop sets including 19-inch LED monitors, optical mice, keyboards, and preloaded educational software suites.',
    quantityOffered: 10,
    condition: 'New',
    status: 'Admin Approved',
    estimatedValue: 180000,
    coordinatorName: 'A. Ramanathan (District Education Desk)',
    dispatchTrackingRef: 'NGO-DISP-2026-091',
    notes: 'Donation funded under Digital Inclusion CSR initiative.',
    adminReviewNotes: 'Verified compliant with government school IT procurement and donation norms.',
    createdAt: '2026-03-15T15:00:00Z',
    updatedAt: '2026-03-18T10:00:00Z',
  },
  {
    id: 'don-202',
    requirementId: undefined,
    ngoId: 'ngo-2',
    ngoName: 'Vidyarambham Education Trust',
    targetSchoolId: 'school-2',
    targetSchoolName: 'Zilla Parishad High School, Baramati',
    targetDistrict: 'Pune',
    resourceName: 'Experimental STEM DIY Science Kits for Middle School',
    category: 'Laboratory Equipment',
    description: 'Compact modular kits covering mechanics, optics, magnetism, and basic electricity with instructional manuals in regional language.',
    quantityOffered: 20,
    condition: 'New',
    status: 'Delivered & Confirmed',
    estimatedValue: 45000,
    dispatchTrackingRef: 'SPEEDPOST-MH-9941',
    coordinatorName: 'District Science Supervisor',
    dispatchDate: '2026-03-01',
    deliveryDate: '2026-03-08',
    notes: 'Kits handed over during district science fair.',
    adminReviewNotes: 'Documentation complete and signed receipt received.',
    createdAt: '2026-02-20T09:00:00Z',
    updatedAt: '2026-03-08T17:00:00Z',
  },
  {
    id: 'don-203',
    requirementId: 'req-3',
    ngoId: 'ngo-1',
    ngoName: 'Shiksha Setu Foundation',
    targetSchoolId: 'school-4',
    targetSchoolName: 'Govt High School Rampur',
    targetDistrict: 'Varanasi',
    resourceName: 'Dual Student Wooden Desks with Powder-Coated Metal Frames',
    category: 'Furniture',
    description: 'Ergonomic dual study desks suitable for high school classes 8-10.',
    quantityOffered: 20,
    condition: 'New',
    status: 'Offer Submitted',
    estimatedValue: 70000,
    notes: 'Partial requirement fulfillment offered (20 out of 40 required desks).',
    createdAt: '2026-03-27T14:00:00Z',
    updatedAt: '2026-03-27T14:00:00Z',
  },
];

const DEFAULT_COMPLAINTS: ComplaintDispute[] = [
  {
    id: 'comp-301',
    transactionId: 'tx-101',
    reporterRole: 'school',
    reporterId: 'school-2',
    reporterName: 'Mrs. Sunita Patil (Zilla Parishad High School)',
    title: 'Transit Delivery Delay for Practical Exam Microscopes',
    description: 'The shipment was expected on Oct 28th. We request status clarification from Central Logistics coordinator as student practical exams commence next week.',
    status: 'Investigating',
    resolutionNotes: 'Contacted logistics courier EDU-TR-8821. Heavy rainfall caused 48-hour route diversion; delivery confirmed for Oct 31st morning.',
    createdAt: '2026-10-27T11:20:00Z',
  },
];

const DEFAULT_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-03-27T14:00:00Z',
    actorRole: 'ngo',
    actorName: 'Anand Verma (Shiksha Setu Foundation)',
    action: 'Donation Offered',
    details: 'Offered 20 Dual Student Desks to Govt High School Rampur (Req #req-3)',
  },
  {
    id: 'log-2',
    timestamp: '2026-03-26T16:00:00Z',
    actorRole: 'ngo',
    actorName: 'Rohit Kulkarni (Rural Tech & Learning Initiative)',
    action: 'New NGO Registration',
    details: 'Submitted registration #NGO-UP-2022-7714 for administrative verification.',
  },
  {
    id: 'log-3',
    timestamp: '2026-03-24T14:15:00Z',
    actorRole: 'school',
    actorName: 'Devendra Nath (Govt High School Rampur)',
    action: 'New School Registration',
    details: 'Submitted registration with UDISE #09650401809 for Varanasi district.',
  },
  {
    id: 'log-4',
    timestamp: '2026-03-23T11:00:00Z',
    actorRole: 'admin',
    actorName: 'Dr. S. K. Sharma (Central Resource Officer)',
    action: 'Delivery Coordinated',
    details: 'Assigned M. Saxena as delivery coordinator for Transaction #tx-103.',
  },
  {
    id: 'log-5',
    timestamp: '2026-03-20T10:30:00Z',
    actorRole: 'school',
    actorName: 'Dr. Rajesh Mehra (Govt Model SSS 19)',
    action: 'Lending Approved',
    details: 'Approved borrow request from Govt Girls HSS Chennai for 6 Desktop Computers.',
  },
  {
    id: 'log-6',
    timestamp: '2026-03-18T10:00:00Z',
    actorRole: 'admin',
    actorName: 'Dr. S. K. Sharma (Central Resource Officer)',
    action: 'Donation Approved',
    details: 'Approved Shiksha Setu Foundation donation offer #don-201 for 10 PCs.',
  },
];

const DEFAULT_NOTIFICATIONS: PlatformNotification[] = [
  {
    id: 'notif-1',
    recipientRole: 'admin',
    recipientId: 'user-admin-1',
    title: 'Pending School Approval',
    message: 'Govt High School Rampur (UDISE: 09650401809) registered and awaits verification.',
    link: '/admin/schools',
    read: false,
    createdAt: '2026-03-24T14:15:00Z',
  },
  {
    id: 'notif-2',
    recipientRole: 'admin',
    recipientId: 'user-admin-1',
    title: 'New Donation Offer for Review',
    message: 'Shiksha Setu Foundation offered 20 Dual Student Desks to Govt High School Rampur.',
    link: '/admin/donations',
    read: false,
    createdAt: '2026-03-27T14:05:00Z',
  },
  {
    id: 'notif-3',
    recipientRole: 'school',
    recipientId: 'school-3',
    title: 'Donation Approved by Administrator',
    message: '10 Core i5 Workstations donated by Shiksha Setu Foundation have been cleared for dispatch.',
    link: '/school/donations',
    read: false,
    createdAt: '2026-03-18T10:05:00Z',
  },
  {
    id: 'notif-4',
    recipientRole: 'school',
    recipientId: 'school-2',
    title: 'Shipment Dispatched',
    message: '6 Compound Microscopes from Govt Model SSS 19 are currently in transit (#EDU-TR-8821).',
    link: '/school/active-transactions',
    read: true,
    createdAt: '2026-10-22T10:00:00Z',
  },
  {
    id: 'notif-5',
    recipientRole: 'ngo',
    recipientId: 'ngo-1',
    title: 'Donation Approved',
    message: 'Your donation offer of 10 Workstations to Govt Girls HSS Chennai was approved by Central Admin.',
    link: '/ngo/my-donations',
    read: false,
    createdAt: '2026-03-18T10:10:00Z',
  },
];

export function getStoredData(): StorageData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial: StorageData = {
        users: DEFAULT_USERS,
        schools: DEFAULT_SCHOOLS,
        ngos: DEFAULT_NGOS,
        resources: DEFAULT_RESOURCES,
        requirements: DEFAULT_REQUIREMENTS,
        transactions: DEFAULT_TRANSACTIONS,
        donations: DEFAULT_DONATIONS,
        complaints: DEFAULT_COMPLAINTS,
        activityLogs: DEFAULT_LOGS,
        notifications: DEFAULT_NOTIFICATIONS,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw) as StorageData;
  } catch (err) {
    console.error('Error reading localStorage data', err);
    return {
      users: DEFAULT_USERS,
      schools: DEFAULT_SCHOOLS,
      ngos: DEFAULT_NGOS,
      resources: DEFAULT_RESOURCES,
      requirements: DEFAULT_REQUIREMENTS,
      transactions: DEFAULT_TRANSACTIONS,
      donations: DEFAULT_DONATIONS,
      complaints: DEFAULT_COMPLAINTS,
      activityLogs: DEFAULT_LOGS,
      notifications: DEFAULT_NOTIFICATIONS,
    };
  }
}

export function saveStoredData(data: StorageData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event('school_hub_storage_updated'));
  } catch (err) {
    console.error('Error writing localStorage data', err);
  }
}

export function resetToDefaultData(): StorageData {
  const initial: StorageData = {
    users: DEFAULT_USERS,
    schools: DEFAULT_SCHOOLS,
    ngos: DEFAULT_NGOS,
    resources: DEFAULT_RESOURCES,
    requirements: DEFAULT_REQUIREMENTS,
    transactions: DEFAULT_TRANSACTIONS,
    donations: DEFAULT_DONATIONS,
    complaints: DEFAULT_COMPLAINTS,
    activityLogs: DEFAULT_LOGS,
    notifications: DEFAULT_NOTIFICATIONS,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  window.dispatchEvent(new Event('school_hub_storage_updated'));
  return initial;
}

export function clearToBlankSlate(): StorageData {
  const blank: StorageData = {
    users: [
      {
        id: 'user-admin-1',
        email: 'admin@schoolresourcehub.gov.in',
        role: 'admin',
        name: 'Dr. S. K. Sharma (Central Officer)',
        status: 'approved',
        createdAt: new Date().toISOString(),
      },
    ],
    schools: [],
    ngos: [],
    resources: [],
    requirements: [],
    transactions: [],
    donations: [],
    complaints: [],
    activityLogs: [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorRole: 'admin',
        actorName: 'Central Resource Officer',
        action: 'Clean Workspace Initialized',
        details: 'Simulated data wiped. Workspace is now empty and ready for your real institutional records.',
      },
    ],
    notifications: [
      {
        id: `notif-${Date.now()}`,
        recipientRole: 'all',
        recipientId: 'all',
        title: 'Clean Workspace Active',
        message: 'All dummy sample data has been cleared. Add your real schools, resources, and requirements now.',
        read: false,
        createdAt: new Date().toISOString(),
      },
    ],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(blank));
  window.dispatchEvent(new Event('school_hub_storage_updated'));
  return blank;
}

export function calculatePlatformStats(data: StorageData): PlatformStats {
  const verifiedSchools = data.schools.filter((s) => s.verificationStatus === 'approved').length;
  const pendingSchoolApprovals = data.schools.filter((s) => s.verificationStatus === 'pending').length;
  const registeredNGOs = data.ngos.filter((n) => n.verificationStatus === 'approved').length;
  const pendingNGOApprovals = data.ngos.filter((n) => n.verificationStatus === 'pending').length;
  const activeResourceRequests = data.requirements.filter((r) => r.status === 'Open' || r.status === 'Partially Met').length;
  const activeBorrowingTransactions = data.transactions.filter(
    (t) => t.status !== 'Returned to Lender' && t.status !== 'Lender Rejected'
  ).length;
  const pendingDonations = data.donations.filter((d) => d.status === 'Offer Submitted' || d.status === 'Admin Approved').length;
  const pendingDeliveries = data.transactions.filter((t) => t.status === 'In Transit' || t.status === 'Admin Coordinated').length;
  const completedTransactions = data.transactions.filter((t) => t.status === 'Returned to Lender' || t.status === 'Received by Borrower').length;
  const totalDonationsDelivered = data.donations.filter((d) => d.status === 'Delivered & Confirmed').length;

  const studentsImpactedEstimate = data.schools.reduce((acc, curr) => acc + (curr.studentCount || 0), 0);

  return {
    totalRegisteredSchools: data.schools.length,
    verifiedSchools,
    pendingSchoolApprovals,
    registeredNGOs,
    pendingNGOApprovals,
    activeResourceRequests,
    activeBorrowingTransactions,
    pendingDonations,
    pendingDeliveries,
    completedTransactions,
    totalDonationsDelivered,
    studentsImpactedEstimate,
  };
}

export function logActivity(
  actorRole: User['role'] | 'System',
  actorName: string,
  action: string,
  details: string
): void {
  const current = getStoredData();
  const newLog: ActivityLog = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    actorRole,
    actorName,
    action,
    details,
  };
  current.activityLogs.unshift(newLog);
  // keep last 100 logs
  if (current.activityLogs.length > 100) {
    current.activityLogs = current.activityLogs.slice(0, 100);
  }
  saveStoredData(current);
}

export function pushNotification(
  recipientRole: PlatformNotification['recipientRole'],
  recipientId: string,
  title: string,
  message: string,
  link?: string
): void {
  const current = getStoredData();
  const newNotif: PlatformNotification = {
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    recipientRole,
    recipientId,
    title,
    message,
    link,
    read: false,
    createdAt: new Date().toISOString(),
  };
  current.notifications.unshift(newNotif);
  saveStoredData(current);
}
