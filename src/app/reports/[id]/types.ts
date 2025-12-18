/** @format */

export interface Activity {
  id: string;
  type:
    | "REPORT_CREATED"
    | "DUPLICATE_MERGED"
    | "COMMENT"
    | "STATUS_UPDATED"
    | "RESOLVED";
  content: string;
  createdBy: {
    fullName: string;
    role?: string;
  };
  createdAt: string;
  images?: string[];
  metadata?: any;
}
