"use client";
// This file is a client component so we can use React hooks like useState

import React, { useState } from "react";

interface PostCardProps {
  $id: string;
  title: string;
  content: string;
  featuredImage?: string;
  status: "active" | "inactive";
  userId: string;
  upvotes?: number;
}

const PostCard: React.FC<PostCardProps> = ({
  $id,
  title,
  content,
  featuredImage,
  status,
  userId,
  upvotes = 0,
}) => {
  const [localUpvotes, setLocalUpvotes] = useState(upvotes);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  const handleUpvote = () => {
    if (!hasUpvoted) {
      setLocalUpvotes(localUpvotes + 1);
      setHasUpvoted(true);
    }
  };

  return (
    <div className="rounded-2xl bg-white/80 shadow-xl border border-gray-200 p-4 backdrop-blur-md hover:scale-[1.03] hover:shadow-2xl transition-transform duration-200 flex flex-col h-full">
      <img
        src={featuredImage || "/placeholder.png"}
        alt={title}
        className="w-full h-40 object-cover rounded-xl mb-3 border border-gray-100 shadow-sm"
      />
      <h2 className="text-lg font-bold text-blue-800 mb-1 truncate">{title}</h2>
      <p className="text-gray-700 flex-1 mb-2">{content.slice(0, 100)}...</p>
      <div className="flex items-center justify-between mt-auto gap-2">
        <span className="inline-block px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 font-semibold">{status}</span>
        <button
          className={`px-3 py-1 text-xs rounded font-semibold transition ${hasUpvoted ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
          onClick={handleUpvote}
          disabled={hasUpvoted}
        >
          Upvote
        </button>
        <span className="inline-block px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 font-semibold">Upvotes: {localUpvotes}</span>
      </div>
    </div>
  );
};

export default PostCard;
