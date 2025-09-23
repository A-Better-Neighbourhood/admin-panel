
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
// Number of albums to show per page
const ALBUMS_PER_PAGE = 4;
import { Container, PostCard } from "../components";

// Extend Post type for demo to include road and upvotes
interface Post {
  $id: string;
  slug: string;
  $sequence?: number;
  $collectionId?: string;
  $databaseId?: string;
  $createdAt?: string;
  $updatedAt?: string;
  $permissions?: any[];
  title: string;
  content: string;
  featuredImage: string;
  status: string;
  userId: string;
  location?: { lat: number; lng: number };
  road?: string;
  upvotes?: number;
}

// DEMO: Sample images from public/sample-images
const DEMO_IMAGES: Post[] = [
  {
    $id: "sample7",
    slug: "sample7",
    $sequence: 7,
    $collectionId: "demo-collection",
    $databaseId: "demo-db",
    $createdAt: "2025-09-22T00:00:00.000Z",
    $updatedAt: "2025-09-22T00:00:00.000Z",
    $permissions: [],
    title: "Fallen Tree",
    content: "Tree has fallen and is blocking the road.",
    featuredImage: "/sample-images/sample1.jpg",
    status: "active",
    userId: "demo-user",
    location: { lat: 28.618, lng: 77.218 },
    road: "Green Avenue",
    upvotes: 4,
  },
  {
    $id: "sample8",
    slug: "sample8",
    $sequence: 8,
    $collectionId: "demo-collection",
    $databaseId: "demo-db",
    $createdAt: "2025-09-22T00:00:00.000Z",
    $updatedAt: "2025-09-22T00:00:00.000Z",
    $permissions: [],
    title: "Open Manhole",
    content: "Manhole cover is missing, dangerous for vehicles.",
    featuredImage: "/sample-images/sample2.jpg",
    status: "active",
    userId: "demo-user",
    location: { lat: 28.619, lng: 77.219 },
    road: "Sunset Boulevard",
    upvotes: 5,
  },
  {
    $id: "sample9",
    slug: "sample9",
    $sequence: 9,
    $collectionId: "demo-collection",
    $databaseId: "demo-db",
    $createdAt: "2025-09-22T00:00:00.000Z",
    $updatedAt: "2025-09-22T00:00:00.000Z",
    $permissions: [],
    title: "Street Flooding",
    content: "Heavy rain has caused flooding on the street.",
    featuredImage: "/sample-images/sample3.jpg",
    status: "active",
    userId: "demo-user",
    location: { lat: 28.620, lng: 77.220 },
    road: "Lake Road",
    upvotes: 2,
  },
  {
    $id: "sample4",
    slug: "sample4",
    $sequence: 4,
    $collectionId: "demo-collection",
    $databaseId: "demo-db",
    $createdAt: "2025-09-22T00:00:00.000Z",
    $updatedAt: "2025-09-22T00:00:00.000Z",
    $permissions: [],
    title: "Damaged Signboard",
    content: "Signboard is broken and unreadable.",
    featuredImage: "/sample-images/sample1.jpg",
    status: "active",
    userId: "demo-user",
    location: { lat: 28.615, lng: 77.215 },
    road: "Ring Road",
    upvotes: 0,
  },
  {
    $id: "sample5",
    slug: "sample5",
    $sequence: 5,
    $collectionId: "demo-collection",
    $databaseId: "demo-db",
    $createdAt: "2025-09-22T00:00:00.000Z",
    $updatedAt: "2025-09-22T00:00:00.000Z",
    $permissions: [],
    title: "Water Leakage",
    content: "Water leaking from main pipe.",
    featuredImage: "/sample-images/sample2.jpg",
    status: "active",
    userId: "demo-user",
    location: { lat: 28.616, lng: 77.216 },
    road: "MG Road",
    upvotes: 0,
  },
  {
    $id: "sample6",
    slug: "sample6",
    $sequence: 6,
    $collectionId: "demo-collection",
    $databaseId: "demo-db",
    $createdAt: "2025-09-22T00:00:00.000Z",
    $updatedAt: "2025-09-22T00:00:00.000Z",
    $permissions: [],
    title: "Blocked Drain",
    content: "Drain is blocked and causing flooding.",
    featuredImage: "/sample-images/sample3.jpg",
    status: "active",
    userId: "demo-user",
    location: { lat: 28.617, lng: 77.217 },
    road: "Link Road",
    upvotes: 0,
  },
  {
    $id: "sample1",
    slug: "sample1",
    $sequence: 1,
    $collectionId: "demo-collection",
    $databaseId: "demo-db",
    $createdAt: "2025-09-22T00:00:00.000Z",
    $updatedAt: "2025-09-22T00:00:00.000Z",
    $permissions: [],
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
    slug: "sample2",
    $sequence: 2,
    $collectionId: "demo-collection",
    $databaseId: "demo-db",
    $createdAt: "2025-09-22T00:00:00.000Z",
    $updatedAt: "2025-09-22T00:00:00.000Z",
    $permissions: [],
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
    slug: "sample3",
    $sequence: 3,
    $collectionId: "demo-collection",
    $databaseId: "demo-db",
    $createdAt: "2025-09-22T00:00:00.000Z",
    $updatedAt: "2025-09-22T00:00:00.000Z",
    $permissions: [],
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

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [modalAlbum, setModalAlbum] = useState<{ road: string; posts: Post[] } | null>(null);
  const [userUpvotedAlbums, setUserUpvotedAlbums] = useState<{ [road: string]: boolean }>({});
  const [postsState, setPostsState] = useState<Post[]>([]);
  const [albumPage, setAlbumPage] = useState(0);
  const userData = useSelector((state: RootState) => state.auth.userData);


  // For demo: always show sample images
  useEffect(() => {
    setPosts(DEMO_IMAGES as unknown as Post[]);
    setPostsState(DEMO_IMAGES as unknown as Post[]);
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


  // For demo: show only active sample images
  const activePosts = posts.filter(post => post.status === "active");
  // Group posts by road (location)
  const groupByRoad = (posts: Post[]) => {
    const albums: { [road: string]: Post[] } = {};
    posts.forEach(post => {
      if (post.status !== "active") return;
      const road = post.road || "Unknown Road";
      if (!albums[road]) albums[road] = [];
      albums[road].push(post);
    });
    return albums;
  };

  // Sort albums by upvotes (descending)
  const albumsObj = groupByRoad(postsState.length ? postsState : posts);
  const sortedAlbums = Object.entries(albumsObj)
    .sort(([, aPosts], [, bPosts]) => (bPosts[0].upvotes || 0) - (aPosts[0].upvotes || 0));

  // Pagination logic
  const totalAlbums = sortedAlbums.length;
  const maxPage = Math.max(0, Math.ceil(totalAlbums / ALBUMS_PER_PAGE) - 1);
  const pagedAlbums = sortedAlbums.slice(albumPage * ALBUMS_PER_PAGE, (albumPage + 1) * ALBUMS_PER_PAGE);

  // Upvote handler: only allow one upvote per user per album
  const handleUpvote = (road: string) => {
    if (userUpvotedAlbums[road]) return;
    setPostsState(prev => {
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

    // Track user upvotes in localStorage for dashboard
    if (userData && userData.$id) {
      let upvotes = Number(localStorage.getItem("userUpvotes_" + userData.$id) || "0");
      upvotes += 1;
      localStorage.setItem("userUpvotes_" + userData.$id, upvotes.toString());
      // Trigger storage event for dashboard sync
      window.dispatchEvent(new Event("storage"));
    }
  };

  // Edit and Delete handlers (demo only)
  const handleEdit = (postId: string) => {
    alert(`Edit post ${postId}`);
  };
  const handleDelete = (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setPostsState(prev => prev.filter(post => post.$id !== postId));
      setModalAlbum(null);
    }
  };

  return (
    <div className="w-full min-h-[80vh] flex flex-col justify-center py-8">
      <Container>
        <div className="relative flex flex-col justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
            {pagedAlbums.map(([road, posts]) => {
              const coverPost = posts[0];
              const albumUpvotes = coverPost.upvotes || 0;
              return (
                <div key={road} className="rounded-2xl bg-white/90 shadow-xl border border-blue-200 p-4 flex flex-col">
                  <h2 className="text-lg font-bold text-blue-800 mb-2 truncate">{coverPost.title}</h2>
                  <div className="mb-2 text-gray-700 font-medium">Road: {road}</div>
                  <div className="mb-2 flex flex-col items-center">
                    <img
                      src={coverPost.featuredImage || "/placeholder.png"}
                      alt={coverPost.title}
                      className="w-44 h-44 object-cover rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:scale-105 transition"
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
          {/* Single Arrow Pagination, not overlapping albums */}
          {totalAlbums > ALBUMS_PER_PAGE && (
            <>
              {albumPage > 0 && (
                <button
                  className="fixed left-4 top-1/2 z-30 bg-blue-200 text-blue-800 rounded-full p-3 shadow-lg hover:bg-blue-300 transition"
                  style={{ transform: 'translateY(-50%)' }}
                  onClick={() => setAlbumPage(p => Math.max(0, p - 1))}
                  aria-label="Previous"
                >
                  <span className="text-3xl">&#8592;</span>
                </button>
              )}
              {albumPage < maxPage && (
                <button
                  className="fixed right-4 top-1/2 z-30 bg-blue-200 text-blue-800 rounded-full p-3 shadow-lg hover:bg-blue-300 transition"
                  style={{ transform: 'translateY(-50%)' }}
                  onClick={() => setAlbumPage(p => Math.min(maxPage, p + 1))}
                  aria-label="Next"
                >
                  <span className="text-3xl">&#8594;</span>
                </button>
              )}
            </>
          )}
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
                    className="w-40 h-40 object-cover rounded-lg border border-gray-100 shadow-sm"
                  />
                ))}
              </div>
              <div className="flex gap-4">
                <button
                  className="px-4 py-2 rounded bg-yellow-400 text-blue-900 font-bold hover:bg-yellow-500 transition"
                  onClick={() => handleEdit(modalAlbum.posts[0].$id)}
                >Edit</button>
                <button
                  className="px-4 py-2 rounded bg-red-500 text-white font-bold hover:bg-red-600 transition"
                  onClick={() => handleDelete(modalAlbum.posts[0].$id)}
                >Delete</button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Home;
