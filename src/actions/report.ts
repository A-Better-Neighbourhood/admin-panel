/** @format */

import { CreateReportType } from "@/schemas/ReportSchema";
import {
  CreateReportRequest,
  ReportsListResponse,
  ReportDetailResponse,
  CreateReportApiResponse,
  ResolveReportResponse,
  Report as ApiReport,
  Report,
  ReportActivitiesResponse,
  ReportActivity,
  AddCommentRequest,
  AddCommentApiResponse,
  UpvoteReportApiResponse,
} from "@/types/api";
import { api } from "@/lib/api";

export const getReports = async (): Promise<Report[]> => {
  try {
    const response = await api.get("/reports");
    return (response.data as ReportsListResponse).data || [];
  } catch (error) {
    console.error("Get reports error:", error);
    throw error;
  }
};

export const getReportById = async (id: string): Promise<Report | null> => {
  try {
    const response = await api.get(`/reports/${id}`);
    return (response.data as ReportDetailResponse).data || null;
  } catch (error) {
    console.error("Get report by ID error:", error);
    throw error;
  }
};

export const getReportActivities = async (
  id: string
): Promise<ReportActivity[]> => {
  try {
    const response = await api.get(`/reports/${id}/activities`);
    return (response.data as ReportActivitiesResponse).data || [];
  } catch (error) {
    console.error("Get report activities error:", error);
    throw error;
  }
};

export const getUserReports = async (): Promise<Report[]> => {
  try {
    const response = await api.get("/reports/user");
    return (response.data as ReportsListResponse).data || [];
  } catch (error) {
    console.error("Get user reports error:", error);
    throw error;
  }
};

export const getUnresolvedReports = async (): Promise<Report[]> => {
  try {
    const response = await api.get("/reports/unresolved");
    return (response.data as ReportsListResponse).data || [];
  } catch (error) {
    console.error("Get unresolved reports error:", error);
    throw error;
  }
};

export const getUserResolvedReports = async (): Promise<Report[]> => {
  try {
    const response = await api.get("/reports/user/resolved");
    return (response.data as ReportsListResponse).data || [];
  } catch (error) {
    console.error("Get user resolved reports error:", error);
    throw error;
  }
};

export const getUserUnresolvedReports = async (): Promise<Report[]> => {
  try {
    const response = await api.get("/reports/user/unresolved");
    return (response.data as ReportsListResponse).data || [];
  } catch (error) {
    console.error("Get user unresolved reports error:", error);
    throw error;
  }
};

export const addReport = async (data: CreateReportType): Promise<Report> => {
  try {
    const requestData: CreateReportRequest = {
      title: data.title,
      description: data.description,
      image: data.image,
      location: data.location,
      category: "OTHER", // Default category hardcoded for now until schema is updated
    };

    const response = await api.post("/reports/", requestData, {
      withCredentials: true,
    });
    const apiResponse = response.data as CreateReportApiResponse;
    const reportData = apiResponse.data!.report;

    // Convert API response to our Report type
    // The API now returns a complete report object structure that matches our interface close enough
    // We just need to map it correctly.
    const newReport: Report = {
      id: reportData.id,
      title: reportData.title,
      description: reportData.description,
      imageUrl: reportData.imageUrl,
      latitude: reportData.latitude,
      longitude: reportData.longitude,
      category: reportData.category,
      upvotes: 0,
      status: reportData.status,
      duplicateCount: 0,
      createdAt: reportData.createdAt,
      creatorId: reportData.creatorId,
      creator: {
        // Mock creator for immediate UI update if needed, or fetch fresh
        id: reportData.creatorId,
        fullName: "You", // This should ideally come from auth context or response
        role: "USER" as any,
      },
    };

    return newReport;
  } catch (error) {
    console.error("Add report error:", error);
    throw error;
  }
};

export const resolveReport = async (id: string): Promise<Report> => {
  try {
    const response = await api.patch(`/reports/${id}/resolve`, {});
    return (response.data as ResolveReportResponse).data!;
  } catch (error) {
    console.error("Resolve report error:", error);
    throw error;
  }
};

export const upvoteReport = async (id: string): Promise<void> => {
  try {
    await api.post(`/reports/${id}/upvote`);
  } catch (error) {
    console.error("Upvote report error:", error);
    throw error;
  }
};

export const addComment = async (
  reportId: string,
  text: string,
  images: string[] = []
): Promise<ReportActivity> => {
  try {
    const requestData: AddCommentRequest = {
      text,
      images,
    };
    const response = await api.post(
      `/reports/${reportId}/comments`,
      requestData
    );
    return (response.data as AddCommentApiResponse).data!;
  } catch (error) {
    console.error("Add comment error:", error);
    throw error;
  }
};

export const updateReportStatus = async (
  id: string,
  status: string
): Promise<Report> => {
  try {
    const response = await api.patch(`/reports/${id}/status`, { status });
    return (response.data as ResolveReportResponse).data!;
  } catch (error) {
    console.error("Update report status error:", error);
    throw error;
  }
};

export const deleteReport = async (id: string): Promise<void> => {
  try {
    await api.delete(`/reports/${id}`);
  } catch (error) {
    console.error("Delete report error:", error);
    throw error;
  }
};

export const getReportStats = async () => {
  try {
    const reports = await getReports();
    return {
      total: reports.length,
      pending: reports.filter((r) => r.status === "PENDING").length,
      inProgress: reports.filter((r) => r.status === "IN_PROGRESS").length,
      resolved: reports.filter((r) => r.status === "RESOLVED").length,
    };
  } catch (error) {
    console.error("Get report stats error:", error);
    throw error;
  }
};
