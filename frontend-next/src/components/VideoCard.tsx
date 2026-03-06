'use client';

import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface VideoCardProps {
    videoUrl: string;
    posterUrl?: string;
    title?: string;
    aspectRatio?: 'video' | 'square' | 'portrait';
    className?: string;
    autoPlayOnHover?: boolean;
}

function getYouTubeId(url: string): string | null {
    const match = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
}

function isYouTubeUrl(url: string): boolean {
    return /(?:youtube\.com|youtu\.be)/.test(url);
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
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    useEffect(() => {
        if (!isYoutube && videoRef.current) {
            videoRef.current.play().catch(() => {});
        }
    }, [isYoutube]);

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
        }
    };

    const youtubeEmbedUrl = youtubeId
        ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`
        : '';

    return createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center" onClick={onClose}>
            <div className="relative w-full max-w-5xl mx-4" onClick={(e) => e.stopPropagation()}>
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-50"
                >
                    <X size={20} />
                </button>

                {/* Title */}
                {title && (
                    <div className="absolute -top-12 left-0 text-white font-bold text-lg truncate max-w-[70%]">
                        {title}
                    </div>
                )}

                {isYoutube ? (
                    <div className="aspect-video rounded-xl overflow-hidden">
                        <iframe loading="lazy"
                            src={youtubeEmbedUrl}
                            title={title || 'Video'}
                            allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full border-0"
                        />
                    </div>
                ) : (
                    <div className="aspect-video rounded-xl overflow-hidden relative bg-black">
                        <video
                            ref={videoRef}
                            src={videoUrl}
                            poster={posterUrl}
                            className="w-full h-full object-contain"
                            onTimeUpdate={handleTimeUpdate}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            onClick={() => {
                                if (videoRef.current) {
                                    isPlaying ? videoRef.current.pause() : videoRef.current.play();
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
                                        videoRef.current.currentTime = pct * videoRef.current.duration;
                                    }
                                }}
                            >
                                <div className="h-full bg-gov-gold rounded-full" style={{ width: `${progress}%` }} />
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => {
                                        if (videoRef.current) {
                                            isPlaying ? videoRef.current.pause() : videoRef.current.play();
                                        }
                                    }}
                                    className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                                >
                                    {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                                </button>
                                <button
                                    onClick={() => {
                                        if (videoRef.current) {
                                            videoRef.current.muted = !isMuted;
                                            setIsMuted(!isMuted);
                                        }
                                    }}
                                    className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                                >
                                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                </button>
                                <button
                                    onClick={() => videoRef.current?.requestFullscreen?.()}
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
        document.body
    );
};

export default function VideoCard({
    videoUrl,
    posterUrl,
    title,
    aspectRatio = 'video',
    className = '',
    autoPlayOnHover = true,
}: VideoCardProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        setIsTouch(window.matchMedia('(hover: none)').matches);
        return () => {
            if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
        };
    }, []);

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
        ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`
        : '';

    const sendYtCommand = useCallback((func: string) => {
        if (ytIframeRef.current?.contentWindow) {
            ytIframeRef.current.contentWindow.postMessage(
                JSON.stringify({ event: 'command', func, args: [] }),
                'https://www.youtube.com'
            );
        }
    }, []);

    const [ytMuted, setYtMuted] = useState(true);

    const handleDoubleClick = useCallback(() => {
        if (!isYoutube && videoRef.current) {
            const videoEl = videoRef.current;
            if (videoEl.requestFullscreen) {
                videoEl.requestFullscreen();
            } else if ((videoEl as any).webkitEnterFullscreen) {
                (videoEl as any).webkitEnterFullscreen();
            } else if ((videoEl as any).webkitRequestFullscreen) {
                (videoEl as any).webkitRequestFullscreen();
            }
        } else if (isYoutube) {
            setShowModal(true);
        }
    }, [isYoutube]);

    const handleContainerClick = useCallback(() => {
        // Desktop (hover device): original behavior - open modal on click
        if (!isTouch) {
            if (!isYoutube) setShowModal(true);
            return;
        }

        // Touch device: single tap = play/pause, double tap = modal/fullscreen
        if (tapTimerRef.current) {
            // Second tap within 300ms → double tap
            clearTimeout(tapTimerRef.current);
            tapTimerRef.current = null;
            if (isYoutube) {
                setShowModal(true);
            } else if (videoRef.current) {
                const videoEl = videoRef.current;
                if (videoEl.requestFullscreen) {
                    videoEl.requestFullscreen();
                } else if ((videoEl as any).webkitEnterFullscreen) {
                    (videoEl as any).webkitEnterFullscreen();
                } else {
                    setShowModal(true);
                }
            }
        } else {
            // First tap → wait for potential second tap
            tapTimerRef.current = setTimeout(() => {
                tapTimerRef.current = null;
                if (isYoutube) {
                    setShowModal(true);
                } else if (videoRef.current) {
                    if (isPlaying) {
                        videoRef.current.pause();
                        setIsPlaying(false);
                    } else {
                        videoRef.current.muted = false;
                        videoRef.current.play().catch(() => {});
                        setIsPlaying(true);
                    }
                }
            }, 300);
        }
    }, [isTouch, isYoutube, isPlaying, handleDoubleClick]);

    return (
        <>
            <div
                className={`relative overflow-hidden rounded-xl group cursor-pointer ${aspectClasses[aspectRatio]} ${className}`}
                onMouseEnter={() => {
                    handleMouseEnter();
                    if (isYoutube && autoPlayOnHover) {
                        setYoutubeActive(true);
                    }
                }}
                onMouseLeave={() => {
                    handleMouseLeave();
                    if (isYoutube) {
                        setYoutubeActive(false);
                        setYtMuted(true);
                    }
                }}
                onClick={handleContainerClick}
                onDoubleClick={!isTouch ? handleDoubleClick : undefined}
            >
                {isYoutube ? (
                    <>
                        {/* YouTube thumbnail */}
                        <img
                            src={posterUrl || youtubeThumbnail || ''}
                            alt={title || 'Video thumbnail'}
                            className="w-full h-full object-cover"
                        />

                        {/* YouTube iframe on hover */}
                        {youtubeActive && youtubeId && (
                            <iframe loading="lazy"
                                ref={ytIframeRef}
                                src={youtubeEmbedUrl}
                                title={title || 'Video'}
                                allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="absolute inset-0 w-full h-full border-0 z-10 pointer-events-none"
                            />
                        )}

                        {/* Play button when not active */}
                        {!youtubeActive && (
                            <>
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                        <Play size={28} className="text-white ml-1" fill="white" />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Sound toggle + title when YouTube active */}
                        {youtubeActive && (
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent z-20 items-center justify-between hidden md:flex">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (ytMuted) { sendYtCommand('unMute'); } else { sendYtCommand('mute'); }
                                        setYtMuted(!ytMuted);
                                    }}
                                    className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                                >
                                    {ytMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                </button>
                            </div>
                        )}

                    </>
                ) : (
                    <>
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
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {!isPlaying && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                    <Play size={28} className="text-gov-forest ml-1" />
                                </div>
                            </div>
                        )}
                        {title && (
                            <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 ${isPlaying ? 'opacity-0 pointer-events-none' : isHovered ? 'opacity-100' : 'opacity-0'}`}>
                                <span className="text-white text-sm font-medium truncate block">{title}</span>
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
