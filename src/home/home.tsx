import React, { useEffect, useState } from "react";
import appwriteService, { Post } from "../appwrite/config";
import { Container, PostCard } from "../components";

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const result = await appwriteService.getPosts();
      if (result) {
        setPosts(result.documents);
      }
    };

    fetchPosts();
  }, []);

  if (posts.length === 0) {
    return (
      <div className="w-full py-16 text-center">
        <Container>
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <h1 className="text-3xl font-bold text-blue-800 mb-2">No Reports Yet</h1>
            <p className="text-gray-500 mb-4">Be the first to add a report!</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {posts.map((post) => (
            <PostCard key={post.$id} {...post} featuredImage={post.featuredImage || ""} />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Home;
