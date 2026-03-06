import React from 'react';
import { FileIcon, FileText, FileImage, X, CheckCircle, AlertCircle, Upload } from 'lucide-react';

interface UploadProgressProps {
  fileName: string;
  progress: number; // 0 to 100
  status: 'ready' | 'uploading' | 'completed' | 'error';
  fileSize?: string;
  onCancel?: () => void;
  error?: string;
  language?: 'ar' | 'en';
}

function getFileIcon(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) return FileImage;
  if (['pdf', 'doc', 'docx', 'txt'].includes(ext || '')) return FileText;
  return FileIcon;
}

const UploadProgress: React.FC<UploadProgressProps> = ({
  fileName,
  progress,
  status,
  fileSize,
  onCancel,
  error,
  language = 'ar'
}) => {
  const isAr = language === 'ar';
  const Icon = status === 'completed' ? CheckCircle : status === 'error' ? AlertCircle : status === 'ready' ? getFileIcon(fileName) : getFileIcon(fileName);
  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div className={`w-full rounded-xl p-3 mb-2 transition-all duration-300 ${
      status === 'completed'
        ? 'bg-gov-emerald/5 dark:bg-gov-emerald/10 border border-gov-emerald/20'
        : status === 'error'
          ? 'bg-gov-cherry/5 dark:bg-gov-cherry/10 border border-gov-cherry/20'
          : status === 'ready'
            ? 'bg-gov-teal/5 dark:bg-gov-teal/10 border border-gov-teal/20'
            : 'bg-gray-50 dark:bg-gov-card/10 border border-gray-100 dark:border-gov-border/15'
    }`}>
      <div className="flex items-center gap-3">
        {/* Status Icon */}
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
          status === 'completed' ? 'bg-gov-emerald/10 text-gov-emerald' :
          status === 'error' ? 'bg-gov-cherry/10 text-gov-cherry' :
          status === 'ready' ? 'bg-gov-teal/10 text-gov-teal' :
          'bg-gov-teal/10 text-gov-teal'
        }`}>
          {status === 'uploading' ? (
            <Upload size={18} className="animate-bounce" />
          ) : status === 'ready' ? (
            <CheckCircle size={18} className="text-gov-teal" />
          ) : (
            <Icon size={18} />
          )}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-0.5">
            <span className="text-sm font-bold text-gov-charcoal dark:text-white truncate max-w-[200px]" title={fileName}>
              {fileName}
            </span>
            {status === 'uploading' && (
              <span className="text-xs font-bold text-gov-teal tabular-nums">{clampedProgress}%</span>
            )}
          </div>

          {/* Status Text */}
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-white/60">
            {fileSize && <span>{fileSize}</span>}
            {status === 'ready' && (
              <>
                <span className="w-1 h-1 rounded-full bg-gov-teal/40"></span>
                <span className="text-gov-teal font-bold">{isAr ? 'تم الإرفاق' : 'Attached'}</span>
              </>
            )}
            {status === 'uploading' && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/30"></span>
                <span className="text-gov-teal">{isAr ? 'جاري الرفع...' : 'Uploading...'}</span>
              </>
            )}
            {status === 'completed' && (
              <span className="text-gov-emerald font-bold">{isAr ? 'تم الرفع بنجاح' : 'Upload complete'}</span>
            )}
            {status === 'error' && (
              <span className="text-gov-cherry font-bold">{error || (isAr ? 'فشل الرفع' : 'Upload failed')}</span>
            )}
          </div>
        </div>

        {/* Cancel / Remove Button */}
        {(status === 'uploading' || status === 'completed' || status === 'ready') && onCancel && (
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 hover:text-gov-cherry transition-colors"
            title={isAr ? (status === 'uploading' ? 'إلغاء' : 'حذف') : (status === 'uploading' ? 'Cancel' : 'Remove')}
          >
            <X size={16} />
          </button>
        )}

        {/* Completed Check (only when no cancel handler) */}
        {status === 'completed' && !onCancel && (
          <CheckCircle size={18} className="text-gov-emerald shrink-0" />
        )}
      </div>

      {/* Progress Bar */}
      {status === 'uploading' && (
        <div className="mt-2 h-1.5 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gov-teal to-gov-gold transition-all duration-500 ease-out relative"
            style={{ width: `${clampedProgress}%` }}
          >
            {/* Animated shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_1.5s_infinite]" />
          </div>
        </div>
      )}

      {/* Completed bar (full green) */}
      {status === 'completed' && (
        <div className="mt-2 h-1.5 w-full rounded-full overflow-hidden">
          <div className="h-full w-full rounded-full bg-gov-emerald/40 transition-all duration-500" />
        </div>
      )}
    </div>
  );
};

/** Multi-file progress wrapper */
export interface MultiUploadProgressProps {
  files: File[];
  progress: number;         // overall progress 0-100
  isUploading: boolean;
  isSubmitting: boolean;
  language?: 'ar' | 'en';
  label?: string;
}

export const MultiUploadProgress: React.FC<MultiUploadProgressProps> = ({
  files,
  progress,
  isUploading,
  isSubmitting,
  language = 'ar',
}) => {
  const isAr = language === 'ar';
  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)));
  const show = (isUploading || isSubmitting) && clampedProgress > 0;

  if (!show) return null;

  const statusLabel = isUploading
    ? (isAr ? 'جاري رفع الملفات...' : 'Uploading files...')
    : (isAr ? 'جاري الإرسال...' : 'Sending...');

  const barColor = isUploading
    ? 'bg-gradient-to-r from-gov-teal to-gov-gold'
    : 'bg-gradient-to-r from-gov-gold to-gov-forest';

  return (
    <div className="mt-3 bg-gray-50 dark:bg-gov-card/10 border border-gray-100 dark:border-gov-border/15 rounded-xl p-3 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Upload size={14} className="text-gov-teal animate-bounce" />
          <span className="text-xs font-bold text-gov-charcoal dark:text-white">{statusLabel}</span>
        </div>
        <span className="text-xs font-bold text-gov-teal tabular-nums">{clampedProgress}%</span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-500 ease-out relative`}
          style={{ width: `${clampedProgress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_1.5s_infinite]" />
        </div>
      </div>

      {/* File count */}
      {files.length > 0 && (
        <p className="mt-1.5 text-xs text-gray-400 dark:text-white/40">
          {isAr ? `${files.length} ملف${files.length > 1 ? 'ات' : ''}` : `${files.length} file${files.length > 1 ? 's' : ''}`}
          {' · '}
          {(files.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024).toFixed(2)} MB
        </p>
      )}
    </div>
  );
};

export default UploadProgress;
