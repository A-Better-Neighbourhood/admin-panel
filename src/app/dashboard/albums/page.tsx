"use client";

import { useState, useEffect } from "react";
import { ReportCard } from "@/components/ReportCard";
import { Issue, issuesAPI } from "@/lib/api";
import { groupIssuesByLocation, LocationCluster } from "@/lib/locationGrouping";
import { AlertCircle, MapPin } from "lucide-react";

export default function AlbumReportsPage() {
  const [clusters, setClusters] = useState<LocationCluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [radiusKm, setRadiusKm] = useState(2);

  useEffect(() => {
    loadAlbumReports();
  }, [radiusKm]);

  const loadAlbumReports = async () => {
    try {
      setLoading(true);
      const allIssues = await issuesAPI.getAllIssues();
      const grouped = groupIssuesByLocation(allIssues, radiusKm);
      setClusters(grouped);
    } catch (error) {
      console.error("Failed to load album reports:", error);
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
      // Update local state
      setClusters(
        clusters.map((cluster) => ({
          ...cluster,
          issues: cluster.issues.map((issue) =>
            issue.id === issueId ? { ...issue, status } : issue
          ),
        }))
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDelete = async (issueId: string) => {
    if (!confirm("Are you sure you want to delete this report?")) return;

    try {
      await issuesAPI.deleteIssue(issueId);
      // Remove from clusters
      setClusters(
        clusters
          .map((cluster) => ({
            ...cluster,
            issues: cluster.issues.filter((issue) => issue.id !== issueId),
          }))
          .filter((cluster) => cluster.issues.length > 0)
      );
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
          <MapPin className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Album Reports</h1>
        </div>
        <p className="text-gray-600">
          Reports grouped by location with similar issues clustered together
        </p>
      </div>

      {/* Radius Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-4">
          <label className="font-medium text-gray-900">
            Grouping Radius:
          </label>
          <select
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={1}>1 km</option>
            <option value={2}>2 km</option>
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
          </select>
          <span className="text-sm text-gray-600 ml-auto">
            {clusters.length} cluster{clusters.length !== 1 ? "s" : ""} found
          </span>
        </div>
      </div>

      {/* Album Clusters */}
      {clusters.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No reports found
          </h3>
          <p className="text-gray-600">
            Start by creating reports to see them grouped by location
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {clusters.map((cluster) => (
            <div
              key={cluster.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
            >
              {/* Cluster Header */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      Location Cluster #{clusters.indexOf(cluster) + 1}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {cluster.center.lat.toFixed(4)}, {cluster.center.lng.toFixed(4)}
                      </span>
                      <span className="ml-2">
                        (Radius: {cluster.radius.toFixed(2)} km)
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      {cluster.count}
                    </div>
                    <div className="text-sm text-gray-600">
                      Report{cluster.count !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>

                {/* Top Upvotes */}
                <div className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-full w-fit">
                  <span className="text-lg">👍</span>
                  <span className="font-semibold">{cluster.topUpvotes}</span>
                  <span className="text-sm">Top Upvotes</span>
                </div>
              </div>

              {/* Reports Grid */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cluster.issues.map((issue) => (
                    <ReportCard
                      key={issue.id}
                      issue={issue}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
