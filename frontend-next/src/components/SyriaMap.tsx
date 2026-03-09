'use client';

import React, { useState, useCallback, memo, useRef, useEffect } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';

const GEO_URL = '/assets/geo/syria-governorates.json';

const GOVERNORATE_NAMES: Record<string, { ar: string; en: string }> = {
  'Aleppo': { ar: 'حلب', en: 'Aleppo' },
  'ArRaqqah': { ar: 'الرقة', en: 'Ar-Raqqa' },
  'AlḤasakah': { ar: 'الحسكة', en: 'Al-Hasakah' },
  'DayrAzZawr': { ar: 'دير الزور', en: 'Deir ez-Zor' },
  'Idlib': { ar: 'إدلب', en: 'Idlib' },
  'Lattakia': { ar: 'اللاذقية', en: 'Latakia' },
  'Tartus': { ar: 'طرطوس', en: 'Tartus' },
  'Hamah': { ar: 'حماة', en: 'Hama' },
  'Hims': { ar: 'حمص', en: 'Homs' },
  'RifDimashq': { ar: 'ريف دمشق', en: 'Rif Dimashq' },
  'Damascus': { ar: 'دمشق', en: 'Damascus' },
  'Quneitra': { ar: 'القنيطرة', en: 'Quneitra' },
  "Dar`a": { ar: 'درعا', en: 'Daraa' },
  "AsSuwayda'": { ar: 'السويداء', en: 'As-Suwayda' },
};

const CENTER: [number, number] = [38.5, 35.2];
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

interface TooltipState {
  x: number;
  y: number;
  name: string;
}

