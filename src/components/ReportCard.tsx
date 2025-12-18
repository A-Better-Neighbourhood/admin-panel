/** @format */

"use client";

import Image from "next/image";
import { Report, ReportStatus } from "@/types/api";
import {
  MapPin,
  Calendar,
  ThumbsUp,
  User,
  Images,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { reverseGeocode, formatAddress, Address } from "@/lib/geocoding";

// Helper for status badge
const getStatusStyles = (status: ReportStatus) => {
  const styles = {
    [ReportStatus.PENDING]:
      "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    [ReportStatus.IN_PROGRESS]:
      "bg-primary/20 text-primary hover:bg-primary/30",
    [ReportStatus.RESOLVED]:
      "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400",
    [ReportStatus.ARCHIVED]: "bg-muted text-muted-foreground hover:bg-muted/80",
  };
  return styles[status] || styles[ReportStatus.PENDING];
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

interface ReportCardProps {
  issue: Report;
  onStatusChange?: (issueId: string, status: ReportStatus) => void;
  onDelete?: (issueId: string) => void;
}

export function ReportCard({
  issue,
  onStatusChange,
  onDelete,
}: ReportCardProps) {
  const [showImagesDialog, setShowImagesDialog] = useState(false);
  const [address, setAddress] = useState<Address>({});
  const [loadingAddress, setLoadingAddress] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchAddress = async () => {
      if (issue.latitude && issue.longitude) {
        setLoadingAddress(true);
        const addr = await reverseGeocode(issue.latitude, issue.longitude);
        setAddress(addr);
        setLoadingAddress(false);
      }
    };
    fetchAddress();
  }, [issue.latitude, issue.longitude]);

  return (
    <>
      <Card className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow border-border/50 group">
        {/* Card Header: Title and Status */}
        <CardHeader className="p-4 pb-2 flex-row items-start justify-between space-y-0 gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${getStatusStyles(
                  issue.status
                )}`}
              >
                {issue.status.replace("_", " ")}
              </span>
              {issue.duplicateCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-orange-100 text-orange-700">
                  {issue.duplicateCount} Dups
                </span>
              )}
            </div>
            <h3
              className="font-bold text-base leading-tight cursor-pointer hover:text-primary transition-colors truncate"
              onClick={() => router.push(`/reports/${issue.id}`)}
              title={issue.title}
            >
              {issue.title}
            </h3>
          </div>
          <div className="flex flex-col items-end text-xs text-muted-foreground whitespace-nowrap">
            {/* Small Date */}
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(issue.createdAt)}</span>
            </div>
          </div>
        </CardHeader>

        {/* Card Content */}
        <CardContent className="p-4 pt-2 flex-1 flex flex-col gap-4">
          {/* Image & Description Split (or Stack depending on space) */}
          <div
            className="relative w-full aspect-video rounded-md overflow-hidden bg-muted cursor-pointer"
            onClick={() => setShowImagesDialog(true)}
          >
            {issue.imageUrl && issue.imageUrl.length > 0 ? (
              <>
                <Image
                  src={issue.imageUrl[0]}
                  alt={issue.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {issue.imageUrl.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white px-1.5 py-0.5 rounded text-[10px] flex items-center gap-1 backdrop-blur-sm">
                    <Images className="h-3 w-3" />+{issue.imageUrl.length - 1}
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <Images className="h-8 w-8 opacity-20" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {issue.description}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded-md">
            <div className="flex items-center gap-1.5 min-w-0">
              <User className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">
                {issue.creator?.fullName || "User"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <ThumbsUp className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
              <span className="font-medium text-foreground">
                {issue.upvotes} Upvotes
              </span>
            </div>
            <div className="col-span-2 flex items-center gap-1.5 min-w-0">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate" title={formatAddress(address)}>
                {loadingAddress ? "Locating..." : formatAddress(address)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images Dialog */}
      <Dialog open={showImagesDialog} onOpenChange={setShowImagesDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-4">
              <DialogTitle className="text-xl">{issue.title}</DialogTitle>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(
                  issue.status
                )}`}
              >
                {issue.status.replace("_", " ")}
              </span>
            </div>
            <DialogDescription>
              Reported by {issue.creator?.fullName} on{" "}
              {formatDate(issue.createdAt)}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Images Grid */}
            <div className="space-y-4">
              {issue.imageUrl && issue.imageUrl.length > 0 ? (
                issue.imageUrl.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-video rounded-lg overflow-hidden border border-border bg-muted"
                  >
                    <Image
                      src={url}
                      alt={`${issue.title} - Image ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))
              ) : (
                <div className="aspect-video flex items-center justify-center bg-muted rounded-lg border border-border">
                  <p className="text-muted-foreground">No images attached</p>
                </div>
              )}
            </div>

            {/* Details Panel */}
            <div className="space-y-6">
              <div className="bg-muted/30 p-6 rounded-xl border border-border/50">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Description
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {issue.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Location
                  </h4>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">
                        {loadingAddress ? "Loading..." : formatAddress(address)}
                      </p>
                      <a
                        href={`https://www.google.com/maps?q=${issue.latitude},${issue.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline mt-1 inline-block"
                      >
                        View on Maps
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Community
                  </h4>
                  <div className="flex items-start gap-2">
                    <ThumbsUp className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">
                        {issue.upvotes} Upvotes
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        High engagement
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
