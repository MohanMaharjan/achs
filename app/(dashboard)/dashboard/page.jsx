import VideoCard from "@/components/dashboard/VideoCard";

// Mock data - replace with actual data from your API
const videos = [
  {
    id: 1,
    title: "How to build a YouTube clone with Next.js",
    channel: "Code With Me",
    views: "120K views",
    timestamp: "3 days ago",
    thumbnail: "",
    avatar: "",
  },
  // Add more videos...
];

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}