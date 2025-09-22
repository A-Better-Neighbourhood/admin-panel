"use client";


import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Container } from "../components";
import PostCard from "../components/postCard";
import appwriteService from "../appwrite/config";

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
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [modalPostId, setModalPostId] = useState<string | null>(null);
  const userData = useSelector((state: RootState) => state.auth.userData);

  useEffect(() => {
    appwriteService.getPosts([]).then((posts: any) => {
      if (posts) {
        setPosts(posts.documents);
      }
    });
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

  // Only show posts uploaded by the current user
  const userPosts = userData ? posts.filter(post => post.userId === userData.$id) : [];
  const albums = groupByRoad(userPosts);

  // Upvote handler (demo only, should be replaced with backend logic)
  const handleUpvote = (road: string) => {
    setPosts(prev => prev.map(post => post.road === road ? { ...post, upvotes: (post.upvotes || 0) + 1 } : post));
  };

  // Edit and Delete handlers (demo only)
  const handleEdit = (postId: string) => {
    alert(`Edit post ${postId}`);
  };
  const handleDelete = (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setPosts(prev => prev.filter(post => post.$id !== postId));
      setModalImage(null);
      setModalPostId(null);
    }
  };

  return (
    <div className="w-full py-8">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Object.entries(albums).map(([road, posts]) => {
            // Album upvotes: sum upvotes of all posts in this album
            const albumUpvotes = posts.reduce((sum, p) => sum + (p.upvotes || 0), 0);
            return (
              <div key={road} className="rounded-2xl bg-white/90 shadow-xl border border-blue-200 p-4 flex flex-col">
                <h2 className="text-lg font-bold text-blue-800 mb-2 truncate">{posts[0].title}</h2>
                <div className="mb-2 text-gray-700 font-medium">Road: {road}</div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {posts.map(post => (
                    <img
                      key={post.$id}
                      src={post.featuredImage || "/placeholder.png"}
                      alt={post.title}
                      className="w-24 h-24 object-cover rounded-lg border border-gray-100 shadow-sm cursor-pointer hover:scale-105 transition"
                      onClick={() => { setModalImage(post.featuredImage || "/placeholder.png"); setModalPostId(post.$id); }}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between mt-auto gap-2">
                  <button
                    className="px-3 py-1 text-xs rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
                    onClick={() => handleUpvote(road)}
                  >
                    Upvote
                  </button>
                  <span className="inline-block px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 font-semibold">Upvotes: {albumUpvotes}</span>
                  <span className="inline-block px-2 py-1 text-xs rounded bg-gray-100 text-gray-700 font-semibold">{posts[0].status}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal for image with edit/delete */}
        {modalImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white rounded-2xl shadow-2xl p-6 relative max-w-xs w-full flex flex-col items-center">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl" onClick={() => setModalImage(null)}>&times;</button>
              <img src={modalImage} alt="Post" className="w-64 h-64 object-contain rounded-xl mb-4" />
              <div className="flex gap-4">
                <button
                  className="px-4 py-2 rounded bg-yellow-400 text-blue-900 font-bold hover:bg-yellow-500 transition"
                  onClick={() => handleEdit(modalPostId!)}
                >Edit</button>
                <button
                  className="px-4 py-2 rounded bg-red-500 text-white font-bold hover:bg-red-600 transition"
                  onClick={() => handleDelete(modalPostId!)}
                >Delete</button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default AllPosts;
