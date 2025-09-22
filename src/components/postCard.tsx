import React from "react";

interface PostCardProps {
  $id: string;
  title: string;
  content: string;
  featuredImage?: string; // make it optional
  status: "active" | "inactive";
  userId: string;
}

const PostCard: React.FC<PostCardProps> = ({
  $id,
  title,
  content,
  featuredImage,
  status,
  userId,
}) => {
  return (
    <div className="rounded-2xl bg-white/80 shadow-xl border border-gray-200 p-4 backdrop-blur-md hover:scale-[1.03] hover:shadow-2xl transition-transform duration-200 flex flex-col h-full">
      <img
        src={featuredImage || "/placeholder.png"}
        alt={title}
        className="w-full h-40 object-cover rounded-xl mb-3 border border-gray-100 shadow-sm"
      />
      <h2 className="text-lg font-bold text-blue-800 mb-1 truncate">{title}</h2>
      <p className="text-gray-700 flex-1 mb-2">{content.slice(0, 100)}...</p>
      <div className="flex items-center justify-between mt-auto">
        <span className="inline-block px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 font-semibold">{status}</span>
        {/* Optionally, add more info here */}
      </div>
    </div>
  );
};

export default PostCard;
