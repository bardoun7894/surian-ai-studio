'use client';
import { usePageLoading } from '@/hooks/usePageLoading';

import React, { useState, useEffect, useMemo, useCallback } from 'react';

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
  ChevronLeft,
  Loader2,
  CheckCircle2,
  Package
} from 'lucide-react';

import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
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

type MediaType = 'all' | 'video' | 'photo' | 'infographic';
type ViewMode = 'grid' | 'list';

export default function MediaPage() {
  const { language, t } = useLanguage();
  const isAr = language === 'ar';
  const [activeFilter, setActiveFilter] = useState<MediaType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
    usePageLoading(loading);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
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
  const [loadingMedia, setLoadingMedia] = useState<Record<string, boolean>>({});

  // Album download state
  const [downloadingAlbum, setDownloadingAlbum] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({ current: 0, total: 0 });

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
      case 'video': return t('media_filter_video');
      case 'photo': return t('media_filter_photo');
      case 'infographic': return t('media_filter_infographic');
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

    const url = item.type === 'photo' ? (item.thumbnailUrl || item.url) : item.url;
    if (!url) return;
    toast(language === 'ar' ? 'جار التحميل...' : 'Downloading...', { duration: 3000 });

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
    }
  };

  // Download all album photos as a zip
  const handleDownloadAlbum = useCallback(async (album: AlbumData) => {
    if (downloadingAlbum || !album.photos || album.photos.length === 0) return;

    setDownloadingAlbum(true);
    setDownloadProgress({ current: 0, total: album.photos.length });

    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      const folder = zip.folder(album.title || 'album');

      if (!folder) {
        throw new Error('Failed to create zip folder');
      }

      // Download all images in parallel with concurrency limit
      const concurrency = 4;
      let completed = 0;

      const downloadImage = async (photo: typeof album.photos[0], index: number) => {
        try {
          const response = await fetch(photo.url);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status} for ${photo.url}`);
          }
          const blob = await response.blob();
          const ext = blob.type.split('/')[1]?.split('+')[0] || photo.url.split('.').pop()?.split('?')[0] || 'jpg';
          const fileName = photo.file_name || `${photo.title || `photo-${index + 1}`}.${ext}`;
          folder.file(fileName, blob);
        } catch (err) {
          console.warn(`Failed to download image ${index + 1}:`, err);
        }
        completed++;
        setDownloadProgress({ current: completed, total: album.photos.length });
      };

      // Process in batches
      for (let i = 0; i < album.photos.length; i += concurrency) {
        const batch = album.photos.slice(i, i + concurrency);
        await Promise.all(batch.map((photo, batchIndex) => downloadImage(photo, i + batchIndex)));
      }

      // Generate zip
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = zipUrl;
      link.download = `${album.title || 'album'}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(zipUrl);
    } catch (err) {
      console.error('Failed to create album zip:', err);
    } finally {
      setDownloadingAlbum(false);
      setDownloadProgress({ current: 0, total: 0 });
    }
  }, [downloadingAlbum]);

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
    { key: 'all', label: t('media_filter_all'), icon: Grid },
    { key: 'video', label: t('media_filter_video'), icon: Play },
    { key: 'photo', label: t('media_filter_photo'), icon: ImageIcon },
    { key: 'infographic', label: t('media_filter_infographic'), icon: BarChart3 },
  ];

  // Render inline video player
  const renderInlinePlayer = (item: MediaItem) => {
    if (!item.url) return null;

    if (isYouTubeUrl(item.url)) {
      const ytId = getYouTubeId(item.url);
      if (!ytId) return null;
      return (
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=0&rel=0&modestbranding=1&playsinline=1`}
          title={item.title}
          allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0 z-10"
        />
      );
    }

    return (
      <>
        {loadingMedia[item.id] && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-20">
            <Loader2 size={36} className="text-gov-gold animate-spin mb-2" />
            <span className="text-white/80 text-sm font-medium">{t('media_loading')}</span>
          </div>
        )}
        <video
          src={item.url}
          poster={item.thumbnailUrl}
          controls
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-contain bg-black z-10"
          onLoadStart={() => setLoadingMedia(prev => ({ ...prev, [item.id]: true }))}
          onCanPlay={() => setLoadingMedia(prev => ({ ...prev, [item.id]: false }))}
          onError={() => setLoadingMedia(prev => ({ ...prev, [item.id]: false }))}
          onDoubleClick={(e) => {
            e.stopPropagation();
            const videoEl = e.currentTarget;
            if (document.fullscreenElement) {
              document.exitFullscreen?.();
            } else if ((videoEl as any).webkitEnterFullscreen) {
              (videoEl as any).webkitEnterFullscreen();
            } else if (videoEl.requestFullscreen) {
              videoEl.requestFullscreen();
            }
          }}
          onTouchEnd={(e) => {
            const now = Date.now();
            const DOUBLE_TAP_DELAY = 300;
            const videoEl = e.currentTarget as HTMLVideoElement;
            if ((videoEl as any)._lastTap && now - (videoEl as any)._lastTap < DOUBLE_TAP_DELAY) {
              e.preventDefault();
              if (document.fullscreenElement) {
                document.exitFullscreen?.();
              } else if ((videoEl as any).webkitEnterFullscreen) {
                (videoEl as any).webkitEnterFullscreen();
              } else if (videoEl.requestFullscreen) {
                videoEl.requestFullscreen();
              }
              (videoEl as any)._lastTap = 0;
            } else {
              (videoEl as any)._lastTap = now;
            }
          }}
        >
          {t('media_browser_no_video')}
        </video>
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg">
      <Navbar />

      <main className="flex-grow pt-16 md:pt-[5.75rem]">
        <div className="min-h-screen bg-gov-beige dark:bg-dm-bg pb-20">
          {/* Header */}
          <div className="bg-gov-forest text-white py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-4">
                {t('media_center_title')}
              </h1>
              <p className="text-gray-300 text-lg max-w-2xl">
                {t('media_center_subtitle')}
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
                <div className="flex gap-1.5 bg-white dark:bg-dm-surface rounded-xl p-1 border border-gray-200 dark:border-gov-border/25">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2.5 rounded-lg transition-all duration-200 ${viewMode === 'grid'
                      ? 'bg-gov-teal text-white shadow-sm'
                      : 'text-gray-500 hover:text-gov-teal hover:bg-gray-50 dark:hover:bg-white/5'
                      }`}
                    title={t('ui_view_grid')}
                    aria-label={t('ui_view_grid')}
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2.5 rounded-lg transition-all duration-200 ${viewMode === 'list'
                      ? 'bg-gov-teal text-white shadow-sm'
                      : 'text-gray-500 hover:text-gov-teal hover:bg-gray-50 dark:hover:bg-white/5'
                      }`}
                    title={t('ui_view_list')}
                    aria-label={t('ui_view_list')}
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
                        <>
                          {loadingMedia[item.id] && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gov-forest/20 dark:bg-dm-bg/50 z-10">
                              <Loader2 size={28} className="text-gov-gold animate-spin mb-2" />
                              <span className="text-white/80 text-xs font-medium">{t('media_loading')}</span>
                            </div>
                          )}
                          <Image
                            src={item.thumbnailUrl}
                            alt={item.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onLoadingComplete={() => setLoadingMedia(prev => ({ ...prev, [item.id]: false }))}
                            onError={() => setLoadingMedia(prev => ({ ...prev, [item.id]: false }))}
                          />
                        </>
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

                      {/* Play Button for Videos (only when not playing - native controls handle playback) */}
                      {isVideo && !isPlaying && (
                        <button
                          onClick={(e) => handlePlayInline(item, e)}
                          className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer"
                        >
                          <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 bg-white/90 group-hover:scale-110 group-hover:bg-white">
                            <Play size={28} className="text-gov-forest ltr:ml-1 rtl:mr-1" fill="currentColor" />
                          </div>
                        </button>
                      )}

                      {/* Expand button (visible on hover when playing) */}
                      {isPlaying && isVideo && (
                        <button
                          onClick={(e) => handleExpand(item, e)}
                          className="absolute top-3 left-3 rtl:left-auto rtl:right-3 z-30 w-8 h-8 rounded-lg bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
                          title={t('media_expand')}
                        >
                          <Maximize2 size={14} />
                        </button>
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
                          {/* Hide download button for YouTube videos */}
                          {!(item.type === 'video' && item.url && isYouTubeUrl(item.url)) && (
                            <button
                              onClick={(e) => handleDownload(item, e)}
                              className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 flex items-center justify-center transition-colors"
                              title={t('media_download')}
                            >
                              <Download size={14} />
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
                            {/* Hide download button for YouTube videos */}
                            {!(item.type === 'video' && item.url && isYouTubeUrl(item.url)) && (
                              <button
                                onClick={(e) => handleDownload(item, e)}
                                className="flex items-center gap-1 hover:text-gov-teal transition-colors"
                              >
                                <Download size={14} />
                                {t('media_download')}
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
                aria-label={t('ui_close')}
              >
                <X size={20} />
              </button>

              <div className="aspect-video w-full">
                {isYouTubeUrl(expandedVideo.url) ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeId(expandedVideo.url)}?autoplay=1&mute=0&rel=0&modestbranding=1&playsinline=1`}
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
                    playsInline
                    className="w-full h-full object-contain bg-black"
                    ref={(el) => {
                      if (el) {
                        el.volume = 1;
                        el.muted = false;
                        el.play().catch(() => {
                          el.muted = true;
                          el.play().catch(() => {});
                        });
                      }
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      const videoEl = e.currentTarget;
                      if (document.fullscreenElement) {
                        document.exitFullscreen?.();
                      } else if ((videoEl as any).webkitEnterFullscreen) {
                        (videoEl as any).webkitEnterFullscreen();
                      } else if (videoEl.requestFullscreen) {
                        videoEl.requestFullscreen();
                      }
                    }}
                    onTouchEnd={(e) => {
                      const now = Date.now();
                      const DOUBLE_TAP_DELAY = 300;
                      const videoEl = e.currentTarget as HTMLVideoElement;
                      if ((videoEl as any)._lastTap && now - (videoEl as any)._lastTap < DOUBLE_TAP_DELAY) {
                        e.preventDefault();
                        if (document.fullscreenElement) {
                          document.exitFullscreen?.();
                        } else if ((videoEl as any).webkitEnterFullscreen) {
                          (videoEl as any).webkitEnterFullscreen();
                        } else if (videoEl.requestFullscreen) {
                          videoEl.requestFullscreen();
                        }
                        (videoEl as any)._lastTap = 0;
                      } else {
                        (videoEl as any)._lastTap = now;
                      }
                    }}
                  >
                    {t('media_browser_no_video')}
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
                  aria-label={t('ui_close')}
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
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-bold transition-colors"
                >
                  <Download size={16} />
                  {t('media_download')}
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
              <div className="sticky top-0 z-10 bg-gov-forest/95 backdrop-blur-sm rounded-t-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gov-gold/20">
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
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {/* Download All button */}
                  {albumData && albumData.photos && albumData.photos.length > 0 && (
                    <button
                      onClick={() => handleDownloadAlbum(albumData)}
                      disabled={downloadingAlbum}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex-1 sm:flex-initial justify-center ${
                        downloadingAlbum
                          ? 'bg-gov-gold/30 text-gov-gold cursor-wait'
                          : 'bg-gov-gold hover:bg-gov-gold/90 text-gov-forest hover:shadow-lg'
                      }`}
                    >
                      {downloadingAlbum ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>
                            {t('media_downloading')} ({downloadProgress.current}/{downloadProgress.total})
                          </span>
                        </>
                      ) : (
                        <>
                          <Package size={16} />
                          <span>{t('media_download_all')}</span>
                        </>
                      )}
                    </button>
                  )}
                  <button
                    onClick={handleCloseAlbum}
                    className="w-10 h-10 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                    aria-label={t('ui_close')}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Download Progress Bar */}
              {downloadingAlbum && (
                <div className="bg-gov-forest/90 px-5 py-3 border-b border-gov-gold/20">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gov-gold rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${downloadProgress.total > 0 ? (downloadProgress.current / downloadProgress.total) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-gov-gold font-bold whitespace-nowrap">
                      {downloadProgress.total > 0
                        ? `${Math.round((downloadProgress.current / downloadProgress.total) * 100)}%`
                        : '0%'}
                    </span>
                    {downloadProgress.current === downloadProgress.total && downloadProgress.total > 0 && (
                      <CheckCircle2 size={16} className="text-green-400" />
                    )}
                  </div>
                </div>
              )}

              <div className="bg-gov-forest rounded-b-2xl p-4 sm:p-6">
                {loadingAlbum ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-12 h-12 border-4 border-gov-gold border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : albumData?.photos && albumData.photos.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
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
                            <span>{t('media_photo_label')} {index + 1}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload({ id: photo.id, title: photo.title, type: 'photo', thumbnailUrl: photo.url, url: photo.url, date: albumData.date } as MediaItem, e);
                              }}
                              className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors"
                              title={t('media_download')}
                            >
                              <Download size={12} />
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
    </div>
  );
}
