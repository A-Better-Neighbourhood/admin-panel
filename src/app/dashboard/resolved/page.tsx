"use client";

import { useState, useEffect } from "react";
import { ReportCard } from "@/components/ReportCard";
import { Issue, issuesAPI } from "@/lib/api";
import { CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Search } from "lucide-react";

export default function ResolvedPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
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
      const allIssues = await issuesAPI.getAllIssues();
      const resolved = allIssues.filter((issue) => issue.status === "RESOLVED");
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
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    } else if (sortBy === "upvotes") {
      filtered.sort((a, b) => b.upvotes - a.upvotes);
    }

    setFilteredIssues(filtered);
  };

  const handleStatusChange = async (
    issueId: string,
    status: Issue["status"]
  ) => {
    try {
      await issuesAPI.updateIssueStatus(issueId, status);
      // Remove from resolved list if status changed
      if (status !== "RESOLVED") {
        setIssues(issues.filter((issue) => issue.id !== issueId));
      }
    } catch (error) {
      console.error("Failed to update status:", error);
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
          <CheckCircle className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">Resolved Reports</h1>
        </div>
        <p className="text-gray-600">Successfully resolved community issues</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search resolved reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <option value="recent">Recently Resolved</option>
            <option value="upvotes">Most Upvoted</option>
          </Select>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing <strong>{filteredIssues.length}</strong> resolved reports
        </div>
      </div>

      {/* Reports Grid */}
      {filteredIssues.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No resolved reports
          </h3>
          <p className="text-gray-600">Resolved reports will appear here</p>
        </div>
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
