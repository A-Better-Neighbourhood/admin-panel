"use client";

import { useState, useEffect } from "react";
import { ReportCard } from "@/components/ReportCard";
import { Issue, issuesAPI } from "@/lib/api";
import { AlertCircle, TrendingUp } from "lucide-react";

export default function PriorityReportsPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPriorityIssues();
  }, []);

  const loadPriorityIssues = async () => {
    try {
      const token = "your-auth-token";
      const allIssues = await issuesAPI.getAllIssues(token);

      // Calculate current time once
      const now = Date.now();

      // Priority logic: High upvotes, recent, and pending/in-progress
      const priorityIssues = allIssues
        .filter(
          (issue) =>
            (issue.status === "PENDING" || issue.status === "IN_PROGRESS") &&
            !issue.isDuplicate
        )
        .sort((a, b) => {
          // Sort by upvotes and recency
          const scoreA =
            a.upvotes * 2 + (now - new Date(a.createdAt).getTime()) / 1000000;
          const scoreB =
            b.upvotes * 2 + (now - new Date(b.createdAt).getTime()) / 1000000;
          return scoreB - scoreA;
        })
        .slice(0, 20); // Top 20 priority issues

      setIssues(priorityIssues);
    } catch (error) {
      console.error("Failed to load priority issues:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    issueId: string,
    status: Issue["status"]
  ) => {
    try {
      const token = "your-auth-token";
      await issuesAPI.updateIssueStatus(issueId, status, token);
      setIssues(
        issues.map((issue) =>
          issue.id === issueId ? { ...issue, status } : issue
        )
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDelete = async (issueId: string) => {
    if (!confirm("Are you sure you want to delete this report?")) return;

    try {
      const token = "your-auth-token";
      await issuesAPI.deleteIssue(issueId, token);
      setIssues(issues.filter((issue) => issue.id !== issueId));
    } catch (error) {
      console.error("Failed to delete issue:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <AlertCircle className="h-8 w-8 text-red-600" />
          <h1 className="text-3xl font-bold text-gray-900">Priority Reports</h1>
        </div>
        <p className="text-gray-600">
          Reports requiring immediate attention based on community engagement
          and urgency
        </p>
      </div>

      {/* Priority Criteria */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Priority Criteria
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900">
                High Community Engagement
              </h3>
              <p className="text-sm text-gray-600">
                Reports with multiple upvotes
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900">Recent Submissions</h3>
              <p className="text-sm text-gray-600">Newly reported issues</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900">Pending Action</h3>
              <p className="text-sm text-gray-600">Awaiting resolution</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      {issues.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No priority reports
          </h3>
          <p className="text-gray-600">
            All critical issues have been addressed!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.map((issue) => (
            <ReportCard
              key={issue.id}
              issue={issue}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
