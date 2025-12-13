/** @format */

"use client";

import Image from "next/image";
import { Issue } from "@/lib/api";
import { MapPin, Calendar, ThumbsUp, User, Images } from "lucide-react";
import { Button } from "./ui/button";
import { Select } from "./ui/select";
import { Card, CardContent, CardFooter } from "./ui/card";
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

interface ReportCardProps {
  issue: Issue;
  onStatusChange?: (issueId: string, status: Issue["status"]) => void;
  onDelete?: (issueId: string) => void;
}

const getStatusBadge = (status: Issue["status"]) => {
  const styles = {
    PENDING: "bg-yellow-100 text-yellow-800",
    IN_PROGRESS: "bg-blue-100 text-blue-800",
    RESOLVED: "bg-green-100 text-green-800",
    ARCHIVED: "bg-gray-100 text-gray-800",
  };
  return styles[status] || styles.PENDING;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

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
      setLoadingAddress(true);
      const addr = await reverseGeocode(issue.latitude, issue.longitude);
      setAddress(addr);
      setLoadingAddress(false);
    };
    fetchAddress();
  }, [issue.latitude, issue.longitude]);

  const handleResolve = () => {
    router.push(`/dashboard/reports/${issue.id}/resolve`);
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        {/* Image */}
        <div
          className="relative h-48 cursor-pointer group"
          onClick={() => setShowImagesDialog(true)}
        >
          {issue.imageUrl && issue.imageUrl.length > 0 ? (
            <>
              <Image
                src={issue.imageUrl[0]}
                alt={issue.title}
                fill
                className="object-cover group-hover:opacity-90 transition-opacity"
              />
              {issue.imageUrl.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded-md flex items-center gap-1 text-xs">
                  <Images className="h-3 w-3" />
                  {issue.imageUrl.length} images
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                issue.status
              )}`}
            >
              {issue.status.replace("_", " ")}
            </span>
          </div>
          {issue.isDuplicate && (
            <div className="absolute top-3 right-3">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Duplicate
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4">
          <h3
            className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => router.push(`/dashboard/reports/${issue.id}`)}
          >
            {issue.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {issue.description}
          </p>

          {/* Meta Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <User className="h-4 w-4" />
              <span>{issue.creator.fullName}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(issue.createdAt)}</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-gray-500">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                {loadingAddress ? (
                  <span className="text-gray-400 italic">
                    Loading address...
                  </span>
                ) : (
                  <>
                    <div className="font-medium text-gray-700 mb-1">
                      {formatAddress(address)}
                    </div>
                    <a
                      href={`https://www.google.com/maps?q=${issue.latitude},${issue.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 hover:underline"
                    >
                      {issue.latitude.toFixed(6)}, {issue.longitude.toFixed(6)}
                    </a>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-700">
              <ThumbsUp className="h-4 w-4 fill-blue-500 text-blue-500" />
              <span className="font-semibold">{issue.upvotes || 0}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex gap-2">
          <div className="flex-1">
            <Select
              value={issue.status}
              onValueChange={(status) =>
                onStatusChange?.(issue.id, status as Issue["status"])
              }
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="ARCHIVED">Archived</option>
            </Select>
          </div>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            size="sm"
            onClick={handleResolve}
          >
            Resolve
          </Button>
        </CardFooter>
      </Card>

      {/* Images Dialog */}
      <Dialog open={showImagesDialog} onOpenChange={setShowImagesDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{issue.title}</DialogTitle>
            <DialogDescription>
              View all {issue.imageUrl.length} image(s) for this report
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {issue.imageUrl &&
              issue.imageUrl.map((url, idx) => (
                <div
                  key={idx}
                  className="relative h-64 rounded-lg overflow-hidden border border-gray-200"
                >
                  <Image
                    src={url}
                    alt={`${issue.title} - Image ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Report Details</h4>
            <p className="text-sm text-gray-600 mb-3">{issue.description}</p>
            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <User className="h-3 w-3" />
                <span>{issue.creator.fullName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(issue.createdAt)}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-700 mb-1">
                    {formatAddress(address)}
                  </div>
                  <a
                    href={`https://www.google.com/maps?q=${issue.latitude},${issue.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 hover:underline"
                  >
                    {issue.latitude.toFixed(6)}, {issue.longitude.toFixed(6)}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-3 w-3 fill-blue-500 text-blue-500" />
                <span className="font-semibold">
                  {issue.upvotes || 0} upvotes
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
