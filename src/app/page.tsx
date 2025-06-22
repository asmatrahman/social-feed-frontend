import VideoCard from "@/components/VideoCard";
import { fetchVideos } from "@/lib/api";
import type { VideosResponse } from "@/lib/types";
import PaginationControls from "@/components/PaginationControls";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export const revalidate = 60;
interface HomePageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const currentPage = Number.parseInt(params.page || "1", 10);
  const limit = Number.parseInt(params.limit || "10", 10);

  let videos: VideosResponse["videos"] = [];
  let totalPages = 1;
  let error: string | null = null;

  try {
    const data = await fetchVideos(currentPage, limit);
    videos = data.videos;
    totalPages = data.totalPages || 1;
  } catch (err: any) {
    console.error("Failed to fetch videos:", err);
    error = err.message || "Failed to load videos. Please try again later.";
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Latest Videos</h1>
      {error ? (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : videos.length === 0 && currentPage === 1 ? (
        <div className="flex h-64 items-center justify-center rounded-lg border border-muted bg-muted/50 p-4 text-muted ">
          <p>No videos found. Be the first to upload!</p>
        </div>
      ) : videos.length === 0 && currentPage > 1 ? (
        <div className="flex h-64 items-center justify-center rounded-lg border border-muted bg-muted/50 p-4 text-muted ">
          <p>
            No videos found on this page. Try going back to the previous page.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}

      {!error && videos.length > 0 && (
        <PaginationControls currentPage={currentPage} totalPages={totalPages} />
      )}
    </div>
  );
}
