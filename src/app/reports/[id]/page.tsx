/** @format */

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getReportById, getReportActivities } from "@/actions/report";
import { Report, ReportActivity, ReportStatus } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, ThumbsUp, CheckCircle } from "lucide-react";
import Image from "next/image";
import { reverseGeocode, formatAddress, Address } from "@/lib/geocoding";
import Map from "@/components/Map";
import TimelineItem from "./TimelineItem";
import CommentBox from "./CommentBox";
import { Card, CardContent } from "@/components/ui/card";

const getStatusColorClass = (status: ReportStatus) => {
  switch (status) {
    case ReportStatus.IN_PROGRESS:
      return "bg-primary/20 text-primary hover:bg-primary/30 border-primary/20";
    case ReportStatus.RESOLVED:
      return "bg-green-100 text-green-700 hover:bg-green-200 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
    case ReportStatus.PENDING:
      return "bg-secondary text-secondary-foreground hover:bg-secondary/80";
    default:
      return "text-muted-foreground";
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function ReportDetailPage() {
  const router = useRouter();
  const params = useParams();
  const reportId = params?.id as string;

  const [report, setReport] = useState<Report | null>(null);
  const [activities, setActivities] = useState<ReportActivity[]>([]);
  const [address, setAddress] = useState<Address>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReportData();
  }, [reportId]);

  const loadReportData = async () => {
    try {
      const [fetchedReport, fetchedActivities] = await Promise.all([
        getReportById(reportId),
        getReportActivities(reportId),
      ]);

      if (fetchedReport) {
        setReport(fetchedReport);

        // Fetch address if location is available
        if (fetchedReport.latitude && fetchedReport.longitude) {
          reverseGeocode(fetchedReport.latitude, fetchedReport.longitude).then(
            setAddress
          );
        }

        // Sort activities by date
        fetchedActivities.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        setActivities(fetchedActivities);
      }
    } catch (error) {
      console.error("Failed to load report:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAdded = (newActivity: ReportActivity) => {
    setActivities((prev) => [...prev, newActivity]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Report Not Found</h1>
        <Button onClick={() => router.push("/reports")}>Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 border-b border-border pb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div className="space-y-4 flex-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/reports")}
                className="-ml-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Reports
              </Button>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    {report.title}
                  </h1>
                  <span className="text-xl text-muted-foreground font-light">
                    #{report.id.slice(0, 6)}
                  </span>
                </div>
                <div className="flex items-center flex-wrap gap-3 text-sm text-muted-foreground">
                  <Badge
                    variant="outline"
                    className={getStatusColorClass(report.status)}
                  >
                    {report.status === ReportStatus.RESOLVED && (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    )}
                    {report.status.replace("_", " ")}
                  </Badge>
                  <span className="font-medium text-foreground">
                    {report.creator?.fullName || "User"}
                  </span>
                  <span>opened on {formatDate(report.createdAt)}</span>
                  <span>• {activities.length} activities</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {report.status !== ReportStatus.ARCHIVED &&
                report.status !== ReportStatus.RESOLVED && (
                  <Button
                    onClick={() => router.push(`/reports/${report.id}/resolve`)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Resolve Issue
                  </Button>
                )}
              {report.status === ReportStatus.ARCHIVED && (
                <Button variant="outline" disabled>
                  Archived
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column: Feed */}
          <div className="lg:col-span-3 space-y-2">
            {/* Main Issue Description as First Item */}
            <div className="flex gap-4 relative group pb-6">
              <div className="absolute left-[19px] top-10 bottom-0 w-px bg-border group-last:hidden"></div>

              <div className="flex-shrink-0 z-10">
                <Avatar className="w-10 h-10 border border-border">
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    {report.creator?.fullName.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1">
                <Card className="border-primary/20 bg-primary/5 shadow-sm">
                  <CardContent className="p-4 pt-4">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-primary/10">
                      <span className="font-semibold text-sm">
                        {report.creator?.fullName || "User"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        commented on {formatDate(report.createdAt)}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed mb-4">
                      {report.description}
                    </p>
                    {report.imageUrl && report.imageUrl.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          Attached Images
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {report.imageUrl.map((img, idx) => (
                            <div
                              key={idx}
                              className="relative h-40 w-auto min-w-[150px] aspect-video rounded-md overflow-hidden border border-border bg-muted"
                            >
                              <Image
                                src={img}
                                alt="Attachment"
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Activity Timeline */}
            {activities.map((activity) => (
              <TimelineItem key={activity.id} activity={activity} />
            ))}

            {/* Comment Box */}
            {report.status !== ReportStatus.ARCHIVED && (
              <div className="flex gap-4 pt-4">
                <div className="flex-shrink-0">
                  <Avatar className="w-10 h-10 border border-border">
                    <AvatarFallback className="bg-muted">
                      {/* Placeholder for current user */}U
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1">
                  {report.status === ReportStatus.RESOLVED ? (
                    <div className="bg-muted/40 border border-border rounded-xl p-4 text-center text-muted-foreground text-sm">
                      This issue is resolved. Comments are disabled.
                    </div>
                  ) : (
                    <CommentBox
                      reportId={reportId}
                      onCommentAdded={handleCommentAdded}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="space-y-6">
              <div className="border-b border-border pb-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Assignees
                </h3>
                <div className="text-sm text-muted-foreground italic">
                  No one assigned
                </div>
              </div>

              <div className="border-b border-border pb-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Labels
                </h3>
                <div className="flex flex-wrap gap-2">
                  {report.category && (
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 border-transparent"
                    >
                      {report.category.replace("_", " ")}
                    </Badge>
                  )}
                  <Badge
                    variant="outline"
                    className={getStatusColorClass(report.status)}
                  >
                    {report.status}
                  </Badge>
                  {/* isDuplicate flag might need to be checked if it exists in Report type or handled via status if its ARCHIVED/DUPLICATE */}
                </div>
              </div>

              <div className="border-b border-border pb-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Projects
                </h3>
                <div className="text-sm text-muted-foreground italic">
                  None yet
                </div>
              </div>

              <div className="border-b border-border pb-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(report.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ThumbsUp className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">
                      {report.upvotes || 0} upvotes
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Location
                </h3>
                {/* Map Placeholder or Actual Map if available */}
                <div className="rounded-lg overflow-hidden h-40 border border-border relative mb-2 bg-muted">
                  <Map
                    lat={report.latitude}
                    lng={report.longitude}
                    zoom={15}
                    className="w-full h-full"
                  />
                </div>
                <div className="text-xs text-muted-foreground flex justify-between">
                  <span
                    title={formatAddress(address)}
                    className="truncate max-w-[150px]"
                  >
                    {formatAddress(address)}
                  </span>
                  <div className="group/link relative inline-block">
                    <a
                      href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline ml-2"
                    >
                      Open in Maps
                    </a>
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
