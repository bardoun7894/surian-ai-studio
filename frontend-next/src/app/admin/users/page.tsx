'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Edit,
  Power,
  PowerOff,
  Loader2,
  CheckCircle,
  XCircle,
  Eye,
  X,
  Save
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { API } from '@/lib/repository';
import { User, Role } from '@/types';
import { TableRowSkeleton } from '@/components/Skeleton';
import { SkeletonText } from '@/components/SkeletonLoader';

export default function UsersManagementPage() {
  const { language } = useLanguage();
  const { user: currentUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // State
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<number | ''>('');
  const [statusFilter, setStatusFilter] = useState<boolean | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userStats, setUserStats] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    father_name: '',
    last_name: '',
    email: '',
    phone: '',
    national_id: '',
    birth_date: '',
    governorate: '',
    role_id: '',
    directorate_id: ''
  });
  const [formErrors, setFormErrors] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (!currentUser?.role?.name?.includes('admin')) {
        router.push('/admin');
      }
    }
  }, [authLoading, isAuthenticated, currentUser, router]);

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await API.roles.getAll();
        setRoles(rolesData);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };
    fetchRoles();
  }, []);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const params: any = {
          page: currentPage,
          per_page: 15
        };
        if (searchTerm) params.search = searchTerm;
        if (roleFilter !== '') params.role_id = roleFilter;
        if (statusFilter !== '') params.is_active = statusFilter;

        const response = await API.users.getAll(params);
        setUsers(response.data || []);
        setTotalPages(response.last_page || 1);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated, currentPage, searchTerm, roleFilter, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setIsSaving(true);

    try {
      const result = await API.users.create({
        first_name: formData.first_name,
        father_name: formData.father_name,
        last_name: formData.last_name,
        email: formData.email,
        role_id: Number(formData.role_id),
        directorate_id: formData.directorate_id || undefined
      });

      // Show temp password to admin
      alert(
        language === 'ar'
          ? `تم إنشاء المستخدم بنجاح!\n\nكلمة المرور المؤقتة: ${result.temp_password}\n\nيرجى حفظها وإعطاؤها للمستخدم.`
          : `User created successfully!\n\nTemporary password: ${result.temp_password}\n\nPlease save it and give it to the user.`
      );

      setShowCreateModal(false);
      setFormData({ first_name: '', father_name: '', last_name: '', email: '', phone: '', national_id: '', birth_date: '', governorate: '', role_id: '', directorate_id: '' });
      setCurrentPage(1);

      // Refresh users list
      const response = await API.users.getAll({ page: 1, per_page: 15 });
      setUsers(response.data || []);
    } catch (error: any) {
      setFormErrors({ general: error.message || 'Failed to create user' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setFormErrors({});
    setIsSaving(true);

    try {
      await API.users.update(selectedUser.id, {
        first_name: formData.first_name,
        father_name: formData.father_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        national_id: formData.national_id || undefined,
        birth_date: formData.birth_date || undefined,
        governorate: formData.governorate || undefined,
        role_id: Number(formData.role_id),
        directorate_id: formData.directorate_id || undefined
      });

      setShowEditModal(false);
      setSelectedUser(null);
      setFormData({ first_name: '', father_name: '', last_name: '', email: '', phone: '', national_id: '', birth_date: '', governorate: '', role_id: '', directorate_id: '' });

      // Refresh users list
      const response = await API.users.getAll({
        page: currentPage,
        per_page: 15,
        ...(searchTerm && { search: searchTerm }),
        ...(roleFilter !== '' && { role_id: roleFilter }),
        ...(statusFilter !== '' && { is_active: statusFilter })
      });
      setUsers(response.data || []);
    } catch (error: any) {
      setFormErrors({ general: error.message || 'Failed to update user' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (userId: number) => {
    if (userId === currentUser?.id) {
      alert(language === 'ar' ? 'لا يمكنك تعطيل حسابك الخاص' : 'Cannot disable your own account');
      return;
    }

    try {
      await API.users.toggleStatus(userId);

      // Refresh users list
      const response = await API.users.getAll({
        page: currentPage,
        per_page: 15,
        ...(searchTerm && { search: searchTerm }),
        ...(roleFilter !== '' && { role_id: roleFilter }),
        ...(statusFilter !== '' && { is_active: statusFilter })
      });
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const handleViewUser = async (user: User) => {
    setSelectedUser(user);
    setShowViewModal(true);

    try {
      const data = await API.users.getById(user.id);
      if (data) {
        setUserStats(data.statistics);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      first_name: user.first_name,
      father_name: user.father_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone || '',
      national_id: user.national_id || '',
      birth_date: user.birth_date || '',
      governorate: user.governorate || '',
      role_id: user.role_id?.toString() || '',
      directorate_id: user.directorate_id || ''
    });
    setShowEditModal(true);
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gov-beige dark:bg-dm-bg">
        <Loader2 className="animate-spin text-gov-gold" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg transition-colors">
      <Navbar onSearch={(q) => window.location.href = `/search?q=${encodeURIComponent(q)}`} />

      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-gov-charcoal dark:text-white mb-2">
                {language === 'ar' ? 'إدارة المستخدمين' : 'User Management'}
              </h1>
              <p className="text-gray-500 dark:text-white/70">
                {language === 'ar'
                  ? 'إدارة حسابات المستخدمين والصلاحيات'
                  : 'Manage user accounts and permissions'}
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gov-teal text-white font-bold rounded-2xl hover:bg-gov-emerald transition-all shadow-lg"
            >
              <UserPlus size={20} />
              {language === 'ar' ? 'إضافة مستخدم' : 'Add User'}
            </button>
          </div>

          {/* Filters */}
          <div className="mb-6 bg-white dark:bg-gov-card/10 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gov-border/15">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={language === 'ar' ? 'البحث عن مستخدم...' : 'Search users...'}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
                  />
                </div>
              </form>

              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => { setRoleFilter(e.target.value === '' ? '' : Number(e.target.value)); setCurrentPage(1); }}
                className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
              >
                <option value="">{language === 'ar' ? 'كل الأدوار' : 'All Roles'}</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>
                    {language === 'ar' ? role.label : role.name}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter === '' ? '' : statusFilter.toString()}
                onChange={(e) => { setStatusFilter(e.target.value === '' ? '' : e.target.value === 'true'); setCurrentPage(1); }}
                className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
              >
                <option value="">{language === 'ar' ? 'كل الحالات' : 'All Status'}</option>
                <option value="true">{language === 'ar' ? 'نشط' : 'Active'}</option>
                <option value="false">{language === 'ar' ? 'معطل' : 'Inactive'}</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white dark:bg-gov-card/10 rounded-3xl shadow-xl border border-gray-100 dark:border-gov-border/15 overflow-hidden">
            {isLoading ? (
              <div className="p-6">
                {/* Header Skeleton */}
                <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gov-border/15 mb-4">
                  <div className="w-[20%]"><SkeletonText lines={1} /></div>
                  <div className="w-[25%]"><SkeletonText lines={1} /></div>
                  <div className="w-[15%]"><SkeletonText lines={1} /></div>
                  <div className="w-[15%]"><SkeletonText lines={1} /></div>
                  <div className="w-[15%]"><SkeletonText lines={1} /></div>
                  <div className="w-[10%]"><SkeletonText lines={1} /></div>
                </div>
                {/* Table Rows Skeleton */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <TableRowSkeleton key={i} />
                ))}
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-white/70">
                {language === 'ar' ? 'لا توجد مستخدمين' : 'No users found'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gov-card/10">
                    <tr>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gov-charcoal dark:text-white">
                        {language === 'ar' ? 'الاسم' : 'Name'}
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gov-charcoal dark:text-white">
                        {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gov-charcoal dark:text-white">
                        {language === 'ar' ? 'الدور' : 'Role'}
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gov-charcoal dark:text-white">
                        {language === 'ar' ? 'الحالة' : 'Status'}
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gov-charcoal dark:text-white">
                        {language === 'ar' ? 'تاريخ التسجيل' : 'Registered'}
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gov-charcoal dark:text-white">
                        {language === 'ar' ? 'الإجراءات' : 'Actions'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-gov-charcoal dark:text-white">
                          {user.full_name}
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-white/70">
                          {user.email}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-3 py-1 rounded-full text-sm font-bold bg-gov-teal/10 text-gov-teal">
                            {language === 'ar' ? user.role?.label : user.role?.name}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {user.is_active ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                              <CheckCircle size={14} />
                              {language === 'ar' ? 'نشط' : 'Active'}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                              <XCircle size={14} />
                              {language === 'ar' ? 'معطل' : 'Inactive'}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-white/70 text-sm">
                          {new Date(user.created_at).toLocaleDateString(language === 'ar' ? 'ar-SY-u-nu-latn' : 'en-US')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewUser(user)}
                              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-white/70 transition-colors"
                              title={language === 'ar' ? 'عرض' : 'View'}
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleEditUser(user)}
                              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gov-teal transition-colors"
                              title={language === 'ar' ? 'تعديل' : 'Edit'}
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(user.id)}
                              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors ${
                                user.is_active ? 'text-red-600' : 'text-green-600'
                              }`}
                              title={language === 'ar' ? (user.is_active ? 'تعطيل' : 'تفعيل') : (user.is_active ? 'Deactivate' : 'Activate')}
                            >
                              {user.is_active ? <PowerOff size={18} /> : <Power size={18} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 p-6 border-t border-gray-200 dark:border-gov-border/15">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gov-card/10 text-gov-charcoal dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                >
                  {language === 'ar' ? 'السابق' : 'Previous'}
                </button>
                <span className="px-4 py-2 text-gov-charcoal dark:text-white">
                  {language === 'ar' ? `صفحة ${currentPage} من ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gov-card/10 text-gov-charcoal dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                >
                  {language === 'ar' ? 'التالي' : 'Next'}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dm-surface rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gov-charcoal dark:text-white">
                {language === 'ar' ? 'إضافة مستخدم جديد' : 'Add New User'}
              </h2>
              <button
                onClick={() => { setShowCreateModal(false); setFormData({ first_name: '', father_name: '', last_name: '', email: '', phone: '', national_id: '', birth_date: '', governorate: '', role_id: '', directorate_id: '' }); setFormErrors({}); }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              {formErrors.general && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
                  {formErrors.general}
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                    {language === 'ar' ? 'الاسم الأول' : 'First Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                    {language === 'ar' ? 'اسم الأب' : 'Father Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.father_name}
                    onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                    {language === 'ar' ? 'الكنية' : 'Last Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email'} *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                  {language === 'ar' ? 'الدور' : 'Role'} *
                </label>
                <select
                  required
                  value={formData.role_id}
                  onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
                >
                  <option value="">{language === 'ar' ? 'اختر الدور' : 'Select Role'}</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {language === 'ar' ? role.label : role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowCreateModal(false); setFormData({ first_name: '', father_name: '', last_name: '', email: '', phone: '', national_id: '', birth_date: '', governorate: '', role_id: '', directorate_id: '' }); setFormErrors({}); }}
                  className="flex-1 px-6 py-3 bg-gray-200 dark:bg-white/10 text-gov-charcoal dark:text-white font-bold rounded-xl hover:bg-gray-300 dark:hover:bg-white/20 transition-all"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-6 py-3 bg-gov-teal text-white font-bold rounded-xl hover:bg-gov-emerald transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      {language === 'ar' ? 'إنشاء المستخدم' : 'Create User'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dm-surface rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gov-charcoal dark:text-white">
                {language === 'ar' ? 'تعديل المستخدم' : 'Edit User'}
              </h2>
              <button
                onClick={() => { setShowEditModal(false); setSelectedUser(null); setFormData({ first_name: '', father_name: '', last_name: '', email: '', phone: '', national_id: '', birth_date: '', governorate: '', role_id: '', directorate_id: '' }); setFormErrors({}); }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-4">
              {formErrors.general && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
                  {formErrors.general}
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                    {language === 'ar' ? 'الاسم الأول' : 'First Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                    {language === 'ar' ? 'اسم الأب' : 'Father Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.father_name}
                    onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                    {language === 'ar' ? 'الكنية' : 'Last Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email'} *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                  {language === 'ar' ? 'رقم الهاتف' : 'Phone'}
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                  {language === 'ar' ? 'الرقم الوطني' : 'National ID'}
                </label>
                <input
                  type="text"
                  value={formData.national_id}
                  onChange={(e) => setFormData({ ...formData, national_id: e.target.value.replace(/\D/g, '') })}
                  maxLength={11}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                    {language === 'ar' ? 'تاريخ الميلاد' : 'Date of Birth'}
                  </label>
                  <input
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                    {language === 'ar' ? 'المحافظة' : 'Governorate'}
                  </label>
                  <input
                    type="text"
                    value={formData.governorate}
                    onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                  {language === 'ar' ? 'الدور' : 'Role'} *
                </label>
                <select
                  required
                  value={formData.role_id}
                  onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
                >
                  <option value="">{language === 'ar' ? 'اختر الدور' : 'Select Role'}</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {language === 'ar' ? role.label : role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setSelectedUser(null); setFormData({ first_name: '', father_name: '', last_name: '', email: '', phone: '', national_id: '', birth_date: '', governorate: '', role_id: '', directorate_id: '' }); setFormErrors({}); }}
                  className="flex-1 px-6 py-3 bg-gray-200 dark:bg-white/10 text-gov-charcoal dark:text-white font-bold rounded-xl hover:bg-gray-300 dark:hover:bg-white/20 transition-all"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-6 py-3 bg-gov-teal text-white font-bold rounded-xl hover:bg-gov-emerald transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dm-surface rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gov-charcoal dark:text-white">
                {language === 'ar' ? 'تفاصيل المستخدم' : 'User Details'}
              </h2>
              <button
                onClick={() => { setShowViewModal(false); setSelectedUser(null); setUserStats(null); }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-500 dark:text-white/70 mb-1">
                    {language === 'ar' ? 'الاسم' : 'Name'}
                  </label>
                  <p className="text-gov-charcoal dark:text-white font-bold">{selectedUser.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 dark:text-white/70 mb-1">
                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                  </label>
                  <p className="text-gov-charcoal dark:text-white font-bold">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 dark:text-white/70 mb-1">
                    {language === 'ar' ? 'الدور' : 'Role'}
                  </label>
                  <p className="text-gov-charcoal dark:text-white font-bold">
                    {language === 'ar' ? selectedUser.role?.label : selectedUser.role?.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 dark:text-white/70 mb-1">
                    {language === 'ar' ? 'الحالة' : 'Status'}
                  </label>
                  <p className={`font-bold ${selectedUser.is_active ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedUser.is_active ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'معطل' : 'Inactive')}
                  </p>
                </div>
                {selectedUser.phone && (
                  <div>
                    <label className="block text-sm font-bold text-gray-500 dark:text-white/70 mb-1">
                      {language === 'ar' ? 'رقم الهاتف' : 'Phone'}
                    </label>
                    <p className="text-gov-charcoal dark:text-white font-bold">{selectedUser.phone}</p>
                  </div>
                )}
                {selectedUser.national_id && (
                  <div>
                    <label className="block text-sm font-bold text-gray-500 dark:text-white/70 mb-1">
                      {language === 'ar' ? 'الرقم الوطني' : 'National ID'}
                    </label>
                    <p className="text-gov-charcoal dark:text-white font-bold font-mono">{selectedUser.national_id}</p>
                  </div>
                )}
                {selectedUser.birth_date && (
                  <div>
                    <label className="block text-sm font-bold text-gray-500 dark:text-white/70 mb-1">
                      {language === 'ar' ? 'تاريخ الميلاد' : 'Date of Birth'}
                    </label>
                    <p className="text-gov-charcoal dark:text-white font-bold">
                      {new Date(selectedUser.birth_date).toLocaleDateString(language === 'ar' ? 'ar-SY-u-nu-latn' : 'en-US')}
                    </p>
                  </div>
                )}
                {selectedUser.governorate && (
                  <div>
                    <label className="block text-sm font-bold text-gray-500 dark:text-white/70 mb-1">
                      {language === 'ar' ? 'المحافظة' : 'Governorate'}
                    </label>
                    <p className="text-gov-charcoal dark:text-white font-bold">{selectedUser.governorate}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-gray-500 dark:text-white/70 mb-1">
                    {language === 'ar' ? 'تاريخ التسجيل' : 'Registration Date'}
                  </label>
                  <p className="text-gov-charcoal dark:text-white font-bold">
                    {new Date(selectedUser.created_at).toLocaleDateString(language === 'ar' ? 'ar-SY-u-nu-latn' : 'en-US')}
                  </p>
                </div>
              </div>

              {userStats && (
                <div className="pt-6 border-t border-gray-200 dark:border-gov-border/15">
                  <h3 className="text-lg font-bold text-gov-charcoal dark:text-white mb-4">
                    {language === 'ar' ? 'الإحصائيات' : 'Statistics'}
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gov-teal/10 dark:bg-gov-teal/20 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-gov-teal">{userStats.complaints_count || 0}</p>
                      <p className="text-sm text-gray-600 dark:text-white/70">
                        {language === 'ar' ? 'الشكاوى' : 'Complaints'}
                      </p>
                    </div>
                    <div className="bg-gov-gold/10 dark:bg-gov-gold/20 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-gov-gold">{userStats.suggestions_count || 0}</p>
                      <p className="text-sm text-gray-600 dark:text-white/70">
                        {language === 'ar' ? 'المقترحات' : 'Suggestions'}
                      </p>
                    </div>
                    <div className="bg-gov-emerald/10 dark:bg-gov-emerald/20 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-gov-emerald">{userStats.account_age_days || 0}</p>
                      <p className="text-sm text-gray-600 dark:text-white/70">
                        {language === 'ar' ? 'يوم' : 'Days'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer
        onIncreaseFont={() => {}}
        onDecreaseFont={() => {}}
        onToggleContrast={() => {}}
      />
    </div>
  );
}
