/** @format */

import { ReportActivity, ActivityType } from "@/types/api";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { CheckCircle, Info, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineItemProps {
  activity: ReportActivity;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function TimelineItem({ activity }: TimelineItemProps) {
  const isComment =
    activity.type === ActivityType.USER_COMMENTED ||
    activity.type === ActivityType.AUTHORITY_COMMENTED;
  const isDuplicate = activity.type === ActivityType.DUPLICATE_MERGED;
  // System events are everything else that isn't a comment or specifically displayed as a card
  const isSystem = !isComment && !isDuplicate;

  if (isSystem) {
    return (
      <div className="flex gap-4 relative group pb-4">
        {/* Timeline Line */}
        <div className="absolute left-[19px] top-6 bottom-0 w-px bg-border group-last:hidden"></div>

        <div className="flex-shrink-0 z-10 mt-1">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border">
            {activity.type === ActivityType.REPORT_CREATED && (
              <FileText className="w-5 h-5 text-muted-foreground" />
            )}
            {activity.type === ActivityType.STATUS_UPDATED && (
              <Info className="w-5 h-5 text-blue-500" />
            )}
            {activity.type === ActivityType.MARKED_RESOLVED && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
          </div>
        </div>
        <div className="flex-1 pt-1.5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {activity.createdBy?.fullName || "System"}
            </span>
            <span>{activity.content}</span>
            <span className="text-xs">{formatDate(activity.createdAt)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 relative group pb-6">
      {/* Timeline Line */}
      <div className="absolute left-[19px] top-10 bottom-0 w-px bg-border group-last:hidden"></div>

      {/* Avatar */}
      <div className="flex-shrink-0 z-10">
        <Avatar className="w-10 h-10 border border-border">
          <AvatarFallback
            className={cn(
              isDuplicate
                ? "bg-orange-100 text-orange-700"
                : "bg-muted text-muted-foreground"
            )}
          >
            {activity.createdBy?.fullName.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Content */}
      <div className="flex-1">
        <Card
          className={cn(
            "border-border/50",
            isDuplicate &&
              "border-orange-200 bg-orange-50/10 dark:bg-orange-950/10"
          )}
        >
          <CardHeader className="p-3 py-0 bg-muted/30 border-b border-border/50 flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold">
                {activity.createdBy?.fullName || "Unknown"}
              </span>
              {isDuplicate && (
                <Badge
                  variant="outline"
                  className="text-orange-600 border-orange-200 bg-orange-50"
                >
                  Duplicate
                </Badge>
              )}
              <span className="text-muted-foreground text-xs">
                {isDuplicate ? "merged on" : "commented on"}{" "}
                {formatDate(activity.createdAt)}
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-4 text-sm leading-relaxed">
            {isDuplicate ? (
              <div className="text-muted-foreground mb-2">
                {activity.content}
              </div>
            ) : (
              <div className="whitespace-pre-wrap">{activity.content}</div>
            )}

            {/* Images */}
            {activity.images && activity.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {activity.images.map((img: string, idx: number) => (
                  <div
                    key={idx}
                    className="relative h-24 w-24 rounded-md overflow-hidden border border-border bg-muted"
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