function SyriaMap() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isArabic = language === 'ar';
  const isDark = theme === 'dark';
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState<{ coordinates: [number, number]; zoom: number }>({
    coordinates: CENTER,
    zoom: 1,
  });
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    const override = () => {
      const svg = mapContainerRef.current?.querySelector('svg');
      if (svg) svg.style.touchAction = 'pan-y';
    };
    override();
    const observer = new MutationObserver(override);
    observer.observe(mapContainerRef.current, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
    return () => observer.disconnect();
  }, []);

  // Dismiss tooltip on scroll so it does not float away from the map
  useEffect(() => {
    const dismiss = () => { setTooltip(null); setHoveredName(null); };
    window.addEventListener('scroll', dismiss, { passive: true });
    return () => window.removeEventListener('scroll', dismiss);
  }, []);

  const handleZoomIn = useCallback(() => {
    setPosition((pos) => ({
      ...pos,
      zoom: Math.min(pos.zoom * 1.5, MAX_ZOOM),
    }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setPosition((pos) => ({
      ...pos,
      zoom: Math.max(pos.zoom / 1.5, MIN_ZOOM),
    }));
  }, []);

  const handleMoveEnd = useCallback((pos: { coordinates: [number, number]; zoom: number }) => {
    setPosition(pos);
  }, []);

  // Convert client coordinates to map-container-relative coordinates
  const toRelative = useCallback((clientX: number, clientY: number) => {
    if (!mapContainerRef.current) return { x: clientX, y: clientY };
    const rect = mapContainerRef.current.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  const handleMouseEnter = useCallback((geo: { properties: { name: string } }, evt: React.MouseEvent) => {
    const name = geo.properties.name;
    setHoveredName(name);
    const pos = toRelative(evt.clientX, evt.clientY);
    setTooltip({ x: pos.x, y: pos.y, name });
  }, [toRelative]);

  const handleMouseMove = useCallback((geo: { properties: { name: string } }, evt: React.MouseEvent) => {
    const pos = toRelative(evt.clientX, evt.clientY);
    setTooltip({ x: pos.x, y: pos.y, name: geo.properties.name });
  }, [toRelative]);

  const handleMouseLeave = useCallback(() => {
    setHoveredName(null);
    setTooltip(null);
  }, []);

  const handleClick = useCallback((geo: { properties: { name: string } }, evt: React.MouseEvent) => {
    const name = geo.properties.name;
    const pos = toRelative(evt.clientX, evt.clientY);

    if (selectedName === name) {
      // Deselect
      setSelectedName(null);
      setTooltip(null);
    } else {
      setSelectedName(name);
      setTooltip({ x: pos.x, y: pos.y, name });
    }
  }, [selectedName, toRelative]);

  const handleMapBackgroundClick = useCallback(() => {
    setSelectedName(null);
    setTooltip(null);
  }, []);

  const defaultFill = isDark ? '#374151' : '#e5e7eb';
  const hoverFill = isDark ? '#b9a779' : '#094239';
  const strokeColor = isDark ? '#1f2937' : '#ffffff';

  const activeName = selectedName || hoveredName;
  const tooltipInfo = activeName ? GOVERNORATE_NAMES[activeName] : null;

  return (
    <section className="relative py-10 md:py-24 overflow-hidden bg-white dark:bg-dm-bg">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 container mx-auto px-4">
        {/* Section heading */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-4xl font-display font-bold text-gov-forest dark:text-gov-teal mb-2 md:mb-3">
            {isArabic ? 'مواقع خاصة بنا' : 'Our Locations'}
          </h2>
          <p className="text-gov-stone dark:text-white/70 max-w-xl mx-auto text-sm md:text-base px-4">
            {isArabic
              ? 'استكشف مواقع مديرياتنا في كافة أنحاء القطر'
              : 'Explore our directorate locations across the country'}
          </p>
          <div className="mt-3 md:mt-4 mx-auto w-16 md:w-20 h-1 rounded-full bg-gov-gold" />
        </div>

        {/* Map container */}
        <div ref={mapContainerRef} className="relative w-full max-w-3xl mx-auto overflow-hidden bg-gray-50 dark:bg-dm-surface rounded-lg h-[300px] md:h-[450px]">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              center: CENTER,
              scale: 3800,
            }}
            width={800}
            height={600}
            className="w-full h-full"
          >
            <ZoomableGroup
              center={position.coordinates}
              zoom={position.zoom}
              onMoveEnd={handleMoveEnd}
              minZoom={MIN_ZOOM}
              maxZoom={MAX_ZOOM}
            >
              <rect
                x={-1000}
                y={-1000}
                width={3000}
                height={3000}
                fill="transparent"
                onClick={handleMapBackgroundClick}
              />
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const isActive = hoveredName === geo.properties.name || selectedName === geo.properties.name;
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={isActive ? hoverFill : defaultFill}
                        stroke={strokeColor}
                        strokeWidth={0.5}
                        style={{
                          default: { outline: 'none', transition: 'fill 0.2s ease' },
                          hover: { outline: 'none', fill: hoverFill, cursor: 'pointer' },
                          pressed: { outline: 'none' },
                        }}
                        onMouseEnter={(evt) => handleMouseEnter(geo, evt as unknown as React.MouseEvent)}
                        onMouseMove={(evt) => handleMouseMove(geo, evt as unknown as React.MouseEvent)}
                        onMouseLeave={handleMouseLeave}
                        onClick={(evt) => handleClick(geo, evt as unknown as React.MouseEvent)}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>

          {/* Tooltip - absolute inside map container so it scrolls with it */}
          {tooltip && tooltipInfo && (
            <div
              className="absolute z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full"
              style={{ left: tooltip.x, top: tooltip.y - 12 }}
            >
              <div className="bg-gov-forest dark:bg-gov-emerald text-white dark:text-gov-charcoal text-xs md:text-sm font-semibold px-3 py-1.5 md:px-4 md:py-2 rounded-lg shadow-lg whitespace-nowrap">
                <span className="block text-center">{tooltipInfo.ar}</span>
                <span className="block text-center text-[10px] md:text-xs opacity-80">{tooltipInfo.en}</span>
              </div>
              <div className="flex justify-center">
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-gov-forest dark:border-t-gov-gold" />
              </div>
            </div>
          )}

          {/* Zoom controls */}
          <div className={`absolute bottom-4 z-10 flex flex-col gap-2 ${isArabic ? 'left-4' : 'right-4'}`}>
            <button
              onClick={handleZoomIn}
              disabled={position.zoom >= MAX_ZOOM}
              className="w-8 h-8 flex items-center justify-center bg-gov-brand text-white rounded-md shadow-sm border border-gray-200 dark:border-gov-border/15 hover:opacity-90 transition-opacity disabled:opacity-40 text-lg font-bold select-none"
              aria-label={isArabic ? 'تكبير' : 'Zoom in'}
            >
              +
            </button>
            <button
              onClick={handleZoomOut}
              disabled={position.zoom <= MIN_ZOOM}
              className="w-8 h-8 flex items-center justify-center bg-gov-brand text-white rounded-md shadow-sm border border-gray-200 dark:border-gov-border/15 hover:opacity-90 transition-opacity disabled:opacity-40 text-lg font-bold select-none"
              aria-label={isArabic ? 'تصغير' : 'Zoom out'}
            >
              −
            </button>
          </div>

          {/* View as list link */}
          <div className={`absolute bottom-4 z-10 ${isArabic ? 'right-4' : 'left-4'}`}>
            <Link
              href="/directorates"
              className="inline-flex items-center gap-2 border border-gray-200 dark:border-gov-border/15 text-gov-brand dark:text-gov-teal bg-white/80 dark:bg-dm-surface backdrop-blur-sm px-4 py-2 rounded-md text-xs font-medium hover:bg-white dark:hover:bg-dm-surface transition-colors"
            >
              {isArabic ? 'عرض كقائمة' : 'View as list'}
              <svg
                width="16"
                height="16"
                viewBox="0 0 21 21"
                fill="currentColor"
                className={isArabic ? '' : 'rotate-180'}
              >
                <path d="M6.45137 11.1562H17.0625V9.84375H6.45137L11.4356 4.85953L10.5 3.9375L3.9375 10.5L10.5 17.0625L11.4356 16.1405L6.45137 11.1562Z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-8 text-sm text-gov-stone dark:text-white/70">
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-4 h-4 rounded border border-white dark:border-dm-border"
              style={{ backgroundColor: defaultFill }}
            />
            <span>{isArabic ? 'محافظة' : 'Governorate'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-4 h-4 rounded border border-white dark:border-dm-border"
              style={{ backgroundColor: hoverFill }}
            />
            <span>{isArabic ? 'محافظة محددة' : 'Selected'}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(SyriaMap);
