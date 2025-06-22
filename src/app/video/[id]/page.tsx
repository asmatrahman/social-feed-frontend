import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchVideoById, fetchRecommendedVideos } from "@/lib/api";
import VideoCard from "@/components/VideoCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

interface VideoPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: VideoPageProps): Promise<Metadata> {
  const { id: videoId } = await params;
  try {
    const video = await fetchVideoById(videoId);
    return {
      title: video.title,
      description: video.description,
      openGraph: {
        images: [video.videoUrl],
      },
    };
  } catch (err: any) {
    return {
      title: err.message || "Video Not Found",
      description: "The requested video could not be found.",
    };
  }
}

export default async function VideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: videoId } = await params;
  let video: Awaited<ReturnType<typeof fetchVideoById>> | null = null;
  let recommendedVideos: Awaited<ReturnType<typeof fetchRecommendedVideos>> =
    [];
  let error: string | null = null;

  try {
    video = await fetchVideoById(videoId);
    recommendedVideos = await fetchRecommendedVideos();
    recommendedVideos = recommendedVideos
      .filter((rec) => rec.id !== video?.id)
      .slice(0, 5);
  } catch (err: any) {
    console.error(`Failed to fetch video ${videoId} or recommendations:`, err);
    error = err.message || "Failed to load video or recommendations.";
    if (err.status === 404) {
      notFound();
    }
  }

  if (!video) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Video Not Found</AlertTitle>
          <AlertDescription>
            The video you are looking for does not exist.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const uploadDate = new Date(video.uploadDate).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden py-0">
            <CardContent className="p-0">
              <video
                src={video.videoUrl}
                controls
                className="aspect-video w-full object-cover"
              >
                Your browser does not support the video tag.
              </video>
            </CardContent>
            <CardHeader className="p-4">
              <CardTitle className="text-2xl capitalize font-bold">
                {video.title}
              </CardTitle>
              <CardDescription className="flex items-center justify-between text-sm text-foreground">
                <p>Uploaded by: <span className="capitalize">{video.uploader.name}</span></p>
                <span>{uploadDate}</span>
              </CardDescription>
              {video.description && (
                <p className="mt-2 text-base text-muted-foreground">
                  {video.description}
                </p>
              )}
            </CardHeader>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <h2 className="mb-4 text-2xl font-bold">Recommended Videos</h2>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {recommendedVideos.length === 0 ? (
            <div className="flex h-32 items-center justify-center rounded-lg border border-muted bg-muted/50 p-4 text-foreground">
              <p>No recommendations available.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {recommendedVideos.map((recVideo) => (
                <VideoCard key={recVideo.id} video={recVideo} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
