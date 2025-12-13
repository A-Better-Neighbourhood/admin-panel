const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3080/api";

export interface Issue {
  id: string;
  title: string;
  description: string;
  imageUrl: string[];
  latitude: number;
  longitude: number;
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "ARCHIVED";
  upvotes: number;
  isDuplicate: boolean;
  parentReportId?: string;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    fullName: string;
  };
  category?: string;
}

export interface IssueStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  archived: number;
}

export const issuesAPI = {
  async getAllIssues(): Promise<Issue[]> {
    const response = await fetch(`${API_BASE_URL}/reports`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch issues");
    }

    const result = await response.json();
    return result.data || [];
  },

  async updateIssueStatus(
    issueId: string,
    status: Issue["status"]
  ): Promise<Issue> {
    const response = await fetch(`${API_BASE_URL}/reports/${issueId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error("Failed to update issue status");
    }

    const result = await response.json();
    return result.data;
  },

  async deleteIssue(issueId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/reports/${issueId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to delete issue");
    }
  },

  async getIssueStats(): Promise<IssueStats> {
    const issues = await this.getAllIssues();

    return {
      total: issues.length,
      pending: issues.filter((i) => i.status === "PENDING").length,
      inProgress: issues.filter((i) => i.status === "IN_PROGRESS").length,
      resolved: issues.filter((i) => i.status === "RESOLVED").length,
      archived: issues.filter((i) => i.status === "ARCHIVED").length,
    };
  },
};
