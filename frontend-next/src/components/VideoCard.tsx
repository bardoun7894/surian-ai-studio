'use client';

import React, { useRef, useState, useMemo, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface VideoCardProps {
    videoUrl: string;
    posterUrl?: string;
    title?: string;
    aspectRatio?: 'video' | 'square' | 'portrait';
    className?: string;
    autoPlayOnHover?: boolean;
}

/**
 * Extract YouTube video ID from various URL formats:
 * - https://www.youtube.com/watch?v=ID
 * - https://youtu.be/ID
 * - https://www.youtube.com/embed/ID
 */
function getYouTubeId(url: string): string | null {
    const match = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
}

function isYouTubeUrl(url: string): boolean {
    return /(?:youtube\.com|youtu\.be)/.test(url);
}

export default function VideoCard({
    videoUrl,
    posterUrl,
    title,
    aspectRatio = 'video',
    className = '',
    autoPlayOnHover = true,
}: VideoCardProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [youtubeActive, setYoutubeActive] = useState(false);

    const aspectClasses = {
        video: 'aspect-video',
        square: 'aspect-square',
        portrait: 'aspect-[3/4]',
    };

    const youtubeId = useMemo(() => getYouTubeId(videoUrl), [videoUrl]);
    const isYoutube = isYouTubeUrl(videoUrl);

    const youtubeThumbnail = youtubeId
        ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
        : undefined;

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
        if (isYoutube && autoPlayOnHover) {
            setYoutubeActive(true);
            setIsPlaying(true);
        } else if (autoPlayOnHover && videoRef.current) {
            videoRef.current.play().catch(() => {});
            setIsPlaying(true);
        }
    }, [isYoutube, autoPlayOnHover]);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
        if (isYoutube) {
            setYoutubeActive(false);
            setIsPlaying(false);
        } else if (autoPlayOnHover && videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            setIsPlaying(false);
        }
    }, [isYoutube, autoPlayOnHover]);

    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isYoutube) {
            setYoutubeActive(true);
            setIsPlaying(true);
            return;
        }
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    // YouTube embed URL: mute=1 required for autoplay, enablejsapi for control
    const youtubeEmbedUrl = youtubeId
        ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`
        : '';

    return (
        <div
            className={`relative overflow-hidden rounded-xl group cursor-pointer ${aspectClasses[aspectRatio]} ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {isYoutube ? (
                <>
                    {/* YouTube thumbnail - always rendered underneath */}
                    <img
                        src={posterUrl || youtubeThumbnail || ''}
                        alt={title || 'Video thumbnail'}
                        className="w-full h-full object-cover"
                    />

                    {/* YouTube iframe - overlaid on hover */}
                    {youtubeActive && youtubeId && (
                        <iframe
                            src={youtubeEmbedUrl}
                            title={title || 'Video'}
                            allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full border-0 z-10"
                        />
                    )}

                    {/* Overlay + play button when not active */}
                    {!youtubeActive && (
                        <>
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                            <div
                                className="absolute inset-0 flex items-center justify-center z-10"
                                onClick={togglePlay}
                            >
                                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                    <Play size={28} className="text-white ml-1" fill="white" />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Title */}
                    {!youtubeActive && title && (
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent z-10">
                            <span className="text-white text-sm font-medium truncate block">
                                {title}
                            </span>
                        </div>
                    )}
                </>
            ) : (
                <>
                    {/* Native Video Element */}
                    <video
                        ref={videoRef}
                        src={videoUrl}
                        poster={posterUrl}
                        muted={isMuted}
                        loop
                        playsInline
                        controls
                        preload="metadata"
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover"
                    />

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Play Icon (when not playing) */}
                    {!isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center" onClick={togglePlay}>
                            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                <Play size={28} className="text-gov-forest ml-1" />
                            </div>
                        </div>
                    )}

                    {/* Controls (on hover) */}
                    <div className={`absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={togglePlay}
                                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                            >
                                {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                            </button>
                            <button
                                onClick={toggleMute}
                                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                            >
                                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                            </button>
                        </div>

                        {title && (
                            <span className="text-white text-sm font-medium truncate max-w-[60%]">
                                {title}
                            </span>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
