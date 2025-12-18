/** @format */

"use client";

import { useState, useEffect } from "react";
import { ReportCard } from "@/components/ReportCard";
import { getReports, updateReportStatus } from "@/actions/report";
import { Report, ReportStatus } from "@/types/api";
import { CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";

export default function ResolvedPage() {
  const [issues, setIssues] = useState<Report[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("recent");

  useEffect(() => {
    loadResolvedIssues();
  }, []);

  useEffect(() => {
    filterAndSortIssues();
  }, [issues, searchTerm, sortBy]);

  const loadResolvedIssues = async () => {
    try {
      const allIssues = await getReports();
      const resolved = allIssues.filter(
        (issue) => issue.status === ReportStatus.RESOLVED
      );
      setIssues(resolved);
    } catch (error) {
      console.error("Failed to load resolved issues:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortIssues = () => {
    let filtered = [...issues];

    if (searchTerm) {
      filtered = filtered.filter(
        (issue) =>
          issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortBy === "recent") {
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortBy === "upvotes") {
      filtered.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
    }

    setFilteredIssues(filtered);
  };

  const handleStatusChange = async (issueId: string, status: ReportStatus) => {
    try {
      await updateReportStatus(issueId, status);
      // Remove from resolved list if status changed (and no longer resolved)
      // Actually updateReportStatus returns the updated report.
      // If we move it out of resolved, we should remove it.
      if (status !== ReportStatus.RESOLVED) {
        setIssues(issues.filter((issue) => issue.id !== issueId));
      } else {
        // Update state if it stayed resolved but changed somehow? Unlikely for status change to same status.
      }
    } catch (error) {
      console.error("Failed to update status:", error);
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
        <h1 className="text-3xl font-semibold">Resolved Reports</h1>

        <p className="text-muted-foreground">
          Successfully resolved community issues
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search resolved reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recently Resolved</SelectItem>
                <SelectItem value="upvotes">Most Upvoted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            Showing <strong>{filteredIssues.length}</strong> resolved reports
          </div>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      {filteredIssues.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CheckCircle className="h-6 w-6" />
            </EmptyMedia>
            <EmptyTitle>No resolved reports</EmptyTitle>
            <EmptyDescription>
              Resolved reports will appear here
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIssues.map((issue) => (
            <ReportCard
              key={issue.id}
              issue={issue}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
