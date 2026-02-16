'use client';

import React from 'react';
import { Directorate, DirectorateTeam } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import { User, Crown, Briefcase, Users } from 'lucide-react';

interface DirectorateStructureProps {
    team: DirectorateTeam[];
    directorate: Directorate;
}

// A single person card with size/style based on tier
const PersonCard: React.FC<{
    member: DirectorateTeam;
    tier: 'head' | 'deputy' | 'member';
    isAr: boolean;
}> = ({ member, tier, isAr }) => {
    const name = isAr ? member.name_ar : (member.name_en || member.name_ar);
    const position = isAr ? member.position_ar : (member.position_en || member.position_ar);

    const sizeClasses = {
        head: 'w-36 h-36 md:w-44 md:h-44',
        deputy: 'w-24 h-24 md:w-28 md:h-28',
        member: 'w-20 h-20 md:w-24 md:h-24',
    };

    const borderClasses = {
        head: 'border-4 border-gov-gold shadow-xl shadow-gov-gold/20',
        deputy: 'border-[3px] border-gov-gold/60 shadow-lg',
        member: 'border-2 border-gov-charcoal/20 dark:border-white/20 shadow-md',
    };

    const iconSize = { head: 56, deputy: 36, member: 28 };
    const TierIcon = { head: Crown, deputy: Briefcase, member: Users };
    const Icon = TierIcon[tier];

    return (
        <div className="flex flex-col items-center text-center group">
            {/* Tier badge */}
            <div className={`
                mb-2 flex items-center justify-center rounded-full
                ${tier === 'head' ? 'w-8 h-8 bg-gov-gold text-white' : ''}
                ${tier === 'deputy' ? 'w-6 h-6 bg-gov-forest/80 dark:bg-gov-gold/80 text-white' : ''}
                ${tier === 'member' ? 'w-5 h-5 bg-gov-charcoal/30 dark:bg-white/30 text-white' : ''}
            `}>
                <Icon size={tier === 'head' ? 16 : tier === 'deputy' ? 12 : 10} />
            </div>

            {/* Avatar */}
            <div className={`
                ${sizeClasses[tier]} ${borderClasses[tier]}
                rounded-full overflow-hidden bg-gray-100 dark:bg-dm-surface
                flex items-center justify-center relative
                transition-all duration-300 group-hover:scale-105
                ${tier !== 'member' ? 'group-hover:shadow-gov-gold/30 group-hover:shadow-xl' : 'group-hover:border-gov-gold/50'}
            `}>
                {member.image ? (
                    <Image
                        src={member.image}
                        alt={name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <User size={iconSize[tier]} className="text-gray-400" />
                )}
            </div>

            {/* Name */}
            <h4 className={`
                mt-3 font-bold text-gov-forest dark:text-white leading-tight
                ${tier === 'head' ? 'text-lg md:text-xl' : tier === 'deputy' ? 'text-sm md:text-base' : 'text-xs md:text-sm'}
            `}>
                {name}
            </h4>

            {/* Position */}
            <p className={`
                mt-1 font-medium leading-tight
                ${tier === 'head' ? 'text-gov-gold text-sm md:text-base' : ''}
                ${tier === 'deputy' ? 'text-gov-gold/80 text-xs md:text-sm' : ''}
                ${tier === 'member' ? 'text-gov-charcoal/50 dark:text-white/50 text-xs' : ''}
            `}>
                {position}
            </p>
        </div>
    );
};

// Vertical connector line
const VerticalLine: React.FC<{ height?: string; className?: string }> = ({ height = 'h-8', className = '' }) => (
    <div className={`w-0.5 ${height} bg-gradient-to-b from-gov-gold/40 to-gov-charcoal/20 dark:to-white/20 mx-auto ${className}`} />
);

// Horizontal branch line with vertical drops
const HorizontalBranch: React.FC<{ count: number }> = ({ count }) => {
    if (count <= 1) return null;
    return (
        <div className="relative w-full hidden md:block" style={{ height: '2px' }}>
            <div className="absolute top-0 bg-gradient-to-r from-transparent via-gov-gold/30 to-transparent h-0.5"
                style={{ left: `${100 / (count * 2)}%`, right: `${100 / (count * 2)}%` }}
            />
        </div>
    );
};

const DirectorateStructure: React.FC<DirectorateStructureProps> = ({ team, directorate }) => {
    const { t, language } = useLanguage();
    const isAr = language === 'ar';

    if (!team || team.length === 0) return null;

    // Sort by order to ensure correct hierarchy
    const sorted = [...team].sort((a, b) => a.order - b.order);

    // Tier 0: Head (first member)
    const head = sorted[0];

    // Tier 1: Deputies (next members, up to 3 or those with order <= 3)
    // Tier 2: Remaining members
    const remaining = sorted.slice(1);
    let deputies: DirectorateTeam[] = [];
    let members: DirectorateTeam[] = [];

    if (remaining.length <= 4) {
        // Few members: all are direct reports (deputies)
        deputies = remaining;
    } else {
        // Split into deputies (first ~3) and department members
        const deputyCutoff = Math.min(3, Math.ceil(remaining.length / 3));
        deputies = remaining.slice(0, deputyCutoff);
        members = remaining.slice(deputyCutoff);
    }

    return (
        <div className="py-12 bg-white dark:bg-dm-surface rounded-3xl shadow-sm border border-gov-gold/10 overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                {/* Title */}
                <div className="text-center mb-10">
                    <h3 className="text-2xl md:text-3xl font-bold text-gov-forest dark:text-white mb-4 font-display">
                        {t('organizational_structure') || (isAr ? 'الهيكل الإداري' : 'Organizational Structure')}
                    </h3>
                    <div className="w-24 h-1 bg-gov-gold mx-auto rounded-full"></div>
                </div>

                {/* === Org Chart Tree === */}
                <div className="flex flex-col items-center">

                    {/* ── Level 0: Head ── */}
                    <PersonCard member={head} tier="head" isAr={isAr} />

                    {/* Connector from head to deputies */}
                    {deputies.length > 0 && (
                        <>
                            <VerticalLine height="h-10 md:h-12" />

                            {/* ── Level 1: Deputies ── */}
                            <div className="w-full">
                                {/* Horizontal branch line (desktop) */}
                                <HorizontalBranch count={deputies.length} />

                                <div className={`
                                    flex flex-col md:flex-row items-center md:items-start
                                    justify-center gap-6 md:gap-8 lg:gap-12
                                `}>
                                    {deputies.map((deputy) => (
                                        <div key={deputy.id} className="flex flex-col items-center relative">
                                            {/* Vertical drop from horizontal branch (desktop) */}
                                            {deputies.length > 1 && (
                                                <div className="hidden md:block w-0.5 h-6 bg-gov-gold/30 mb-2" />
                                            )}
                                            {/* Mobile: small vertical line before each deputy */}
                                            {deputies.length > 1 && (
                                                <div className="md:hidden w-0.5 h-4 bg-gov-gold/20 mb-2" />
                                            )}
                                            <PersonCard member={deputy} tier="deputy" isAr={isAr} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Connector from deputies to members */}
                    {members.length > 0 && (
                        <>
                            <VerticalLine height="h-8 md:h-10" className="mt-6" />

                            {/* ── Level 2: Department Members ── */}
                            <div className="w-full">
                                <HorizontalBranch count={members.length} />

                                <div className={`
                                    grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5
                                    gap-6 md:gap-8 justify-items-center
                                `}>
                                    {members.map((member) => (
                                        <div key={member.id} className="flex flex-col items-center">
                                            {/* Vertical drop (desktop) */}
                                            <div className="hidden md:block w-0.5 h-5 bg-gov-charcoal/15 dark:bg-white/15 mb-2" />
                                            <PersonCard member={member} tier="member" isAr={isAr} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DirectorateStructure;
