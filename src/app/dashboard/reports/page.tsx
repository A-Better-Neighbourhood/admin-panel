"use client";

import { useState, useEffect } from "react";
import { ReportCard } from "@/components/ReportCard";
import { Issue, issuesAPI } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, Download } from "lucide-react";

export default function ReportsPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("recent");

  useEffect(() => {
    loadIssues();
  }, []);

  useEffect(() => {
    filterAndSortIssues();
  }, [issues, searchTerm, statusFilter, sortBy]);

  const loadIssues = async () => {
    try {
      const data = await issuesAPI.getAllIssues();
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
      filtered.sort((a, b) => b.upvotes - a.upvotes);
    } else if (sortBy === "oldest") {
      filtered.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }

    setFilteredIssues(filtered);
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
        issue.creator.fullName,
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">All Reports</h1>
        <p className="text-gray-600 mt-2">
          Manage and monitor all community reports
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
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
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="ARCHIVED">Archived</option>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="upvotes">Most Upvoted</option>
            </Select>

            <Button variant="outline" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
          <span>
            Showing <strong>{filteredIssues.length}</strong> of{" "}
            <strong>{issues.length}</strong> reports
          </span>
        </div>
      </div>

      {/* Reports Grid */}
      {filteredIssues.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No reports found
          </h3>
          <p className="text-gray-600">
            Try adjusting your filters or search term
          </p>
        </div>
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
