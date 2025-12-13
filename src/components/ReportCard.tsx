"use client";

import Image from "next/image";
import { Issue } from "@/lib/api";
import { MapPin, Calendar, ThumbsUp, User, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { Select } from "./ui/select";
import { useState, useEffect } from "react";
import { reverseGeocode } from "@/lib/geocoding";

interface ReportCardProps {
  issue: Issue;
  onStatusChange?: (issueId: string, status: Issue["status"]) => void;
  onDelete?: (issueId: string) => void;
  isRelated?: boolean;
  relatedCount?: number;
  issueNumber?: number;
  totalInCluster?: number;
}

const getStatusBadge = (status: Issue["status"]) => {
  const styles = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
    RESOLVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    ARCHIVED: "bg-slate-50 text-slate-700 border-slate-200",
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
  isRelated = false,
  relatedCount = 0,
  issueNumber = 1,
  totalInCluster = 1,
}: ReportCardProps) {
  const [locationName, setLocationName] = useState<string>("");

  useEffect(() => {
    const getLocation = async () => {
      const name = await reverseGeocode(issue.latitude, issue.longitude);
      setLocationName(name);
    };
    getLocation();
  }, [issue.latitude, issue.longitude]);

  return (
    <div className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col ${isRelated ? "border-blue-200" : "border-slate-200"}`}>
      {/* Image */}
      <div className="relative h-48">
        {issue.imageUrl && issue.imageUrl.length > 0 ? (
          <Image
            src={issue.imageUrl[0]}
            alt={issue.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
        {/* Status and Info badges */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm border inline-block ${getStatusBadge(
              issue.status
            )}`}
          >
            {issue.status.replace("_", " ")}
          </span>
        </div>
        {/* Issue Number Badge for Multiple Reports */}
        {totalInCluster > 1 && (
          <div className="absolute top-3 left-3 mt-8">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold shadow-sm border bg-purple-50 text-purple-700 border-purple-200 inline-block">
              Report #{issueNumber}/{totalInCluster}
            </span>
          </div>
        )}
        {/* Upvote and Related Count */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <div className="bg-white/90 backdrop-blur-md rounded-lg px-3 py-1.5 shadow-sm flex items-center gap-1.5 font-semibold text-blue-600">
            <ThumbsUp className="h-4 w-4" />
            <span className="text-sm">{issue.upvoteCount}</span>
          </div>
          {relatedCount > 0 && (
            <div className="bg-blue-600 text-white rounded-lg px-3 py-1.5 shadow-sm flex items-center gap-1 font-semibold text-xs">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{relatedCount}</span>
            </div>
          )}
        </div>
        {issue.isDuplicate && (
          <div className="absolute bottom-3 left-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm border bg-orange-50 text-orange-700 border-orange-200">
              Duplicate
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2">
          {issue.title}
        </h3>
        <p className="text-slate-600 text-sm line-clamp-2 mb-4 leading-relaxed flex-1">
          {issue.description}
        </p>

        {/* Meta Info */}
        <div className="space-y-2 mb-4 text-xs text-slate-600 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2">
            <User className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="font-medium">{issue.creator.fullName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{formatDate(issue.createdAt)}</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
            <span className="text-xs leading-relaxed break-words" title={locationName || "Loading location..."}>
              {locationName || "Loading location..."}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
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
