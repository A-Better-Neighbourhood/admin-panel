/** @format */

export enum ReportStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
}

export type Location = [number, number];

export interface Report {
  id: string;
  title: string;
  description: string;
  imageUrl: string[];
  location: Location;
  category: string;
  creator?: {
    id: string;
    fullName: string;
    role: string;
  };
  status: ReportStatus;
  upvotes: number;
  createdAt: string;
  updatedAt: string;
}
