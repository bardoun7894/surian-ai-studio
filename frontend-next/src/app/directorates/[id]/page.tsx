import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DirectorateDetail from '@/components/DirectorateDetail';
import { SkeletonText, SkeletonCard, SkeletonGrid } from '@/components/SkeletonLoader';

function DirectorateSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dm-bg">
            {/* Hero Section Skeleton */}
            <div className="bg-gradient-to-br from-gov-forest via-gov-emerald to-gov-teal text-white py-24 px-4 relative overflow-hidden">
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="h-8 w-48 bg-white/10 rounded-lg mb-8 animate-pulse" />
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="w-32 h-32 rounded-3xl bg-white/10 animate-pulse" />
                        <div className="flex-1 space-y-4 w-full">
                            <div className="h-12 md:h-16 bg-white/10 rounded-xl animate-pulse w-3/4" />
                            <div className="h-6 bg-white/10 rounded-lg animate-pulse w-1/2" />
                            <div className="flex gap-3 mt-6">
                                <div className="h-10 w-32 bg-white/10 rounded-xl animate-pulse" />
                                <div className="h-10 w-32 bg-white/10 rounded-xl animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* News & Announcements Skeleton */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="h-8 w-64 bg-gray-200 dark:bg-white/10 rounded-xl animate-pulse mb-6" />
                        <div className="bg-white dark:bg-dm-surface rounded-2xl shadow-sm border border-gray-100 dark:border-gov-border/15 p-6">
                            <div className="h-64 bg-gray-200 dark:bg-white/5 rounded-xl animate-pulse mb-6" />
                            <SkeletonText lines={4} />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="h-8 w-48 bg-gray-200 dark:bg-white/10 rounded-xl animate-pulse mb-6" />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                </div>
            </div>

            {/* Services Section Skeleton */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="bg-white dark:bg-dm-surface rounded-2xl shadow-sm border border-gray-100 dark:border-gov-border/15 overflow-hidden">
                    <div className="p-8 border-b border-gray-100 dark:border-gov-border/15">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="h-8 w-48 bg-gray-200 dark:bg-white/10 rounded-xl animate-pulse" />
                            <div className="h-10 w-40 bg-gray-200 dark:bg-white/10 rounded-xl animate-pulse" />
                        </div>
                    </div>
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="p-5 rounded-xl border border-gray-100 dark:border-gov-border/15 bg-gray-50 dark:bg-gov-card/10">
                                    <div className="h-5 w-16 bg-gray-200 dark:bg-white/10 rounded-full animate-pulse mb-3" />
                                    <div className="h-5 w-3/4 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse mb-2" />
                                    <div className="h-4 w-full bg-gray-200 dark:bg-white/5 rounded-lg animate-pulse" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Sub-Directorates Section Skeleton */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="bg-gradient-to-br from-gov-forest to-gov-emerald dark:from-gov-brand dark:to-gov-forest rounded-2xl shadow-lg overflow-hidden p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-white/10 animate-pulse" />
                            <div className="space-y-2">
                                <div className="h-6 w-40 bg-white/10 rounded-lg animate-pulse" />
                                <div className="h-4 w-24 bg-white/10 rounded-lg animate-pulse" />
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>

            {/* Team & Contact Section Skeleton */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="h-8 w-48 bg-gray-200 dark:bg-white/10 rounded-xl animate-pulse mb-6" />
                        <div className="bg-white dark:bg-dm-surface rounded-2xl shadow-sm border border-gray-100 dark:border-gov-border/15 p-6">
                            <div className="space-y-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 border-b border-gray-100 dark:border-gov-border/15 last:border-0">
                                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-white/10 animate-pulse" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-5 w-32 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse" />
                                            <div className="h-4 w-24 bg-gray-200 dark:bg-white/5 rounded-lg animate-pulse" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-dm-surface rounded-2xl shadow-sm border border-gray-100 dark:border-gov-border/15 p-6">
                            <div className="h-6 w-32 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse mb-6" />
                            <div className="space-y-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-5 h-5 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
                                        <div className="h-4 flex-1 bg-gray-200 dark:bg-white/5 rounded animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gov-forest text-white rounded-2xl shadow-lg p-6">
                            <div className="h-6 w-32 bg-white/10 rounded-lg animate-pulse mb-4" />
                            <div className="space-y-3">
                                <div className="h-4 w-full bg-white/10 rounded animate-pulse" />
                                <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default function DirectorateDetailPage({ params }: { params: { id: string } }) {
    return (
        <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg transition-colors duration-500">
            <Navbar />

            <main className="flex-grow pt-20 md:pt-24 overflow-hidden">
                <DirectorateDetail directorateId={params.id} />
            </main>

            <Footer />
        </div>
    );
}

export { DirectorateSkeleton };
