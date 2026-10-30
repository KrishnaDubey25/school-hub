export type UserRole = 'admin' | 'school' | 'ngo';
export type UserStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  status: UserStatus;
  createdAt: string;
  schoolId?: string;
  ngoId?: string;
}

export type SchoolType = 'Primary' | 'Upper Primary' | 'Secondary' | 'Higher Secondary' | 'Composite';

export interface SchoolProfile {
  id: string;
  schoolName: string;
  udiseCode: string;
  state: string;
  district: string;
  cityOrTaluka: string;
  address: string;
  principalName: string;
  phone: string;
  email: string;
  schoolType: SchoolType;
  studentCount: number;
  logoUrl?: string;
  photoUrl?: string;
  verificationStatus: UserStatus;
  rejectionReason?: string;
  suspensionReason?: string;
  registrationDate: string;
}

export interface NGOProfile {
  id: string;
  ngoName: string;
  registrationNumber: string;
  authorizedRepresentative: string;
  email: string;
  phone: string;
  state: string;
  district: string;
  address: string;
  areasOfSupport: string[];
  resourceCategoriesSupported: ResourceCategory[];
  logoUrl?: string;
  verificationStatus: UserStatus;
  rejectionReason?: string;
  suspensionReason?: string;
  registrationDate: string;
}

export type ResourceCategory =
  | 'Computers and IT'
  | 'Furniture'
  | 'Educational Materials'
  | 'Laboratory Equipment'
  | 'Sports Equipment'
  | 'Infrastructure'
  | 'Other School Resources';

export type ResourceCondition = 'New' | 'Good' | 'Needs Repair' | 'Damaged';

export type AvailabilityStatus = 'Available' | 'Partially Lent' | 'Fully Lent' | 'Under Maintenance';

export interface ResourceItem {
  id: string;
  providerSchoolId: string;
  providerSchoolName: string;
  providerDistrict: string;
  providerState: string;
  name: string;
  category: ResourceCategory;
  description: string;
  totalQuantity: number;
  availableQuantity: number;
  reservedQuantity: number;
  condition: ResourceCondition;
  photograph?: string;
  location: string;
  availabilityStatus: AvailabilityStatus;
  lendingAvailability: boolean;
  lendingNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type RequirementPriority = 'Urgent' | 'High' | 'Medium' | 'Low';
export type RequirementType = 'Borrow' | 'Permanent Need / Donation' | 'Either';
export type RequirementStatus = 'Open' | 'Partially Met' | 'Fulfilled' | 'Cancelled';

export interface ResourceRequirement {
  id: string;
  schoolId: string;
  schoolName: string;
  district: string;
  state: string;
  resourceName: string;
  category: ResourceCategory;
  description: string;
  quantityRequired: number;
  quantityFulfilled: number;
  priority: RequirementPriority;
  requestType: RequirementType;
  status: RequirementStatus;
  requiredByDate: string;
  createdAt: string;
}

export type TransactionStatus =
  | 'Requested'
  | 'Lender Approved'
  | 'Lender Rejected'
  | 'Admin Coordinated'
  | 'In Transit'
  | 'Received by Borrower'
  | 'Return Initiated'
  | 'Returned to Lender'
  | 'Disputed';

export interface BorrowingTransaction {
  id: string;
  requirementId?: string;
  resourceId: string;
  resourceName: string;
  category: ResourceCategory;
  lenderSchoolId: string;
  lenderSchoolName: string;
  lenderDistrict: string;
  borrowerSchoolId: string;
  borrowerSchoolName: string;
  borrowerDistrict: string;
  quantity: number;
  status: TransactionStatus;
  requestedStartDate: string;
  returnDueDate: string;
  actualReturnDate?: string;
  purpose?: string;
  lenderNotes?: string;
  deliveryCoordinator?: string;
  pickupDate?: string;
  expectedDeliveryDate?: string;
  deliveryNotes?: string;
  damagedOrMissingReported?: boolean;
  damageReportDetails?: string;
  createdAt: string;
  updatedAt: string;
}

export type DonationStatus =
  | 'Offer Submitted'
  | 'Admin Approved'
  | 'Admin Rejected'
  | 'Dispatched by NGO'
  | 'Delivered & Confirmed';

export interface DonationOffer {
  id: string;
  requirementId?: string;
  ngoId: string;
  ngoName: string;
  targetSchoolId: string;
  targetSchoolName: string;
  targetDistrict: string;
  resourceName: string;
  category: ResourceCategory;
  description: string;
  quantityOffered: number;
  condition: 'New' | 'Good';
  status: DonationStatus;
  estimatedValue?: number;
  dispatchTrackingRef?: string;
  coordinatorName?: string;
  dispatchDate?: string;
  deliveryDate?: string;
  notes?: string;
  adminReviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComplaintDispute {
  id: string;
  transactionId?: string;
  reporterRole: UserRole;
  reporterId: string;
  reporterName: string;
  title: string;
  description: string;
  status: 'Open' | 'Investigating' | 'Resolved';
  resolutionNotes?: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  actorRole: UserRole | 'System';
  actorName: string;
  action: string;
  details: string;
}

export interface PlatformNotification {
  id: string;
  recipientRole: UserRole | 'all';
  recipientId: string; // user id, school id, ngo id or 'all'
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface PlatformStats {
  totalRegisteredSchools: number;
  verifiedSchools: number;
  pendingSchoolApprovals: number;
  registeredNGOs: number;
  pendingNGOApprovals: number;
  activeResourceRequests: number;
  activeBorrowingTransactions: number;
  pendingDonations: number;
  pendingDeliveries: number;
  completedTransactions: number;
  totalDonationsDelivered: number;
  studentsImpactedEstimate: number;
}
