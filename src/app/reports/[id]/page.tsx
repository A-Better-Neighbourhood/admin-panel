"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Issue, issuesAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  ThumbsUp,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import { reverseGeocode, formatAddress, Address } from "@/lib/geocoding";

// Mock activities for now - you'll need to fetch these from the API
interface Activity {
  id: string;
  type:
    | "REPORT_CREATED"
    | "DUPLICATE_MERGED"
    | "COMMENT"
    | "STATUS_UPDATED"
    | "RESOLVED";
  content: string;
  createdBy: {
    fullName: string;
    role?: string;
  };
  createdAt: string;
  images?: string[];
  metadata?: any;
}

const getStatusBadge = (status: Issue["status"]) => {
  const styles = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    IN_PROGRESS: "bg-blue-100 text-blue-800 border-blue-200",
    RESOLVED: "bg-green-100 text-green-800 border-green-200",
    ARCHIVED: "bg-gray-100 text-gray-800 border-gray-200",
  };
  return styles[status] || styles.PENDING;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function ReportDetailPage() {
  const router = useRouter();
  const params = useParams();
  const reportId = params?.id as string;

  const [report, setReport] = useState<Issue | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [address, setAddress] = useState<Address>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReportData();
  }, [reportId]);

  const loadReportData = async () => {
    try {
      const data = await issuesAPI.getAllIssues();
      const foundReport = data.find((r) => r.id === reportId);
      if (foundReport) {
        setReport(foundReport);
        
        // Fetch address
        const addr = await reverseGeocode(foundReport.latitude, foundReport.longitude);
        setAddress(addr);

        // Generate activities based on report data
        const mockActivities: Activity[] = [
          {
            id: "1",
            type: "REPORT_CREATED",
            content: `Report "${foundReport.title}" was created`,
            createdBy: foundReport.creator,
            createdAt: foundReport.createdAt,
          },
        ];

        // Find all duplicate reports that were merged into this one
        const duplicateReports = data.filter(
          (r) => r.isDuplicate && r.parentReportId === reportId
        );

        // Add duplicate merged activities for each duplicate
        duplicateReports.forEach((duplicate, index) => {
          mockActivities.push({
            id: `dup-${duplicate.id}`,
            type: "DUPLICATE_MERGED",
            content: `Duplicate report merged (ID: ${duplicate.id.slice(0, 8)})`,
            createdBy: duplicate.creator,
            createdAt: duplicate.createdAt,
            metadata: {
              duplicateId: duplicate.id,
              images: duplicate.imageUrl,
            },
          });
        });

        // Sort activities by date
        mockActivities.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        // Add status update if not pending
        if (foundReport.status !== "PENDING") {
          mockActivities.push({
            id: "3",
            type: "STATUS_UPDATED",
            content: `Status updated to ${foundReport.status}`,
            createdBy: { fullName: "System" },
            createdAt: foundReport.updatedAt,
          });
        }

        setActivities(mockActivities);
      }
    } catch (error) {
      console.error("Failed to load report:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Report Not Found
          </h1>
          <Button onClick={() => router.push("/dashboard/reports")}>
            Back to Reports
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard/reports")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Reports
          </Button>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {report.title}
                  <span className="text-gray-400 font-light ml-3">
                    #{report.id.split("-")[1] || report.id.slice(0, 6)}
                  </span>
                </h1>
              </div>
              <div className="flex items-center flex-wrap gap-3 text-sm text-gray-600">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(
                    report.status
                  )}`}
                >
                  {report.status === "RESOLVED" ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Resolved
                    </span>
                  ) : (
                    report.status.replace("_", " ")
                  )}
                </span>
                <span className="font-medium text-gray-900">
                  {report.creator.fullName}
                </span>
                <span>
                  opened this on{" "}
                  {new Date(report.createdAt).toLocaleDateString()}
                </span>
                <span>· {activities.length} activities</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() =>
                  router.push(`/dashboard/reports/${report.id}/resolve`)
                }
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Resolve Issue
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column: Timeline */}
          <div className="lg:col-span-3 space-y-6">
            {/* Main Report as First "Comment" */}
            <div className="flex gap-4 py-4 relative group">
              {/* Timeline connector */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200 ml-4 -z-10"></div>

              {/* Avatar */}
              <div className="flex-shrink-0 z-10">
                <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-gray-600">
                  <span className="font-medium text-sm">
                    {report.creator.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Content Box */}
              <div className="flex-1 rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center gap-2 text-sm">
                  <span className="font-semibold text-gray-900">
                    {report.creator.fullName}
                  </span>
                  <span className="text-gray-500">
                    commented on {formatDate(report.createdAt)}
                  </span>
                </div>

                <div className="p-4">
                  <p className="text-gray-800 mb-4 whitespace-pre-wrap">
                    {report.description}
                  </p>

                  {report.imageUrl && report.imageUrl.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">
                        Attached Images
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {report.imageUrl.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative h-48 w-full md:w-auto md:min-w-[200px] rounded-lg overflow-hidden border border-gray-200"
                          >
                            <Image
                              src={img}
                              alt="Report attachment"
                              fill
                              className="bg-gray-50 object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Activity Timeline */}
            {activities.map((activity) => (
              <div key={activity.id}>
                {activity.type === "COMMENT" ? (
                  // Render Comment
                  <div className="flex gap-4 py-4 relative group">
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200 ml-4 -z-10"></div>
                    <div className="flex-shrink-0 z-10">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 bg-gray-100 border-white text-gray-600">
                        <span className="font-medium text-sm">
                          {activity.createdBy.fullName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-semibold text-gray-900">
                            {activity.createdBy.fullName}
                          </span>
                          <span className="text-gray-500">
                            commented on {formatDate(activity.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                        {activity.content}
                      </div>
                      {activity.images && activity.images.length > 0 && (
                        <div className="px-4 pb-4 flex flex-wrap gap-2">
                          {activity.images.map((img, idx) => (
                            <div
                              key={idx}
                              className="relative h-24 w-24 rounded-lg overflow-hidden border border-gray-200"
                            >
                              <Image
                                src={img}
                                alt={`Attachment ${idx + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : activity.type === "DUPLICATE_MERGED" && activity.metadata?.images ? (
                  // Render Duplicate Merged with Images
                  <div className="flex gap-4 py-4 relative group">
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200 ml-4 -z-10"></div>
                    <div className="flex-shrink-0 z-10">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 bg-orange-100 border-white text-orange-600">
                        <span className="font-medium text-sm">
                          {activity.createdBy.fullName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 rounded-xl border border-orange-200 bg-orange-50/30 overflow-hidden shadow-sm">
                      <div className="px-4 py-2 bg-orange-50 border-b border-orange-200 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-semibold text-orange-900">
                            {activity.createdBy.fullName}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-medium border border-orange-200">
                            Duplicate
                          </span>
                          <span className="text-gray-500">
                            merged on {formatDate(activity.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-gray-800 text-sm mb-3">
                          {activity.content}
                        </p>
                        {activity.metadata.images && activity.metadata.images.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {activity.metadata.images.map((img: string, idx: number) => (
                              <div
                                key={idx}
                                className="relative h-24 w-24 rounded-lg overflow-hidden border border-orange-200"
                              >
                                <Image
                                  src={img}
                                  alt={`Duplicate ${idx + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Render System Event
                  <div className="flex items-center gap-3 py-3 pl-4 relative">
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200 ml-4 -z-10"></div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 border border-gray-200 z-10">
                      {activity.type === "REPORT_CREATED" && (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                      {activity.type === "STATUS_UPDATED" && (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      )}
                      {activity.type === "RESOLVED" && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1 text-sm text-gray-600">
                      <span className="font-medium text-gray-900">
                        {activity.createdBy.fullName}
                      </span>{" "}
                      {activity.content}
                      <span className="text-gray-400 ml-2 text-xs">
                        {formatDate(activity.createdAt)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Labels
                </h3>
                <div className="flex flex-wrap gap-2">
                  {report.category && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium border border-blue-200">
                      {report.category.replace("_", " ")}
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(
                      report.status
                    )}`}
                  >
                    {report.status}
                  </span>
                  {report.isDuplicate && (
                    <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-medium border border-orange-200">
                      Duplicate
                    </span>
                  )}
                </div>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{report.creator.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <ThumbsUp className="h-4 w-4 fill-blue-500 text-blue-500" />
                    <span className="font-semibold">
                      {report.upvotes || 0} upvotes
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Location
                </h3>
                <div className="text-xs text-gray-600 space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-700 mb-1">
                        {formatAddress(address)}
                      </div>
                      <a
                        href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        <div>Lat: {report.latitude.toFixed(6)}</div>
                        <div>Lng: {report.longitude.toFixed(6)}</div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
