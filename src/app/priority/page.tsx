/** @format */

"use client";

import { useState, useEffect } from "react";
import { ReportCard } from "@/components/ReportCard";
import { Issue, issuesAPI } from "@/lib/api";
import { AlertCircle, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";

export default function PriorityReportsPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPriorityIssues();
  }, []);

  const loadPriorityIssues = async () => {
    try {
      const allIssues = await issuesAPI.getAllIssues();

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
      await issuesAPI.updateIssueStatus(issueId, status);
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
      await issuesAPI.deleteIssue(issueId);
      setIssues(issues.filter((issue) => issue.id !== issueId));
    } catch (error) {
      console.error("Failed to delete issue:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Priority Reports</h1>
        <p className="text-muted-foreground">
          Reports requiring immediate attention based on community engagement
          and urgency
        </p>
      </div>

      {/* Priority Criteria */}
      <Card className="mb-6 bg-primary/20 border border-primary/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">
            Priority Criteria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="size-6 mt-0.5 text-destructive" />
              <div>
                <h3 className="font-medium">High Community Engagement</h3>
                <p className="text-sm text-muted-foreground">
                  Reports with multiple upvotes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AlertCircle className="size-6 mt-0.5 text-destructive" />
              <div>
                <h3 className="font-medium">Recent Submissions</h3>
                <p className="text-sm text-muted-foreground">
                  Newly reported issues
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AlertCircle className="size-6 mt-0.5 text-destructive" />
              <div>
                <h3 className="font-medium">Pending Action</h3>
                <p className="text-sm text-muted-foreground">
                  Awaiting resolution
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      {issues.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <AlertCircle className="h-6 w-6" />
            </EmptyMedia>
            <EmptyTitle>No priority reports</EmptyTitle>
            <EmptyDescription>
              All critical issues have been addressed!
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
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
