/** @format */

"use client";

import { useState, useEffect } from "react";
import { ReportCard } from "@/components/ReportCard";
import { getReports, deleteReport, updateReportStatus } from "@/actions/report";
import { Report, ReportStatus } from "@/types/api";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";
import { Search, Filter, Download } from "lucide-react";

export default function ReportsPage() {
  const [issues, setIssues] = useState<Report[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("upvotes");

  useEffect(() => {
    loadIssues();
  }, []);

  useEffect(() => {
    filterAndSortIssues();
  }, [issues, searchTerm, statusFilter, sortBy]);

  const loadIssues = async () => {
    try {
      const data = await getReports();
      setIssues(data);
    } catch (error) {
      console.error("Failed to load issues:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortIssues = () => {
    let filtered = [...issues];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (issue) =>
          issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((issue) => issue.status === statusFilter);
    }

    // Sorting
    if (sortBy === "recent") {
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortBy === "upvotes") {
      filtered.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
    } else if (sortBy === "oldest") {
      filtered.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }

    setFilteredIssues(filtered);
  };

  const handleStatusChange = async (issueId: string, status: ReportStatus) => {
    try {
      await updateReportStatus(issueId, status);
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
      await deleteReport(issueId);
      setIssues(issues.filter((issue) => issue.id !== issueId));
    } catch (error) {
      console.error("Failed to delete issue:", error);
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      [
        "ID",
        "Title",
        "Description",
        "Status",
        "Upvotes",
        "Created At",
        "Creator",
      ],
      ...filteredIssues.map((issue) => [
        issue.id,
        issue.title,
        issue.description,
        issue.status,
        issue.upvotes,
        new Date(issue.createdAt).toLocaleDateString(),
        issue.creator?.fullName || "Unknown",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reports-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
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
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">All Reports</h1>
        <p className="text-muted-foreground mt-2">
          Manage and monitor all community reports
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
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="upvotes">Most Upvoted</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={exportToCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              Showing <strong>{filteredIssues.length}</strong> of{" "}
              <strong>{issues.length}</strong> reports
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      {filteredIssues.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Filter className="h-6 w-6" />
            </EmptyMedia>
            <EmptyTitle>No reports found</EmptyTitle>
            <EmptyDescription>
              Try adjusting your filters or search term
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
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
