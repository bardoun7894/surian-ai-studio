'use client';

import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface VideoCardProps {
    videoUrl: string;
    posterUrl?: string;
    title?: string;
    aspectRatio?: 'video' | 'square' | 'portrait';
    className?: string;
    autoPlayOnHover?: boolean;
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

    const aspectClasses = {
        video: 'aspect-video',
        square: 'aspect-square',
        portrait: 'aspect-[3/4]',
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (autoPlayOnHover && videoRef.current) {
            videoRef.current.play().catch(() => {
                // Autoplay might be blocked by browser
            });
            setIsPlaying(true);
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (autoPlayOnHover && videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            setIsPlaying(false);
        }
    };

    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
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

    return (
        <div
            className={`relative overflow-hidden rounded-xl group cursor-pointer ${aspectClasses[aspectRatio]} ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Video Element */}
            <video
                ref={videoRef}
                src={videoUrl}
                poster={posterUrl}
                muted={isMuted}
                loop
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Play Icon (when not playing) */}
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
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
        </div>
    );
}
