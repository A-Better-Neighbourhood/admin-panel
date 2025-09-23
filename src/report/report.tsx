"use client";


import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Container } from "../components";
import PostCard from "../components/postCard";

interface Post {
  $id: string;
  title: string;
  content: string;
  featuredImage?: string;
  status: "active" | "inactive";
  userId: string;
  location?: { lat: number; lng: number };
  road?: string;
  upvotes?: number;
}


const AllPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [modalAlbum, setModalAlbum] = useState<{ road: string; posts: Post[] } | null>(null);
  const [userUpvotedAlbums, setUserUpvotedAlbums] = useState<{ [road: string]: boolean }>({});
  const userData = useSelector((state: RootState) => state.auth.userData);


  // DEMO: Inject sample posts if no posts exist (for testing UI with sample images)
  useEffect(() => {
    // Use local sample posts for demo/testing
    const SAMPLE_POSTS: Post[] = [
      {
        $id: "sample1",
        title: "Pothole on Main Street",
        content: "Large pothole causing traffic issues.",
        featuredImage: "/sample-images/sample1.jpg",
        status: "active",
        userId: "demo-user",
        location: { lat: 28.6139, lng: 77.209 },
        road: "Main Street",
        upvotes: 3,
      },
      {
        $id: "sample2",
        title: "Broken Streetlight",
        content: "Streetlight not working at night.",
        featuredImage: "/sample-images/sample2.jpg",
        status: "active",
        userId: "demo-user",
        location: { lat: 28.614, lng: 77.21 },
        road: "Main Street",
        upvotes: 2,
      },
      {
        $id: "sample3",
        title: "Overflowing Garbage Bin",
        content: "Garbage bin needs urgent cleaning.",
        featuredImage: "/sample-images/sample3.jpg",
        status: "inactive",
        userId: "demo-user",
        location: { lat: 28.62, lng: 77.22 },
        road: "Park Avenue",
        upvotes: 1,
      },
    ];
    setPosts(SAMPLE_POSTS);
  }, []);

  // Group posts by road (location)
  const groupByRoad = (posts: Post[]) => {
    const albums: { [road: string]: Post[] } = {};
    posts.forEach(post => {
      const road = post.road || "Unknown Road";
      if (!albums[road]) albums[road] = [];
      albums[road].push(post);
    });
    return albums;
  };

  // Only show posts uploaded by the current user, or demo posts if no user
  let userPosts: Post[] = [];
  if (userData && posts.length > 0 && posts[0].userId !== "demo-user") {
    userPosts = posts.filter(post => post.userId === userData.$id);
  } else {
    userPosts = posts; // Show demo/sample posts if no real user posts
  }
  const albums = groupByRoad(userPosts);


  // Upvote handler: only allow one upvote per user per album
  const handleUpvote = (road: string) => {
    if (userUpvotedAlbums[road]) return; // already upvoted
    // Only increase upvotes for the first post in the album (cover post)
    setPosts(prev => {
      let upvoted = false;
      return prev.map(post => {
        if (post.road === road && !upvoted) {
          upvoted = true;
          return { ...post, upvotes: (post.upvotes || 0) + 1 };
        }
        return post;
      });
    });
    setUserUpvotedAlbums(prev => ({ ...prev, [road]: true }));
  };

  // Edit and Delete handlers (demo only)
  const handleEdit = (postId: string) => {
    alert(`Edit post ${postId}`);
  };
  const handleDelete = (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setPosts(prev => prev.filter(post => post.$id !== postId));
      setModalAlbum(null);
    }
  };

  return (
    <div className="w-full py-8">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Object.entries(albums).map(([road, posts]) => {
            // Album upvotes: only use the upvotes of the first post (cover post)
            const albumUpvotes = posts[0].upvotes || 0;
            // Album cover: first image
            const coverPost = posts[0];
            return (
              <div key={road} className="rounded-2xl bg-white/90 shadow-xl border border-blue-200 p-4 flex flex-col mt-8">
                <h2 className="text-lg font-bold text-blue-800 mb-2 truncate">{coverPost.title}</h2>
                <div className="mb-2 text-gray-700 font-medium">Road: {road}</div>
                <div className="mb-2 flex flex-col items-center">
                  <img
                    src={coverPost.featuredImage || "/placeholder.png"}
                    alt={coverPost.title}
                    className="w-44 h-44 object-cover rounded-xl border border-gray-100 shadow-md cursor-pointer hover:scale-105 transition"
                    onClick={() => setModalAlbum({ road, posts })}
                  />
                  {posts.length > 1 && (
                    <span className="mt-1 text-xs text-gray-500">+{posts.length - 1} more</span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-auto gap-2">
                  <button
                    className={`px-3 py-1 text-xs rounded font-semibold transition ${userUpvotedAlbums[road] ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                    onClick={() => handleUpvote(road)}
                    disabled={userUpvotedAlbums[road]}
                  >
                    Upvote
                  </button>
                  <span className="inline-block px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 font-semibold">Upvotes: {albumUpvotes}</span>
                  <span className="inline-block px-2 py-1 text-xs rounded bg-gray-100 text-gray-700 font-semibold">{coverPost.status}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal for album images */}
        {modalAlbum && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white rounded-2xl shadow-2xl p-6 relative max-w-lg w-full flex flex-col items-center">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl" onClick={() => setModalAlbum(null)}>&times;</button>
              <h3 className="text-lg font-bold text-blue-800 mb-2">{modalAlbum.road} Album</h3>
              <div className="flex flex-wrap gap-4 justify-center mb-4">
                {modalAlbum.posts.map(post => (
                  <img
                    key={post.$id}
                    src={post.featuredImage || "/placeholder.png"}
                    alt={post.title}
                    className="w-56 h-56 object-cover rounded-xl border border-gray-100 shadow-md"
                  />
                ))}
              </div>
              {/* Removed edit and delete buttons as requested */}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default AllPosts;
