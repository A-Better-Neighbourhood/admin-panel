"use client";

import Image from "next/image";
import { Issue } from "@/lib/api";
import { MapPin, Calendar, ThumbsUp, User } from "lucide-react";
import { Button } from "./ui/button";
import { Select } from "./ui/select";

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
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-48">
        {issue.imageUrl && issue.imageUrl.length > 0 ? (
          <Image
            src={issue.imageUrl[0]}
            alt={issue.title}
            fill
            className="object-cover"
          />
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
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
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
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin className="h-4 w-4" />
            <span>
              {issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <ThumbsUp className="h-4 w-4" />
            <span>{issue.upvoteCount} upvotes</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Select
            value={issue.status}
            onValueChange={(status) =>
              onStatusChange?.(issue.id, status as Issue["status"])
            }
            className="flex-1"
          >
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="ARCHIVED">Archived</option>
          </Select>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete?.(issue.id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
