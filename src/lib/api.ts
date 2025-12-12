const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3080/api";

export interface Issue {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "ARCHIVED";
  upvotes: number;
  isDuplicate: boolean;
  parentIssueId?: string;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    fullName: string;
  };
}

export interface IssueStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  archived: number;
}

export const issuesAPI = {
  async getAllIssues(token: string): Promise<Issue[]> {
    const response = await fetch(`${API_BASE_URL}/issues`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch issues");
    }

    return response.json();
  },

  async updateIssueStatus(
    issueId: string,
    status: Issue["status"],
    token: string
  ): Promise<Issue> {
    const response = await fetch(`${API_BASE_URL}/issues/${issueId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error("Failed to update issue status");
    }

    return response.json();
  },

  async deleteIssue(issueId: string, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/issues/${issueId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete issue");
    }
  },

  async getIssueStats(token: string): Promise<IssueStats> {
    const issues = await this.getAllIssues(token);

    return {
      total: issues.length,
      pending: issues.filter((i) => i.status === "PENDING").length,
      inProgress: issues.filter((i) => i.status === "IN_PROGRESS").length,
      resolved: issues.filter((i) => i.status === "RESOLVED").length,
      archived: issues.filter((i) => i.status === "ARCHIVED").length,
    };
  },
};
