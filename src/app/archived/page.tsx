"use client";

import { useState, useEffect } from "react";
import { ReportCard } from "@/components/ReportCard";
import { Issue, issuesAPI } from "@/lib/api";
import { Archive } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function ArchivedPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadArchivedIssues();
  }, []);

  useEffect(() => {
    filterIssues();
  }, [issues, searchTerm]);

  const loadArchivedIssues = async () => {
    try {
      const allIssues = await issuesAPI.getAllIssues();
      const archived = allIssues.filter((issue) => issue.status === "ARCHIVED");
      setIssues(archived);
    } catch (error) {
      console.error("Failed to load archived issues:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterIssues = () => {
    let filtered = [...issues];

    if (searchTerm) {
      filtered = filtered.filter(
        (issue) =>
          issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.description.toLowerCase().includes(searchTerm.toLowerCase())
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
      // Remove from archived list if status changed
      if (status !== "ARCHIVED") {
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
          <Archive className="h-8 w-8 text-gray-600" />
          <h1 className="text-3xl font-bold text-gray-900">Archived Reports</h1>
        </div>
        <p className="text-gray-600">Archived and duplicate reports</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search archived reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing <strong>{filteredIssues.length}</strong> archived reports
        </div>
      </div>

      {/* Reports Grid */}
      {filteredIssues.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Archive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No archived reports
          </h3>
          <p className="text-gray-600">Archived reports will appear here</p>
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
