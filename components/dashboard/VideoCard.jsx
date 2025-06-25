import Image from "next/image";
import Link from "next/link";

export default function VideoCard({ video }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/dashboard/watch/${video.id}`}>
        <div className="relative aspect-video">
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            className="object-cover"
          />
        </div>
      </Link>
      <div className="p-3">
        <div className="flex space-x-2">
          <div className="flex-shrink-0">
            <Image
              src={video.avatar}
              alt={video.channel}
              width={40}
              height={40}
              className="rounded-full"
            />
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