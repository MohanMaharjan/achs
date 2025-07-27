import Image from "next/image";
import Link from "next/link";

export default function VideoCard({ video }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/dashboard/watch/${video.id}`}>
        <div className="relative aspect-video">
          {video.thumbnail ? (
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No thumbnail</span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-3">
        <div className="flex space-x-2">
          <div className="flex-shrink-0">
            {video.avatar ? (
              <Image
                src={video.avatar}
                alt={video.channel}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xs text-gray-500">
                  {video.channel?.[0]?.toUpperCase() || "?"}
                </span>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900 line-clamp-2">
              {video.title}
            </h3>
            <p className="text-sm text-gray-500">{video.channel}</p>
            <p className="text-xs text-gray-400">
              {video.views} • {video.timestamp}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}