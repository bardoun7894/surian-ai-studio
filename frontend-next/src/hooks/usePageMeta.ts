"use client";

import { useEffect } from "react";

interface PageMeta {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

/**
 * Dynamically sets document title and Open Graph meta tags for client-side pages.
 * Falls back to root layout defaults for any missing values.
 */
export function usePageMeta({ title, description, image, url, type = "website" }: PageMeta) {
  useEffect(() => {
    // Set document title using the template from root layout
    const fullTitle = `${title} | وزارة الاقتصاد والصناعة`;
    document.title = fullTitle;

    // Helper to set or create a meta tag
    const setMeta = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const setNameMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // Open Graph
    setMeta("og:title", fullTitle);
    if (description) {
      setMeta("og:description", description);
      setNameMeta("description", description);
    }
    if (image) setMeta("og:image", image);
    if (url) setMeta("og:url", url);
    setMeta("og:type", type);
    setMeta("og:site_name", "وزارة الاقتصاد والصناعة");
    setMeta("og:locale", "ar_SY");

    // Twitter Card
    setNameMeta("twitter:card", "summary_large_image");
    setNameMeta("twitter:title", fullTitle);
    if (description) setNameMeta("twitter:description", description);
    if (image) setNameMeta("twitter:image", image);
  }, [title, description, image, url, type]);
}
