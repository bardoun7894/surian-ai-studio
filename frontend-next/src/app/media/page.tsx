'use client';

import React, { useState, useEffect, useMemo } from 'react';

import {
  Play,
  Image as ImageIcon,
  BarChart3,
  Calendar,
  Clock,
  Download,
  Share2,
  Grid,
  List,
  X,
  Pause,
  Maximize2,
  ChevronLeft
} from 'lucide-react';

import { useLanguage } from '@/contexts/LanguageContext';
import { API, AlbumData } from '@/lib/repository';
import { formatRelativeTime } from '@/lib/utils';
import ShareMenu from '@/components/ShareMenu';
import FavoriteButton from '@/components/FavoriteButton';
import { MediaItem } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { SkeletonGrid } from '@/components/SkeletonLoader';
import ContentFilter from '@/components/ContentFilter';
import Pagination from '@/components/Pagination';
import { usePageMeta } from "@/hooks/usePageMeta";

type MediaType = 'all' | 'video' | 'photo' | 'infographic';
type ViewMode = 'grid' | 'list';

export default function MediaPage() {
  const { language, t } = useLanguage();

  usePageMeta({
    title: language === "ar" ? "المركز الإعلامي" : "Media Center",
    description: language === "ar" ? "المركز الإعلامي لوزارة الاقتصاد والصناعة" : "Media Center of the Ministry of Economy and Industry",
  });
  const isAr = language === 'ar';
  const [activeFilter, setActiveFilter] = useState<MediaType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [showVideoControls, setShowVideoControls] = useState<string | null>(null);
  const [downloadingItems, setDownloadingItems] = useState<Set<string>>(new Set());
  const [expandedVideo, setExpandedVideo] = useState<MediaItem | null>(null);
  const [expandedImage, setExpandedImage] = useState<MediaItem | null>(null);
  const [expandedAlbum, setExpandedAlbum] = useState<MediaItem | null>(null);
  const [albumData, setAlbumData] = useState<AlbumData | null>(null);
  const [loadingAlbum, setLoadingAlbum] = useState(false);
  // Track source album when viewing a full-size image from an album
  const [sourceAlbum, setSourceAlbum] = useState<{ item: MediaItem; data: AlbumData } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage] = useState(12);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      try {
        const response = await API.media.getPaginated(currentPage, perPage, activeFilter);
        setMedia(response.data);
        setLastPage(response.last_page);
        setTotalItems(response.total);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, [activeFilter, currentPage, perPage]);

  // Date filtering
  const filteredMedia = useMemo(() => {
    let result = [...media];
    if (selectedMonth !== null || selectedYear !== null) {
      result = result.filter(item => {
        const d = new Date(item.date);
        if (selectedYear !== null && d.getFullYear() !== selectedYear) return false;
        if (selectedMonth !== null && d.getMonth() !== selectedMonth) return false;
        return true;
      });
    }
    return result;
  }, [media, selectedMonth, selectedYear]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play size={14} />;
      case 'photo': return <ImageIcon size={14} />;
      case 'infographic': return <BarChart3 size={14} />;
      default: return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'video': return t('media_video');
      case 'photo': return t('media_photos');
      case 'infographic': return t('media_infographic');
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const getYouTubeId = (url: string): string | null => {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };

  const isYouTubeUrl = (url: string): boolean => {
    return /(?:youtube\.com|youtu\.be)/.test(url);
  };

  // Play video inline
  const handlePlayInline = (item: MediaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.type === 'video' && item.url) {
      setPlayingVideo(playingVideo === item.id ? null : item.id);
    }
  };

  // Expand video to full modal
  const handleExpand = (item: MediaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedVideo(item);
    setPlayingVideo(null);
  };

  const handleDownload = async (item: MediaItem, e: React.MouseEvent) => {
    e.stopPropagation();

    // Don't allow download for YouTube videos
    if (item.type === 'video' && item.url && isYouTubeUrl(item.url)) {
      return;
    }

    // Prevent duplicate downloads
    if (downloadingItems.has(item.id)) return;

    const url = item.type === 'photo' ? (item.thumbnailUrl || item.url) : item.url;
    if (!url) return;

    // Show downloading state immediately (Bug 2 fix)
    setDownloadingItems(prev => new Set(prev).add(item.id));

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const ext = blob.type.split('/')[1]?.split('+')[0] || url.split('.').pop()?.split('?')[0] || 'jpg';
      const filename = `${item.title || 'download'}.${ext}`;
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback: open in new tab
      window.open(url, '_blank');
    } finally {
      setDownloadingItems(prev => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }
  };

  const [shareData, setShareData] = useState<{ title: string; url: string } | null>(null);

  const handleShare = (item: MediaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setShareData({ title: item.title, url: window.location.href });
  };

  const handleOpenAlbum = async (item: MediaItem) => {
    setExpandedAlbum(item);
    setLoadingAlbum(true);
    try {
      const data = await API.media.getAlbumPhotos(item.id);
      setAlbumData(data);
    } catch (error) {
      console.error('Failed to load album photos:', error);
    } finally {
      setLoadingAlbum(false);
    }
  };

  const handleCloseAlbum = () => {
    setExpandedAlbum(null);
    setAlbumData(null);
  };

  const filters: { key: MediaType; label: string; icon: React.ElementType }[] = [
    { key: 'all', label: t('media_all'), icon: Grid },
    { key: 'video', label: t('media_videos'), icon: Play },
    { key: 'photo', label: t('media_photos'), icon: ImageIcon },
    { key: 'infographic', label: t('media_infographics'), icon: BarChart3 },
  ];

  // Handle video area click to toggle controls (Bug 1 fix)
  const handleVideoAreaClick = (item: MediaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (showVideoControls === item.id) {
      setShowVideoControls(null);
    } else {
      setShowVideoControls(item.id);
      // Auto-hide controls after 3 seconds
      setTimeout(() => setShowVideoControls(prev => prev === item.id ? null : prev), 3000);
    }
  };

  // Handle double-click/tap to go fullscreen (Bug 3 fix)
  const handleVideoDoubleClick = (item: MediaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setExpandedVideo(item);
    setPlayingVideo(null);
    setShowVideoControls(null);
  };

  // Render inline video player
  const renderInlinePlayer = (item: MediaItem) => {
    if (!item.url) return null;

    if (isYouTubeUrl(item.url)) {
      const ytId = getYouTubeId(item.url);
      if (!ytId) return null;
      return (
        <div
          className="absolute inset-0 z-10"
          onDoubleClick={(e) => handleVideoDoubleClick(item, e)}
        >
          <iframe loading="lazy"
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={item.title}
            allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>
      );
    }

    return (
      <video
        src={item.url}
        poster={item.thumbnailUrl}
        controls
        autoPlay
        playsInline
        onDoubleClick={(e) => handleVideoDoubleClick(item, e)}
        className="absolute inset-0 w-full h-full object-contain bg-black z-10"
      >
        {isAr ? 'المتصفح لا يدعم تشغيل الفيديو.' : 'Your browser does not support the video tag.'}
      </video>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg">
      <Navbar />

      <main className="flex-grow">
        <div className="min-h-screen bg-gov-beige dark:bg-dm-bg pb-20">
          {/* Header */}
          <div className="bg-gov-forest text-white py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-4">
                {t('media_center')}
              </h1>
              <p className="text-gray-300 text-lg max-w-2xl">
                {t('media_subtitle')}
              </p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Unified Content Filter with Date Filter */}
            <ContentFilter
              tabs={filters}
              activeTab={activeFilter}
              onTabChange={(k) => { setActiveFilter(k as MediaType); setPlayingVideo(null); }}
              showDateFilter={true}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onDateChange={(m, y) => { setSelectedMonth(m); setSelectedYear(y); }}
              totalCount={filteredMedia.length}
              countLabel={t('media_items')}
              extraFilters={
                <div className="flex gap-2 bg-white dark:bg-dm-surface rounded-xl p-1 border border-gray-200 dark:border-gov-border/25">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                      ? 'bg-gov-teal text-white'
                      : 'text-gray-500 hover:text-gov-teal'
                      }`}
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'list'
                      ? 'bg-gov-teal text-white'
                      : 'text-gray-500 hover:text-gov-teal'
                      }`}
                  >
                    <List size={16} />
                  </button>
                </div>
              }
              className="mb-8"
            />

            {/* Media Grid */}
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'flex flex-col gap-4'
            }>
              {loading ? (
                <div className="col-span-full py-8">
                  <SkeletonGrid cards={6} className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" />
                </div>
              ) : filteredMedia.map((item) => {
                const isPlaying = playingVideo === item.id;
                const isVideo = item.type === 'video' && item.url;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if ((item.type === 'photo' || item.type === 'infographic') && item.count && item.count > 1) {
                        // This is an album - open album gallery
                        handleOpenAlbum(item);
                      } else if (item.type === 'photo' || item.type === 'infographic') {
                        // Single image - open lightbox
                        setExpandedImage(item);
                      }
                    }}
                    className={`group bg-white dark:bg-dm-surface rounded-2xl border border-gray-100 dark:border-gov-border/15 overflow-hidden transition-all duration-300 ${
                      viewMode === 'list' ? 'flex' : ''
                    } hover:border-gov-gold/50 hover:shadow-xl hover:shadow-gov-gold/10 hover:-translate-y-1 ${
                      item.type !== 'video' ? 'cursor-pointer' : ''
                    }`}
                  >
                    {/* Thumbnail / Inline Video Player */}
                    <div className={`relative overflow-hidden ${
                      viewMode === 'list' ? 'w-32 sm:w-48 aspect-video flex-shrink-0' : 'w-full aspect-video'
                    } bg-black`}>

                      {/* Show inline player when playing */}
                      {isPlaying && isVideo ? (
                        renderInlinePlayer(item)
                      ) : (
                        <Image
                          src={item.thumbnailUrl}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      )}

                      {/* Hover Overlay */}
                      {!isPlaying && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      )}

                      {/* Type Badge */}
                      <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 z-20">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 backdrop-blur-sm ${
                          item.type === 'video'
                            ? 'bg-red-500/90 text-white'
                            : item.type === 'photo'
                              ? 'bg-gov-teal/90 text-white'
                              : 'bg-gov-gold/90 text-gov-forest'
                        }`}>
                          {getTypeIcon(item.type)}
                          {getTypeLabel(item.type)}
                        </span>
                      </div>

                      {/* Play Button for Videos (not playing) */}
                      {isVideo && !isPlaying && (
                        <button
                          onClick={(e) => handlePlayInline(item, e)}
                          onDoubleClick={(e) => handleVideoDoubleClick(item, e)}
                          className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer"
                        >
                          <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 bg-white/90 group-hover:scale-110 group-hover:bg-white">
                            <Play size={28} className="text-gov-forest ltr:ml-1 rtl:mr-1" fill="currentColor" />
                          </div>
                        </button>
                      )}

                      {/* Controls overlay for playing videos (Bug 1: show on click/tap) */}
                      {isPlaying && isVideo && (
                        <div
                          onClick={(e) => handleVideoAreaClick(item, e)}
                          onDoubleClick={(e) => handleVideoDoubleClick(item, e)}
                          className="absolute inset-0 z-20 cursor-pointer"
                        >
                          {/* Controls bar - visible on hover or tap */}
                          <div className={`absolute bottom-0 left-0 right-0 flex items-center justify-between p-3 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
                            showVideoControls === item.id ? 'opacity-100' : 'opacity-0 hover:opacity-100'
                          }`}>
                            <button
                              onClick={(e) => handlePlayInline(item, e)}
                              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/40 transition-colors"
                              title={t('media_pause')}
                            >
                              <Pause size={18} fill="currentColor" />
                            </button>
                            <button
                              onClick={(e) => handleExpand(item, e)}
                              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/40 transition-colors"
                              title={t('media_expand')}
                            >
                              <Maximize2 size={18} />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Duration/Count Badge */}
                      {!isPlaying && (item.duration || item.count) && (
                        <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 z-20">
                          <span className="px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1">
                            {item.duration ? (
                              <>
                                <Clock size={12} />
                                {item.duration}
                              </>
                            ) : (
                              <>
                                <ImageIcon size={12} />
                                {item.count} {t('media_photos_count')}
                              </>
                            )}
                          </span>
                        </div>
                      )}

                      {/* Hover Actions Bar */}
                      {!isPlaying && (
                        <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-end gap-2 p-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          <FavoriteButton
                            contentType="media"
                            contentId={item.id}
                            variant="overlay"
                            size={14}
                            className="!w-8 !h-8"
                            metadata={{
                              title: item.title,
                              title_ar: (item as any).title_ar || item.title,
                              title_en: (item as any).title_en || item.title,
                              description: '',
                              image: item.thumbnailUrl || '',
                              url: `/media#${item.id}`
                            }}
                          />
                          <button
                            onClick={(e) => handleShare(item, e)}
                            className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 flex items-center justify-center transition-colors"
                            title={t('media_share')}
                          >
                            <Share2 size={14} />
                          </button>
                          {/* Hide download for YouTube videos and albums (Bug 5) */}
                          {!(item.type === 'video' && item.url && isYouTubeUrl(item.url)) && !(item.count && item.count > 1) && (
                            <button
                              onClick={(e) => handleDownload(item, e)}
                              disabled={downloadingItems.has(item.id)}
                              className={`w-8 h-8 rounded-full backdrop-blur-sm text-white flex items-center justify-center transition-colors ${
                                downloadingItems.has(item.id) ? 'bg-gov-gold/60 cursor-wait' : 'bg-white/20 hover:bg-white/40'
                              }`}
                              title={downloadingItems.has(item.id) ? t('media_downloading') : t('media_download')}
                            >
                              {downloadingItems.has(item.id) ? (
                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Download size={14} />
                              )}
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className={`p-4 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-center' : ''}`}>
                      <h3 className="font-bold text-gov-charcoal dark:text-gov-gold mb-2 group-hover:text-gov-teal dark:group-hover:text-white transition-colors line-clamp-2">
                        {item.title}
                      </h3>

                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gov-gold/50">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatRelativeTime(item.date, language as 'ar' | 'en')}
                        </div>

                        {viewMode === 'list' && (
                          <div className="flex items-center gap-3">
                            <FavoriteButton
                              contentType="media"
                              contentId={item.id}
                              variant="compact"
                              size={14}
                              metadata={{
                                title: item.title,
                                title_ar: (item as any).title_ar || item.title,
                                title_en: (item as any).title_en || item.title,
                                description: '',
                                image: item.thumbnailUrl || '',
                                url: `/media#${item.id}`
                              }}
                            />
                            {isVideo && (
                              <button
                                onClick={(e) => handlePlayInline(item, e)}
                                className="flex items-center gap-1 hover:text-gov-teal transition-colors"
                              >
                                <Play size={14} />
                                {t('media_play')}
                              </button>
                            )}
                            <button
                              onClick={(e) => handleShare(item, e)}
                              className="flex items-center gap-1 hover:text-gov-teal transition-colors"
                            >
                              <Share2 size={14} />
                              {t('media_share')}
                            </button>
                            {/* Hide download for YouTube videos and albums (Bug 5) */}
                            {!(item.type === 'video' && item.url && isYouTubeUrl(item.url)) && !(item.count && item.count > 1) && (
                              <button
                                onClick={(e) => handleDownload(item, e)}
                                disabled={downloadingItems.has(item.id)}
                                className={`flex items-center gap-1 transition-colors ${
                                  downloadingItems.has(item.id) ? 'text-gov-gold cursor-wait' : 'hover:text-gov-teal'
                                }`}
                              >
                                {downloadingItems.has(item.id) ? (
                                  <>
                                    <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    {t('media_downloading')}
                                  </>
                                ) : (
                                  <>
                                    <Download size={14} />
                                    {t('media_download')}
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {!loading && filteredMedia.length > 0 && (
              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  lastPage={lastPage}
                  total={totalItems}
                  perPage={perPage}
                  onPageChange={(page) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                />
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredMedia.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-dm-surface/50 flex items-center justify-center mb-4">
                  <ImageIcon size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gov-charcoal dark:text-gov-gold mb-2">
                  {t('media_no_items')}
                </h3>
                <p className="text-gray-500 dark:text-gov-gold/60">
                  {t('media_no_content')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Expanded Video Modal */}
        {expandedVideo && expandedVideo.url && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setExpandedVideo(null)}
          >
            <div
              className="relative w-full max-w-5xl bg-gov-forest rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setExpandedVideo(null)}
                className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                aria-label={t('media_close')}
              >
                <X size={20} />
              </button>

              <div className="aspect-video w-full">
                {isYouTubeUrl(expandedVideo.url) ? (
                  <iframe loading="lazy"
                    src={`https://www.youtube.com/embed/${getYouTubeId(expandedVideo.url)}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                    title={expandedVideo.title}
                    allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <video
                    src={expandedVideo.url}
                    poster={expandedVideo.thumbnailUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain bg-black"
                  >
                    {isAr ? 'المتصفح لا يدعم تشغيل الفيديو.' : 'Your browser does not support the video tag.'}
                  </video>
                )}
              </div>

              <div className="p-4 bg-gov-forest text-white">
                <h3 className="text-lg font-bold">{expandedVideo.title}</h3>
                <div className="flex items-center gap-3 mt-2 text-sm text-gray-300">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {expandedVideo.date}
                  </span>
                  {expandedVideo.duration && (
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {expandedVideo.duration}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Image Lightbox Modal */}
        {expandedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => {
              if (sourceAlbum) {
                // Return to album
                setExpandedImage(null);
                setExpandedAlbum(sourceAlbum.item);
                setAlbumData(sourceAlbum.data);
                setSourceAlbum(null);
              } else {
                setExpandedImage(null);
              }
            }}
          >
            <div
              className="relative max-w-5xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute -top-12 left-0 right-0 rtl:left-0 rtl:right-0 z-10 flex items-center justify-between">
                {sourceAlbum ? (
                  <button
                    onClick={() => {
                      setExpandedImage(null);
                      setExpandedAlbum(sourceAlbum.item);
                      setAlbumData(sourceAlbum.data);
                      setSourceAlbum(null);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/40 text-white rounded-full text-sm font-bold transition-colors backdrop-blur-sm"
                  >
                    <ChevronLeft size={16} className={isAr ? 'rotate-180' : ''} />
                    {t('media_back_to_album')}
                  </button>
                ) : (
                  <div />
                )}
                <button
                  onClick={() => {
                    setExpandedImage(null);
                    setSourceAlbum(null);
                  }}
                  className="w-10 h-10 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-colors"
                  aria-label={t('media_close')}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="relative w-full h-[70vh] rounded-2xl overflow-hidden bg-black">
                <Image
                  src={expandedImage.thumbnailUrl || expandedImage.url || ''}
                  alt={expandedImage.title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>

              <div className="mt-4 flex items-center justify-between text-white">
                <div>
                  <h3 className="text-lg font-bold">{expandedImage.title}</h3>
                  <span className="text-sm text-gray-300 flex items-center gap-1 mt-1">
                    <Calendar size={14} />
                    {expandedImage.date}
                  </span>
                </div>
                <button
                  onClick={(e) => handleDownload(expandedImage, e)}
                  disabled={downloadingItems.has(expandedImage.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                    downloadingItems.has(expandedImage.id) ? 'bg-gov-gold/40 cursor-wait' : 'bg-white/20 hover:bg-white/30'
                  }`}
                >
                  {downloadingItems.has(expandedImage.id) ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t('media_downloading')}
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      {t('media_download')}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Album Gallery Modal */}
        {expandedAlbum && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={handleCloseAlbum}
          >
            <div
              className="relative max-w-6xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 bg-gov-forest/95 backdrop-blur-sm rounded-t-2xl p-4 flex items-center justify-between border-b border-gov-gold/20">
                <div className="text-white">
                  <h3 className="text-lg font-bold">{albumData?.title || expandedAlbum.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-300">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {albumData?.date || expandedAlbum.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <ImageIcon size={14} />
                      {albumData?.count || expandedAlbum.count} {t('media_photos_count')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleCloseAlbum}
                  className="w-10 h-10 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-colors"
                  aria-label={t('media_close')}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="bg-gov-forest rounded-b-2xl p-6">
                {loadingAlbum ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-12 h-12 border-4 border-gov-gold border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : albumData?.photos && albumData.photos.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {albumData.photos.map((photo, index) => (
                      <div
                        key={photo.id}
                        className="group relative aspect-square rounded-lg overflow-hidden bg-black cursor-pointer hover:scale-105 transition-transform duration-300"
                        onClick={() => {
                          // Save album context so we can return to it
                          setSourceAlbum({ item: expandedAlbum!, data: albumData! });
                          setExpandedAlbum(null);
                          setAlbumData(null);
                          setExpandedImage({
                            id: photo.id,
                            title: photo.title,
                            type: 'photo',
                            thumbnailUrl: photo.url,
                            url: photo.url,
                            date: albumData.date,
                          });
                        }}
                      >
                        <Image
                          src={photo.url}
                          alt={photo.title}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-xs font-medium">
                            <span>{t('media_photo')} {index + 1}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload({ id: photo.id, title: photo.title, type: 'photo', thumbnailUrl: photo.url, url: photo.url, date: albumData.date } as MediaItem, e);
                              }}
                              disabled={downloadingItems.has(photo.id)}
                              className={`w-7 h-7 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors ${
                                downloadingItems.has(photo.id) ? 'bg-gov-gold/60 cursor-wait' : 'bg-white/20 hover:bg-white/40'
                              }`}
                              title={downloadingItems.has(photo.id) ? t('media_downloading') : t('media_download')}
                            >
                              {downloadingItems.has(photo.id) ? (
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Download size={12} />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-white">
                    <p>{t('media_no_album_photos')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      <ShareMenu
        isOpen={!!shareData}
        onClose={() => setShareData(null)}
        title={shareData?.title || ''}
        url={shareData?.url || ''}
      />

      {/* Download progress toast (Bug 2 fix) */}
      {downloadingItems.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 bg-gov-forest text-white rounded-xl shadow-2xl flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-bold">
            {t('media_downloading')}
          </span>
        </div>
      )}
    </div>
  );
}
