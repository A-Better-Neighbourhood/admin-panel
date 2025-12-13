/** @format */

"use client";

import { useState, useEffect } from "react";
import { ReportCard } from "@/components/ReportCard";
import { Issue, issuesAPI } from "@/lib/api";
import { Archive } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Archived Reports</h1>

        <p className="text-muted-foreground">Archived and duplicate reports</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search archived reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            Showing <strong>{filteredIssues.length}</strong> archived reports
          </div>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      {filteredIssues.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Archive className="h-6 w-6" />
            </EmptyMedia>
            <EmptyTitle>No archived reports</EmptyTitle>
            <EmptyDescription>
              Archived reports will appear here
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
