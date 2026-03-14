"use client";

import React, {
  useRef,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  X,
  Loader2,
} from "lucide-react";
import { createPortal } from "react-dom";

interface VideoCardProps {
  videoUrl: string;
  posterUrl?: string;
  title?: string;
  aspectRatio?: "video" | "square" | "portrait";
  className?: string;
  autoPlayOnHover?: boolean;
}

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? match[1] : null;
}

function isYouTubeUrl(url: string): boolean {
  return /(?:youtube\.com|youtu\.be)/.test(url);
}

/** Cross-browser fullscreen — handles iOS Safari's proprietary API */
function enterFullscreen(
  videoEl: HTMLVideoElement,
  containerEl?: HTMLElement | null,
) {
  // iOS Safari: only webkitEnterFullscreen works on <video>
  if ((videoEl as any).webkitEnterFullscreen) {
    (videoEl as any).webkitEnterFullscreen();
    return;
  }
  // Standard API on container (for custom controls) or video
  const target = containerEl || videoEl;
  if (target.requestFullscreen) {
    target.requestFullscreen();
  } else if ((target as any).webkitRequestFullscreen) {
    (target as any).webkitRequestFullscreen();
  }
}

// Fullscreen modal player for both YouTube and native video
const VideoModal: React.FC<{
  videoUrl: string;
  youtubeId: string | null;
  isYoutube: boolean;
  title?: string;
  posterUrl?: string;
  onClose: () => void;
}> = ({ videoUrl, youtubeId, isYoutube, title, posterUrl, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const lastTapRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  // Guard: ignore backdrop clicks for 500ms after mount (prevents mobile ghost click)
  const [ready, setReady] = useState(false);
  const readyRef = useRef(false);
  useEffect(() => {
    const t = setTimeout(() => {
      setReady(true);
      readyRef.current = true;
    }, 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && readyRef.current) onClose();
    };
    // Push a history state so back button closes modal instead of navigating away
    history.pushState({ videoModal: true }, "");
    const handlePopState = (e: PopStateEvent) => {
      if (readyRef.current) onClose();
    };
    document.addEventListener("keydown", handleEsc);
    window.addEventListener("popstate", handlePopState);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      window.removeEventListener("popstate", handlePopState);
      document.body.style.overflow = "";
      // If modal is closed by X button (not back button), clean up the history entry
      if (history.state?.videoModal) {
        history.back();
      }
    };
  }, [onClose]);

  // Step 3: Auto-enter native fullscreen on mobile for native videos
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isMobileDevice = window.innerWidth < 768;
    if (!isYoutube && isMobileDevice && videoRef.current) {
      // Small delay to let the video element mount and start playing
      const timer = setTimeout(() => {
        if (videoRef.current) {
          enterFullscreen(videoRef.current, videoContainerRef.current);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isYoutube]);

  // Step 4: Close modal when native fullscreen is exited on mobile (native video only)
  const wasFullscreenRef = useRef(false);
  useEffect(() => {
    if (isYoutube) return; // YouTube handles its own fullscreen
    const handleFsChange = () => {
      const isFs = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
      if (isFs) {
        wasFullscreenRef.current = true;
      } else if (wasFullscreenRef.current && window.innerWidth < 768) {
        // Only close if we were previously in fullscreen and exited
        wasFullscreenRef.current = false;
        onClose();
      }
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    document.addEventListener("webkitfullscreenchange", handleFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
      document.removeEventListener("webkitfullscreenchange", handleFsChange);
    };
  }, [onClose, isYoutube]);

  useEffect(() => {
    if (!isYoutube && videoRef.current) {
      // Ensure volume is set to max and not muted
      videoRef.current.volume = 1;
      videoRef.current.muted = false;
      videoRef.current.play().catch(() => {
        // If autoplay with sound fails, try muted first then unmute
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().catch(() => {});
        }
      });
    }
  }, [isYoutube]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setProgress(
        (videoRef.current.currentTime / videoRef.current.duration) * 100,
      );
    }
  };

  const youtubeEmbedUrl = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`
    : "";

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
      onClick={() => ready && onClose()}
    >
      <div
        className="relative w-full max-w-5xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button - inside container on mobile, above on desktop */}
        <button
          onClick={() => ready && onClose()}
          className="absolute top-3 right-3 md:-top-12 md:right-0 w-11 h-11 md:w-10 md:h-10 rounded-full bg-black/70 md:bg-white/10 hover:bg-black/90 md:hover:bg-white/20 flex items-center justify-center text-white transition-colors z-50 shadow-lg md:shadow-none"
        >
          <X size={22} className="md:w-5 md:h-5" />
        </button>

        {/* Title - hidden on mobile to avoid overlap with close button */}
        {title && (
          <div className="hidden md:block absolute -top-12 left-0 text-white font-bold text-lg truncate max-w-[70%]">
            {title}
          </div>
        )}

        {isYoutube ? (
          <div className="aspect-video rounded-xl overflow-hidden relative z-0">
            <iframe
              src={youtubeEmbedUrl}
              title={title || "Video"}
              allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        ) : (
          <div
            ref={videoContainerRef}
            className="aspect-video rounded-xl overflow-hidden relative bg-black"
          >
            <video
              ref={videoRef}
              src={videoUrl}
              poster={posterUrl}
              className="w-full h-full object-contain"
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onClick={(e) => {
                // Double-tap detection for mobile fullscreen toggle
                const now = Date.now();
                if (now - lastTapRef.current < 350) {
                  // Double-tap/click -> toggle fullscreen
                  e.preventDefault();
                  if (videoRef.current) {
                    if (document.fullscreenElement || (document as any).webkitFullscreenElement) {
                      document.exitFullscreen?.().catch(() => {});
                    } else {
                      enterFullscreen(videoRef.current, videoContainerRef.current);
                    }
                  }
                  lastTapRef.current = 0;
                } else {
                  // Single tap -> play/pause (with delay to detect double)
                  lastTapRef.current = now;
                  setTimeout(() => {
                    if (lastTapRef.current === now && videoRef.current) {
                      videoRef.current.paused
                        ? videoRef.current.play()
                        : videoRef.current.pause();
                    }
                  }, 350);
                }
              }}
              onDoubleClick={(e) => {
                // Desktop double-click -> toggle fullscreen
                e.preventDefault();
                if (videoRef.current) {
                  if (document.fullscreenElement || (document as any).webkitFullscreenElement) {
                    document.exitFullscreen?.().catch(() => {});
                  } else {
                    enterFullscreen(videoRef.current, videoContainerRef.current);
                  }
                }
              }}
            />

            {/* Custom controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              {/* Progress bar */}
              <div
                className="w-full h-1 bg-white/20 rounded-full mb-3 cursor-pointer"
                onClick={(e) => {
                  if (videoRef.current) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pct = (e.clientX - rect.left) / rect.width;
                    videoRef.current.currentTime =
                      pct * videoRef.current.duration;
                  }
                }}
              >
                <div
                  className="h-full bg-gov-gold rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (videoRef.current) {
                      isPlaying
                        ? videoRef.current.pause()
                        : videoRef.current.play();
                    }
                  }}
                  className="w-10 h-10 rounded-full bg-white/20 grid place-items-center text-white hover:bg-white/30 transition-colors"
                >
                  {isPlaying ? (
                    <Pause size={18} />
                  ) : (
                    <Play size={18} className="translate-x-[1px]" />
                  )}
                </button>
                <button
                  onClick={() => {
                    if (videoRef.current) {
                      const newMuted = !isMuted;
                      videoRef.current.muted = newMuted;
                      if (!newMuted) {
                        videoRef.current.volume = volume;
                      }
                      setIsMuted(newMuted);
                    }
                  }}
                  className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                {/* Volume slider */}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setVolume(val);
                    if (videoRef.current) {
                      videoRef.current.volume = val;
                      if (val === 0) {
                        videoRef.current.muted = true;
                        setIsMuted(true);
                      } else if (isMuted) {
                        videoRef.current.muted = false;
                        setIsMuted(false);
                      }
                    }
                  }}
                  className="w-20 h-1 accent-gov-gold cursor-pointer"
                />
                <button
                  onClick={() => {
                    if (videoRef.current) {
                      enterFullscreen(
                        videoRef.current,
                        videoContainerRef.current,
                      );
                    }
                  }}
                  className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors ml-auto"
                >
                  <Maximize2 size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default function VideoCard({
  videoUrl,
  posterUrl,
  title,
  aspectRatio = "video",
  className = "",
  autoPlayOnHover = true,
}: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTapRef = useRef<number>(0);
  const singleTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchHandled = useRef(false);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const instanceId = useRef(Math.random().toString(36).slice(2));
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);

  const aspectClasses = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]",
  };

  const youtubeId = useMemo(() => getYouTubeId(videoUrl), [videoUrl]);
  const isYoutube = isYouTubeUrl(videoUrl);
  const youtubeThumbnail = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
    : undefined;

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (!isYoutube && autoPlayOnHover && videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isYoutube, autoPlayOnHover]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (!isYoutube && autoPlayOnHover && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isYoutube, autoPlayOnHover]);

  const [youtubeActive, setYoutubeActive] = useState(false);
  const ytIframeRef = useRef<HTMLIFrameElement>(null);

  const youtubeEmbedUrl = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=1&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${typeof window !== "undefined" ? window.location.origin : ""}`
    : "";

  const sendYtCommand = useCallback((func: string) => {
    if (ytIframeRef.current?.contentWindow) {
      ytIframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func, args: [] }),
        "https://www.youtube.com",
      );
    }
  }, []);

  const [ytMuted, setYtMuted] = useState(true);

  // M6.10: Check if on mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Global coordination: only one video plays at a time
  const stopPlayback = useCallback(() => {
    if (isYoutube) {
      setYoutubeActive(false);
      setYtMuted(true);
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [isYoutube]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.id !== instanceId.current) {
        stopPlayback();
      }
    };
    window.addEventListener("videocard-play", handler);
    return () => window.removeEventListener("videocard-play", handler);
  }, [stopPlayback]);

  const notifyPlaying = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent("videocard-play", { detail: { id: instanceId.current } }),
    );
  }, []);

  // Cleanup tap timer on unmount
  useEffect(() => {
    return () => {
      if (singleTapTimer.current) clearTimeout(singleTapTimer.current);
    };
  }, []);

  // Track finger position to distinguish scroll from tap
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartPos.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }, []);

  // ── Shared: detect scroll vs tap ──
  const isTapNotScroll = useCallback((e: React.TouchEvent) => {
    if (touchStartPos.current) {
      const dx = Math.abs(
        e.changedTouches[0].clientX - touchStartPos.current.x,
      );
      const dy = Math.abs(
        e.changedTouches[0].clientY - touchStartPos.current.y,
      );
      if (dx > 10 || dy > 10) return false;
    }
    if ((e.target as HTMLElement).closest("button")) return false;
    return true;
  }, []);

  const markTouchHandled = useCallback(() => {
    touchHandled.current = true;
    setTimeout(() => {
      touchHandled.current = false;
    }, 0);
  }, []);

  // ── YouTube: touch handler (mobile only) ──
  // Single tap → open fullscreen modal directly (most intuitive on mobile)
  const handleYouTubeTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!isTapNotScroll(e)) return;
      markTouchHandled();
      e.preventDefault();
      setShowModal(true);
    },
    [isTapNotScroll, markTouchHandled],
  );

  // ── YouTube: click handler ──
  const handleYouTubeClick = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (touchHandled.current) return;
      if ((e.target as HTMLElement).closest("button")) return;
      // Both desktop and mobile → open modal
      setShowModal(true);
    },
    [],
  );

  // ── Native video: touch handler (mobile only) ──
  // Single tap → open fullscreen modal directly (most intuitive on mobile)
  const handleNativeVideoTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!isTapNotScroll(e)) return;
      markTouchHandled();
      e.preventDefault();
      setShowModal(true);
    },
    [isTapNotScroll, markTouchHandled],
  );

  // ── Native video: click handler ──
  const handleNativeVideoClick = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (touchHandled.current) return;
      if ((e.target as HTMLElement).closest("button")) return;
      // Both desktop and mobile → open modal
      setShowModal(true);
    },
    [],
  );

  return (
    <>
      <div
        ref={containerRef}
        className={`relative overflow-hidden rounded-xl group cursor-pointer [touch-action:manipulation] ${aspectClasses[aspectRatio]} ${className}`}
        onMouseEnter={(e) => {
          handleMouseEnter();
          if (isYoutube && autoPlayOnHover && !isMobile) {
            notifyPlaying();
            setYoutubeActive(true);
          }
        }}
        onMouseLeave={(e) => {
          if (!showModal) {
            handleMouseLeave();
            if (isYoutube && !isMobile) {
              setYoutubeActive(false);
              setYtMuted(true);
            }
          }
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={
          isYoutube ? handleYouTubeTouchEnd : handleNativeVideoTouchEnd
        }
        onClick={isYoutube ? handleYouTubeClick : handleNativeVideoClick}
      >
        {isYoutube ? (
          <>
            {/* YouTube thumbnail */}
            <img
              src={posterUrl || youtubeThumbnail || ""}
              alt={title || "Video thumbnail"}
              className="w-full h-full object-cover"
            />

            {/* YouTube iframe on hover */}
            {youtubeActive && youtubeId && (
              <iframe
                ref={ytIframeRef}
                src={youtubeEmbedUrl}
                title={title || "Video"}
                allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className="absolute inset-0 w-full h-full border-0 z-10 pointer-events-none"
              />
            )}

            {/* Play button when not active */}
            {!youtubeActive && (
              <>
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                <div className="absolute inset-0 grid place-items-center z-10">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-red-600 rounded-full grid place-items-center shadow-lg will-change-transform md:group-hover:scale-110 transition-transform">
                    <Play size={24} className="text-white translate-x-[1px]" fill="white" />
                  </div>
                </div>
              </>
            )}

            {/* Sound toggle + title when YouTube active */}
            {youtubeActive && (
              <>
                {/* Desktop: gradient + title + mute */}
                {!isMobile && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300">
                    {title && (
                      <span className="text-white text-sm font-medium truncate max-w-[60%]">
                        {title}
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (ytMuted) {
                          sendYtCommand("unMute");
                        } else {
                          sendYtCommand("mute");
                        }
                        setYtMuted(!ytMuted);
                      }}
                      className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                    >
                      {ytMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                  </div>
                )}
                {/* Mobile: floating mute button bottom-right, no text */}
                {isMobile && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (ytMuted) {
                        sendYtCommand("unMute");
                      } else {
                        sendYtCommand("mute");
                      }
                      setYtMuted(!ytMuted);
                    }}
                    className="absolute bottom-3 right-3 z-20 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                  >
                    {ytMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                )}
              </>
            )}

            {/* Title when not active - hidden on mobile to avoid blocking content */}
            {!youtubeActive && title && !isMobile && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent z-10">
                <span className="text-white text-sm font-medium truncate block">
                  {title}
                </span>
              </div>
            )}
          </>
        ) : (
          <>
            {isLoadingVideo && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 z-10">
                <Loader2 size={32} className="text-white animate-spin mb-2" />
                <span className="text-white/80 text-xs font-medium">
                  Loading...
                </span>
              </div>
            )}
            <video
              ref={videoRef}
              src={videoUrl}
              poster={posterUrl}
              muted
              loop
              playsInline
              preload="metadata"
              crossOrigin="anonymous"
              className="w-full h-full object-cover pointer-events-none transition-transform duration-500 group-hover:scale-105"
              onLoadStart={() => setIsLoadingVideo(true)}
              onCanPlay={() => setIsLoadingVideo(false)}
              onError={() => setIsLoadingVideo(false)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {!isPlaying && (
              <div className="absolute inset-0 grid place-items-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/90 rounded-full grid place-items-center shadow-lg will-change-transform md:group-hover:scale-110 transition-transform">
                  <Play size={24} className="text-gov-forest translate-x-[1px]" />
                </div>
              </div>
            )}
            {/* M6.10: Show title overlay; hide on mobile when video is playing */}
            {title && (
              <div
                className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 z-10 ${isMobile && isPlaying ? "opacity-0 pointer-events-none" : isHovered || isMobile ? "opacity-100" : "opacity-0"}`}
              >
                <span className="text-white text-sm font-medium truncate block">
                  {title}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && (
        <VideoModal
          videoUrl={videoUrl}
          youtubeId={youtubeId}
          isYoutube={isYoutube}
          title={title}
          posterUrl={posterUrl}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
