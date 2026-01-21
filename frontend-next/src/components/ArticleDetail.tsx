'use client';

import React from 'react';
import { Calendar, User, Clock, Share2, Printer, ChevronRight, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ArticleDetailProps {
    title: string;
    date: string;
    category: string;
    author?: string;
    readTime?: string;
    imageUrl?: string;
    content: string;
    backLink: {
        href: string;
        label: string;
    };
    relatedItems?: Array<{
        id: string;
        title: string;
        date: string;
        href: string;
    }>;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({
    title,
    date,
    category,
    author,
    readTime,
    imageUrl,
    content,
    backLink,
    relatedItems
}) => {
    return (
        <div className="bg-gov-beige dark:bg-gov-forest/30 min-h-screen pb-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">

                {/* Back Link */}
                <Link
                    href={backLink.href}
                    className="inline-flex items-center gap-2 text-gov-teal dark:text-gov-gold font-bold mb-8 hover:gap-3 transition-all"
                >
                    <ChevronRight size={20} className="rtl:rotate-0 rotate-180" />
                    {backLink.label}
                </Link>

                <article className="bg-white dark:bg-white/5 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-white/10">

                    {/* Featured Image */}
                    {imageUrl && (
                        <div className="relative h-[400px] w-full">
                            <Image
                                src={imageUrl}
                                alt={title}
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-6 right-6 rtl:right-auto rtl:left-6">
                                <span className="px-4 py-1.5 bg-gov-gold text-gov-forest text-sm font-bold rounded-full">
                                    {category}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="p-8 md:p-12">
                        {/* Meta Data */}
                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-8 pb-8 border-b border-gray-100 dark:border-white/10">
                            <div className="flex items-center gap-2">
                                <Calendar size={18} />
                                {date}
                            </div>
                            {author && (
                                <div className="flex items-center gap-2">
                                    <User size={18} />
                                    {author}
                                </div>
                            )}
                            {readTime && (
                                <div className="flex items-center gap-2">
                                    <Clock size={18} />
                                    {readTime}
                                </div>
                            )}
                            <div className="flex-1" />
                            <div className="flex items-center gap-4">
                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors" title="Print">
                                    <Printer size={18} />
                                </button>
                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors" title="Share">
                                    <Share2 size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Content Body */}
                        <h1 className="text-3xl md:text-4xl font-display font-bold text-gov-forest dark:text-white mb-8 leading-tight">
                            {title}
                        </h1>

                        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-headings:text-gov-forest dark:prose-headings:text-gov-gold prose-p:text-gray-600 dark:prose-p:text-gray-300">
                            {/* Simple content rendering, assuming markdown or pre-formatted text for now */}
                            {content.split('\n\n').map((paragraph, idx) => (
                                <p key={idx} className="mb-4 leading-relaxed">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                </article>

                {/* Related Items */}
                {relatedItems && relatedItems.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-display font-bold text-gov-forest dark:text-white mb-8 border-r-4 border-gov-gold pr-4">
                            مواضيع ذات صلة
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedItems.map((item) => (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 hover:border-gov-gold/50 hover:shadow-lg transition-all"
                                >
                                    <h3 className="font-bold text-gov-charcoal dark:text-white mb-2 line-clamp-2">
                                        {item.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Calendar size={14} />
                                        {item.date}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArticleDetail;
