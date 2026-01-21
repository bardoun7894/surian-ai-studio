'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  FileText,
  Settings,
  Shield,
  Bell,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { AdminRoute } from '@/components/ProtectedRoute';

interface AdminLayoutProps {
  children: React.ReactNode;
}

function AdminLayoutContent({ children }: AdminLayoutProps) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  const navItems = [
    {
      href: '/admin',
      label: { ar: 'لوحة التحكم', en: 'Dashboard' },
      icon: LayoutDashboard,
    },
    {
      href: '/admin/reports',
      label: { ar: 'التقارير والإحصائيات', en: 'Reports & Statistics' },
      icon: BarChart3,
    },
    {
      href: '/admin/users',
      label: { ar: 'المستخدمون', en: 'Users' },
      icon: Users,
    },
    {
      href: '/admin/complaints',
      label: { ar: 'الشكاوى', en: 'Complaints' },
      icon: FileText,
    },
    {
      href: '/admin/audit',
      label: { ar: 'سجل التدقيق', en: 'Audit Log' },
      icon: Shield,
    },
    {
      href: '/admin/notifications',
      label: { ar: 'الإشعارات', en: 'Notifications' },
      icon: Bell,
    },
    {
      href: '/admin/settings',
      label: { ar: 'الإعدادات', en: 'Settings' },
      icon: Settings,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gov-charcoal">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 start-0 z-40 bg-white dark:bg-gov-forest border-e border-gray-200 dark:border-gov-gold/10 transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gov-gold/10">
          {!sidebarCollapsed && (
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gov-gold/10 flex items-center justify-center">
                <Shield className="text-gov-gold" size={20} />
              </div>
              <span className="font-bold text-gov-charcoal dark:text-white">
                {language === 'ar' ? 'لوحة الإدارة' : 'Admin Panel'}
              </span>
            </Link>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            {sidebarCollapsed ? (
              <ChevronRight size={18} className="text-gray-500 rtl:rotate-180" />
            ) : (
              <ChevronLeft size={18} className="text-gray-500 rtl:rotate-180" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  active
                    ? 'bg-gov-gold/10 text-gov-gold font-bold'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'
                }`}
                title={sidebarCollapsed ? (language === 'ar' ? item.label.ar : item.label.en) : undefined}
              >
                <Icon size={20} />
                {!sidebarCollapsed && (
                  <span>{language === 'ar' ? item.label.ar : item.label.en}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        {!sidebarCollapsed && user && (
          <div className="absolute bottom-0 start-0 end-0 p-4 border-t border-gray-200 dark:border-gov-gold/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gov-teal/10 flex items-center justify-center">
                <Users size={18} className="text-gov-teal" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gov-charcoal dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'ms-20' : 'ms-64'
        }`}
      >
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminRoute>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminRoute>
  );
}
