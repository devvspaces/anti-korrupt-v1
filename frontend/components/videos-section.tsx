"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Play } from "lucide-react";
import { resourcesApi } from "@/lib/api";

interface Subtitle {
  start: number;
  end: number;
  text: string;
}

interface Video {
  id: number;
  title: string;
  videoUrl: string;
  duration?: string;
  thumbnailUrl?: string;
  subtitles: Subtitle[];
}

interface VideosSectionProps {
  resourceId: number;
}

export function VideosSection({ resourceId }: VideosSectionProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const subtitleContainerRef = useRef<HTMLDivElement>(null);

  // Fetch videos from API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching videos for resource:", resourceId);
        const data = await resourcesApi.getVideo(resourceId);
        if (data != null || data != undefined) {
          const videos = [{
            ...data,
            title: `Video Lesson for Resource ${resourceId}`,
          }]
          setVideos(videos);
          console.log("Fetched videos:", videos);
          setSelectedVideo(videos[0]);
          // if (data.videos && data.videos.length > 0) {
          //   setSelectedVideo(data.videos[0]);
          // }
        }
      } catch (err) {
        console.error("Failed to load videos:", err);
        setError("Failed to load videos");
      } finally {
        setIsLoading(false);
      }
    };
    fetchVideos();
  }, [resourceId]);

  const handleVideoChange = (video: Video) => {
    setSelectedVideo(video);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading videos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No videos available</p>
      </div>
    );
  }

  if (!selectedVideo) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Video Lessons</h2>

      {/* Video List */}
      <div className="grid gap-3">
        {videos.map((video) => (
          <button
            key={video.id}
            onClick={() => handleVideoChange(video)}
            className={`glass rounded-xl p-4 text-left transition-all ${
              selectedVideo.id === video.id
                ? "ring-2 ring-primary bg-primary/10"
                : "hover:bg-secondary/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                <Play className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{video.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {video.duration}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Active Video Player */}
      <div className="glass rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold">{selectedVideo.title}</h3>

        {/* Video Display */}
        <div className="aspect-video bg-secondary/20 rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            src={selectedVideo.videoUrl}
            className="w-full h-full object-cover"
            controls
            playsInline
          />
        </div>

        {/* Subtitles */}
        {selectedVideo.subtitles && selectedVideo.subtitles.length > 0 && (
          <div className="glass rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-semibold mb-3">Subtitles</h4>
            <div
              ref={subtitleContainerRef}
              className="space-y-2 max-h-[200px] overflow-y-auto scrollbar-thin"
            >
              {selectedVideo.subtitles.map((subtitle, index) => (
                <p key={index} className="text-sm text-muted-foreground p-2">
                  {subtitle.text}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
