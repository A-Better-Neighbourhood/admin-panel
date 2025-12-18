/** @format */

// Base API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

// Authentication Types
export interface User {
  id: string;
  fullName: string;
  address: string;
  contactNo: string;
  createdAt: string;
}

export interface AuthResponse {
  token?: string;
  user?: User;
  id?: string;
  contactNo?: string;
  fullName?: string;
  address?: string;
}

export interface SignUpRequest {
  phoneNumber: string;
  password: string;
  name: string;
  address: string;
}

export interface SignInRequest {
  phoneNumber: string;
  password: string;
}

// Issue/Report Types (using Report naming for frontend)
export enum ReportStatus {
  RESOLVED = "RESOLVED",
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  ARCHIVED = "ARCHIVED",
}

export enum UserRole {
  USER = "USER",
  AUTHORITY = "AUTHORITY",
  ADMIN = "ADMIN",
}

export interface Creator {
  id: string;
  fullName: string;
  role: UserRole;
  contactNo?: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  imageUrl: string[]; // Changed to array of strings
  latitude: number;
  longitude: number;
  category: string;
  status: ReportStatus;
  duplicateCount: number;
  createdAt: string;
  creator: Creator;
  creatorId?: string; // Kept for backward compat if needed, but creator object is preferred
  upvotes: number; // Kept for UI display
  originalReportId?: string;
  hasLiked?: boolean;
}

// Activity Types
export enum ActivityType {
  REPORT_CREATED = "REPORT_CREATED",
  USER_COMMENTED = "USER_COMMENTED",
  AUTHORITY_COMMENTED = "AUTHORITY_COMMENTED",
  STATUS_UPDATED = "STATUS_UPDATED",
  DUPLICATE_MERGED = "DUPLICATE_MERGED",
  MARKED_AS_DUPLICATE = "MARKED_AS_DUPLICATE",
  MARKED_RESOLVED = "MARKED_RESOLVED",
  UPVOTE_MILESTONE = "UPVOTE_MILESTONE",
}

export enum ActorType {
  USER = "USER",
  AUTHORITY = "AUTHORITY",
  SYSTEM = "SYSTEM",
}

export interface ReportActivity {
  id: string;
  type: ActivityType;
  actorType: ActorType;
  content: string;
  images: string[];
  createdAt: string;
  createdBy: Creator | null; // Null for SYSTEM events
  oldStatus?: ReportStatus; // For STATUS_UPDATED
  newStatus?: ReportStatus; // For STATUS_UPDATED
}

export interface CreateReportRequest {
  title: string;
  description: string;
  image: string; // Base64
  location: [number, number]; // [latitude, longitude]
  category: string;
}

export interface CreateReportData {
  report: {
    id: string;
    title: string;
    description: string;
    imageUrl: string[];
    latitude: number;
    longitude: number;
    category: string;
    status: ReportStatus;
    isDuplicate: boolean;
    creatorId: string;
    createdAt: string;
  };
  deduplication: {
    isDuplicate: boolean;
    merged: boolean;
  };
}

export interface AddCommentRequest {
  text: string;
  images?: string[];
}

// API Response Types
export type AuthApiResponse = ApiResponse<AuthResponse>;
export type UserProfileResponse = ApiResponse<User>;
export type ReportsListResponse = ApiResponse<Report[]>;
export type ReportDetailResponse = ApiResponse<Report>;
export type ReportActivitiesResponse = ApiResponse<ReportActivity[]>;
export type CreateReportApiResponse = ApiResponse<CreateReportData>;
export type AddCommentApiResponse = ApiResponse<ReportActivity>;
export type UpvoteReportApiResponse = ApiResponse<{
  id: string;
  reportId: string;
  userId: string;
  createdAt: string;
}>;
export type ResolveReportResponse = ApiResponse<Report>;

// Health Check
export interface HealthResponse {
  status: string;
  message: string;
}
