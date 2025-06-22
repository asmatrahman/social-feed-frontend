"use client";

import type { Video } from "@/lib/types";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";

export default function VideoCard({ video }: { video: Video }) {
  const uploadDate = new Date(video.uploadDate).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`/video/${video.id}`}>
      <Card className="group flex flex-col overflow-hidden py-0 rounded-lg transition-all hover:border-primary">
        <CardContent className="p-0">
          <video
            src={video.videoUrl}
            controls
            className="aspect-video w-full object-cover"
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        </CardContent>
        <CardHeader className="flex-grow p-4 pb-2">
          <h2 className="text-lg font-semibold capitalize leading-tight group-hover:text-primary">
            {video.title}
          </h2>

          {video.description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {video.description}
            </p>
          )}
        </CardHeader>
        <CardFooter className="flex items-center justify-between p-4 pt-0 text-sm text-foreground">
          <span className=" capitalize">{video.uploader.name}</span>
          <span>{uploadDate}</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
