'use client';

import React, { useState, useEffect } from 'react';

import {
  Play,
  Image as ImageIcon,
  BarChart3,
  Calendar,
  Clock,
  Eye,
  Download,
  Share2,
  Grid,
  List,
  Loader2
} from 'lucide-react';

import { useLanguage } from '@/contexts/LanguageContext';
import { API } from '@/lib/repository';
import { MediaItem } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

type MediaType = 'all' | 'video' | 'photo' | 'infographic';
type ViewMode = 'grid' | 'list';

export default function MediaPage() {
  const { language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<MediaType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      try {
        const data = await API.media.getByType(activeFilter);
        setMedia(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, [activeFilter]);

  const filteredMedia = media;


  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play size={16} />;
      case 'photo': return <ImageIcon size={16} />;
      case 'infographic': return <BarChart3 size={16} />;
      default: return null;
    }
  };

  const getTypeLabel = (type: string) => {
    if (language === 'ar') {
      switch (type) {
        case 'video': return 'فيديو';
        case 'photo': return 'صور';
        case 'infographic': return 'إنفوجرافيك';
        default: return type;
      }
    }
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const filters: { key: MediaType; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: language === 'ar' ? 'الكل' : 'All', icon: <Grid size={16} /> },
    { key: 'video', label: language === 'ar' ? 'فيديو' : 'Videos', icon: <Play size={16} /> },
    { key: 'photo', label: language === 'ar' ? 'صور' : 'Photos', icon: <ImageIcon size={16} /> },
    { key: 'infographic', label: language === 'ar' ? 'إنفوجرافيك' : 'Infographics', icon: <BarChart3 size={16} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-gov-forest">
      <Navbar />

      <main className="flex-grow pt-20">
        <div className="min-h-screen bg-gov-beige dark:bg-gov-forest pb-20">
          {/* Header */}
          <div className="bg-gov-forest text-white py-16 px-4 animate-fade-in-up">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                {language === 'ar' ? 'المركز الإعلامي' : 'Media Center'}
              </h1>
              <p className="text-gray-300 text-lg max-w-2xl">
                {language === 'ar'
                  ? 'مكتبة الفيديو والصور والإنفوجرافيك الرسمية من رئاسة مجلس الوزراء'
                  : 'Official video, photo, and infographic library from the Prime Ministry'}
              </p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Filters & View Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              {/* Type Filters */}
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setActiveFilter(filter.key)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${activeFilter === filter.key
                      ? 'bg-gov-teal text-white shadow-lg'
                      : 'bg-white dark:bg-white/10 text-gov-charcoal dark:text-white border border-gray-200 dark:border-white/20 hover:border-gov-gold/50'
                      }`}
                  >
                    {filter.icon}
                    {filter.label}
                  </button>
                ))}
              </div>

              {/* View Toggle */}
              <div className="flex gap-2 bg-white dark:bg-white/10 rounded-xl p-1 border border-gray-200 dark:border-white/20">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                    ? 'bg-gov-teal text-white'
                    : 'text-gray-500 hover:text-gov-teal'
                    }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list'
                    ? 'bg-gov-teal text-white'
                    : 'text-gray-500 hover:text-gov-teal'
                    }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6 text-gov-stone dark:text-gray-400">
              {language === 'ar'
                ? `${filteredMedia.length} عنصر`
                : `${filteredMedia.length} items`}
            </div>

            {/* Media Grid */}
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'flex flex-col gap-4'
            }>
              {loading ? (
                <div className="col-span-full flex justify-center py-20">
                  <Loader2 className="animate-spin text-gov-teal" size={40} />
                </div>
              ) : filteredMedia.map((item) => (

                <div
                  key={item.id}
                  className={`group bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden hover:border-gov-gold/50 hover:shadow-xl transition-all duration-300 cursor-pointer ${viewMode === 'list' ? 'flex' : ''
                    }`}
                >
                  {/* Thumbnail */}
                  <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 h-32 flex-shrink-0' : 'h-48'
                    }`}>
                    <Image
                      src={item.thumbnailUrl}
                      alt={item.title}
                      fill
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Type Badge */}
                    <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${item.type === 'video'
                        ? 'bg-gov-red text-white'
                        : item.type === 'photo'
                          ? 'bg-gov-teal text-white'
                          : 'bg-gov-gold text-gov-forest'
                        }`}>
                        {getTypeIcon(item.type)}
                        {getTypeLabel(item.type)}
                      </span>
                    </div>

                    {/* Play Button for Videos */}
                    {item.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play size={28} className="text-gov-forest ml-1" fill="currentColor" />
                        </div>
                      </div>
                    )}

                    {/* Duration/Count Badge */}
                    {(item.duration || item.count) && (
                      <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3">
                        <span className="px-2 py-1 rounded bg-black/70 text-white text-xs font-medium flex items-center gap-1">
                          {item.duration ? (
                            <>
                              <Clock size={12} />
                              {item.duration}
                            </>
                          ) : (
                            <>
                              <ImageIcon size={12} />
                              {item.count} {language === 'ar' ? 'صورة' : 'photos'}
                            </>
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className={`p-4 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-center' : ''}`}>
                    <h3 className="font-bold text-gov-charcoal dark:text-white mb-2 group-hover:text-gov-teal dark:group-hover:text-gov-gold transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {item.date}
                      </div>

                      {viewMode === 'list' && (
                        <div className="flex items-center gap-3">
                          <button className="flex items-center gap-1 hover:text-gov-teal transition-colors">
                            <Eye size={14} />
                            {language === 'ar' ? 'مشاهدة' : 'View'}
                          </button>
                          <button className="flex items-center gap-1 hover:text-gov-teal transition-colors">
                            <Share2 size={14} />
                            {language === 'ar' ? 'مشاركة' : 'Share'}
                          </button>
                          <button className="flex items-center gap-1 hover:text-gov-teal transition-colors">
                            <Download size={14} />
                            {language === 'ar' ? 'تحميل' : 'Download'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredMedia.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center mb-4">
                  <ImageIcon size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gov-charcoal dark:text-white mb-2">
                  {language === 'ar' ? 'لا توجد عناصر' : 'No Items Found'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {language === 'ar'
                    ? 'لا يوجد محتوى في هذه الفئة حالياً'
                    : 'No content in this category currently'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
