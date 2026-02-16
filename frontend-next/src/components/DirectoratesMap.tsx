'use client';

import React, { useState, useCallback, memo, useEffect } from 'react';
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
    ZoomableGroup,
} from 'react-simple-maps';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { API } from '@/lib/repository';
import { Directorate } from '@/types';
import Link from 'next/link';
import { MapPin, Info, ArrowRight, ArrowLeft } from 'lucide-react';

const GEO_URL = '/assets/geo/syria-governorates.json';

const CENTER: [number, number] = [38.5, 35.2];
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

function DirectoratesMap() {
    const { language } = useLanguage();
    const { theme } = useTheme();
    const isArabic = language === 'ar';
    const isDark = theme === 'dark';

    const [directorates, setDirectorates] = useState<Directorate[]>([]);
    const [loading, setLoading] = useState(true);
    const [position, setPosition] = useState<{ coordinates: [number, number]; zoom: number }>({
        coordinates: CENTER,
        zoom: 1,
    });
    const [hoveredDirectorate, setHoveredDirectorate] = useState<Directorate | null>(null);
    const [selectedDirectorate, setSelectedDirectorate] = useState<Directorate | null>(null);
    const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null);

    useEffect(() => {
        const fetchDirectorates = async () => {
            try {
                const data = await API.directorates.getAll();
                // Filter those with coordinates
                setDirectorates(data.filter(d => d.latitude && d.longitude));
            } catch (error) {
                console.error('Failed to fetch directorates for map:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDirectorates();
    }, []);

    const handleMoveEnd = useCallback((pos: { coordinates: [number, number]; zoom: number }) => {
        setPosition(pos);
    }, []);

    const handleZoomIn = () => {
        setPosition(pos => ({ ...pos, zoom: Math.min(pos.zoom * 1.5, MAX_ZOOM) }));
    };

    const handleZoomOut = () => {
        setPosition(pos => ({ ...pos, zoom: Math.max(pos.zoom / 1.5, MIN_ZOOM) }));
    };

    // Colors based on theme
    const mapBase = isDark ? '#1f2937' : '#f3f4f6';
    const geoFill = isDark ? '#374151' : '#ffffff';
    const geoStroke = isDark ? '#111827' : '#e5e7eb';
    const markerColor = '#b9a779'; // gov-gold

    const totalDirectorates = directorates.length;
    const mappedDirectorates = directorates.filter(d => d.latitude && d.longitude).length;

    return (
        <div className="w-full bg-white dark:bg-dm-surface rounded-3xl shadow-xl border border-gray-100 dark:border-gov-border/15 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gov-border/15 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-gov-forest dark:text-gov-gold flex items-center gap-2">
                        <MapIcon className="text-gov-gold" />
                        {isArabic ? 'مواقع المديريات' : 'Directorate Locations'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-white/60">
                        {isArabic ? 'استكشف مواقع مديرياتنا في كافة أنحاء القطر' : 'Explore our directorate locations across the country'}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs px-2 py-1 rounded-lg bg-gov-gold/10 text-gov-gold font-medium">
                            {isArabic ? `${mappedDirectorates} من ${totalDirectorates} مديرية على الخريطة` : `${mappedDirectorates} of ${totalDirectorates} on map`}
                        </span>
                    </div>
                </div>
            </div>

            <div className="relative h-[500px] w-full bg-gray-50 dark:bg-dm-bg group">
                {loading && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/50 dark:bg-dm-bg/50 backdrop-blur-sm">
                        <div className="w-10 h-10 border-4 border-gov-gold border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                <ComposableMap
                    projection="geoMercator"
                    projectionConfig={{
                        center: [38.5, 35.2],
                        scale: 4500,
                    }}
                    className="w-full h-full"
                >
                    <ZoomableGroup
                        center={position.coordinates}
                        zoom={position.zoom}
                        onMoveEnd={handleMoveEnd}
                        minZoom={MIN_ZOOM}
                        maxZoom={MAX_ZOOM}
                    >
                        <Geographies geography={GEO_URL}>
                            {({ geographies }) =>
                                geographies.map((geo) => (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        fill={geoFill}
                                        stroke={geoStroke}
                                        strokeWidth={0.5}
                                        style={{
                                            default: { outline: 'none' },
                                            hover: { outline: 'none', fill: isDark ? '#4b5563' : '#f9fafb' },
                                            pressed: { outline: 'none' },
                                        }}
                                    />
                                ))
                            }
                        </Geographies>

                        {directorates.map((d) => {
                            const isSelected = selectedDirectorate?.id === d.id;
                            return (
                                <Marker
                                    key={d.id}
                                    coordinates={[Number(d.longitude), Number(d.latitude)]}
                                    onMouseEnter={(evt) => {
                                        setHoveredDirectorate(d);
                                        setTooltip({ x: evt.clientX, y: evt.clientY });
                                    }}
                                    onMouseLeave={() => {
                                        setHoveredDirectorate(null);
                                        setTooltip(null);
                                    }}
                                    onClick={() => {
                                        setSelectedDirectorate(d);
                                    }}
                                >
                                    <circle
                                        r={isSelected ? 8 : (position.zoom > 2 ? 4 : 6)}
                                        fill={markerColor}
                                        stroke={isSelected ? '#0a5d52' : (isDark ? '#000' : '#fff')}
                                        strokeWidth={isSelected ? 2.5 : 1.5}
                                        className="cursor-pointer hover:r-8 transition-all duration-300"
                                    />
                                    {!isSelected && (
                                        <circle
                                            r={position.zoom > 2 ? 8 : 12}
                                            fill={markerColor}
                                            className="animate-ping opacity-20 pointer-events-none"
                                        />
                                    )}
                                </Marker>
                            );
                        })}
                    </ZoomableGroup>
                </ComposableMap>

                {/* Custom Tooltip */}
                {hoveredDirectorate && tooltip && (
                    <div
                        className="fixed z-[100] pointer-events-none transform -translate-x-1/2 -translate-y-full mb-4"
                        style={{ left: tooltip.x, top: tooltip.y }}
                    >
                        <div className="bg-white dark:bg-dm-surface p-4 rounded-2xl shadow-2xl border border-gray-100 dark:border-gov-border/20 min-w-[200px] animate-in fade-in zoom-in duration-200">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-gov-gold/10 flex items-center justify-center text-gov-gold">
                                    <MapPin size={16} />
                                </div>
                                <h4 className="font-bold text-gov-forest dark:text-white text-sm">
                                    {isArabic
                                        ? (typeof hoveredDirectorate.name === 'string' ? hoveredDirectorate.name : hoveredDirectorate.name.ar)
                                        : (typeof hoveredDirectorate.name === 'string' ? hoveredDirectorate.name : hoveredDirectorate.name.en)}
                                </h4>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-white/60 mb-3 leading-relaxed">
                                {isArabic ? hoveredDirectorate.address_ar : hoveredDirectorate.address_en}
                            </p>
                            <div className="flex items-center justify-between text-[10px] font-bold text-gov-gold uppercase tracking-wider">
                                <span>{isArabic ? 'انقر للمزيد' : 'Click for details'}</span>
                                {isArabic ? <ArrowLeft size={12} /> : <ArrowRight size={12} />}
                            </div>
                        </div>
                    </div>
                )}

                {/* Selected Directorate Info Panel */}
                {selectedDirectorate && (
                    <div className={`absolute top-6 ${isArabic ? 'left-6' : 'right-6'} bg-white dark:bg-dm-surface rounded-2xl shadow-2xl border border-gray-100 dark:border-gov-border/20 p-6 max-w-sm z-30 animate-in fade-in slide-in-from-right duration-300`}>
                        <button
                            onClick={() => setSelectedDirectorate(null)}
                            className="absolute top-4 ltr:right-4 rtl:left-4 w-6 h-6 rounded-full bg-gray-100 dark:bg-gov-border/20 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gov-border/30 transition-colors"
                        >
                            ×
                        </button>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gov-gold/10 flex items-center justify-center text-gov-gold">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gov-forest dark:text-white text-lg">
                                    {isArabic
                                        ? (typeof selectedDirectorate.name === 'string' ? selectedDirectorate.name : selectedDirectorate.name.ar)
                                        : (typeof selectedDirectorate.name === 'string' ? selectedDirectorate.name : selectedDirectorate.name.en)}
                                </h3>
                                <span className="text-xs text-gray-500 dark:text-white/50">
                                    {isArabic ? 'مديرية' : 'Directorate'}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {(selectedDirectorate.address_ar || selectedDirectorate.address_en) && (
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-white/50 mb-1 font-medium">
                                        {isArabic ? 'العنوان' : 'Address'}
                                    </p>
                                    <p className="text-sm text-gray-700 dark:text-white/80">
                                        {isArabic ? selectedDirectorate.address_ar : selectedDirectorate.address_en}
                                    </p>
                                </div>
                            )}

                            {(selectedDirectorate.phone || selectedDirectorate.email) && (
                                <div className="border-t border-gray-100 dark:border-gov-border/15 pt-3">
                                    {selectedDirectorate.phone && (
                                        <p className="text-sm text-gray-700 dark:text-white/80 mb-1">
                                            <span className="text-xs text-gray-500 dark:text-white/50">{isArabic ? 'الهاتف:' : 'Phone:'}</span>{' '}
                                            {selectedDirectorate.phone}
                                        </p>
                                    )}
                                    {selectedDirectorate.email && (
                                        <p className="text-sm text-gray-700 dark:text-white/80">
                                            <span className="text-xs text-gray-500 dark:text-white/50">{isArabic ? 'البريد:' : 'Email:'}</span>{' '}
                                            {selectedDirectorate.email}
                                        </p>
                                    )}
                                </div>
                            )}

                            <Link
                                href={`/directorates/${selectedDirectorate.id}`}
                                className="flex items-center justify-center gap-2 w-full mt-4 py-2.5 px-4 bg-gov-gold text-white rounded-xl hover:bg-gov-gold/90 transition-colors font-medium text-sm"
                            >
                                {isArabic ? 'عرض التفاصيل الكاملة' : 'View Full Details'}
                                {isArabic ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                            </Link>
                        </div>
                    </div>
                )}

                {/* Zoom Controls */}
                <div className={`absolute bottom-6 flex flex-col gap-2 ${isArabic ? 'left-6' : 'right-6'}`}>
                    <button
                        onClick={handleZoomIn}
                        className="w-10 h-10 bg-white dark:bg-dm-surface rounded-xl shadow-lg flex items-center justify-center text-gov-forest dark:text-gov-gold hover:bg-gov-gold hover:text-white dark:hover:bg-gov-gold transition-all border border-gray-100 dark:border-gov-border/15"
                    >
                        +
                    </button>
                    <button
                        onClick={handleZoomOut}
                        className="w-10 h-10 bg-white dark:bg-dm-surface rounded-xl shadow-lg flex items-center justify-center text-gov-forest dark:text-gov-gold hover:bg-gov-gold hover:text-white dark:hover:bg-gov-gold transition-all border border-gray-100 dark:border-gov-border/15"
                    >
                        -
                    </button>
                </div>
            </div>
        </div>
    );
}

// Simple Map icon component as fallback or use lucide
function MapIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
            <line x1="8" y1="2" x2="8" y2="18" />
            <line x1="16" y1="6" x2="16" y2="22" />
        </svg>
    );
}

export default memo(DirectoratesMap);
