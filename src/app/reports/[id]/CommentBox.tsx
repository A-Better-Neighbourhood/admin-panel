/** @format */

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { addComment } from "@/actions/report";
import { toast } from "sonner";
import { ReportActivity } from "@/types/api";

interface CommentBoxProps {
  reportId: string;
  onCommentAdded?: (activity: ReportActivity) => void;
}

export default function CommentBox({
  reportId,
  onCommentAdded,
}: CommentBoxProps) {
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      const newActivity = await addComment(reportId, comment);
      setComment("");
      if (onCommentAdded) {
        onCommentAdded(newActivity);
      }
      toast.success("Comment added", {
        description: "Your comment has been posted successfully.",
      });
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: "Failed to post comment. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden shadow-sm focus-within:ring-1 focus-within:ring-ring transition-shadow">
      <Textarea
        placeholder="Leave a comment..."
        className="min-h-[100px] w-full resize-none border-0 focus-visible:ring-0 bg-transparent p-4 text-sm"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={submitting}
      />
      <div className="flex items-center justify-between px-4 py-2 bg-muted/20 border-t border-border">
        <div className="text-xs text-muted-foreground">Markdown supported</div>
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={!comment.trim() || submitting}
          className="h-8"
        >
          {submitting ? "Posting..." : "Comment"}
        </Button>
      </div>
    </div>
  );
}
