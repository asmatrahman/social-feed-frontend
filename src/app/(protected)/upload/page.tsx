"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { uploadVideo } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import Spinner from "@/components/Spinner";
import { toast } from "sonner";

export default function UploadPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Authentication Required", {
        description: "Please log in to upload videos.",
      });
      router.replace("/login");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Validation Error", {
        description: "Please select a video file.",
      });
      return;
    }
    if (!title.trim()) {
      toast.error("Validation Error", {
        description: "Video title is required.",
      });
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);
    formData.append("description", description);

    try {
      const res = await uploadVideo(formData);
      toast.success("Upload Successful!", {
        description: `Video "${res.title}" uploaded.`,
      });
      setTitle("");
      setDescription("");
      setFile(null);
      router.push("/");
    } catch (err: any) {
      toast.error("Upload Failed", {
        description:
          err.message || "An unexpected error occurred during upload.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mx-auto max-w-2xl bg-background">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Upload New Video</CardTitle>
          <CardDescription>
            Fill in the details and select your video file.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="title">Video Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="My Awesome Video"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Tell us about your video..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={8}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="video-file">Video File (MP4 only)</Label>
              <Input
                id="video-file"
                type="file"
                accept="video/mp4"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setFile(e.target.files[0]);
                  } else {
                    setFile(null);
                  }
                }}
                required
              />
              {file && (
                <p className="text-sm text-foreground">Selected: {file.name}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Spinner />
                  <span className="ml-2">Uploading...</span>
                </>
              ) : (
                "Upload Video"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
