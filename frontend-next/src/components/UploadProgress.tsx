import React from 'react';
import { FileIcon, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface UploadProgressProps {
  fileName: string;
  progress: number; // 0 to 100
  status: 'uploading' | 'completed' | 'error';
  fileSize?: string;
  onCancel?: () => void;
  error?: string;
}

const UploadProgress: React.FC<UploadProgressProps> = ({
  fileName,
  progress,
  status,
  fileSize,
  onCancel,
  error
}) => {
  return (
    <div className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-3 mb-3">
      <div className="flex items-center gap-3 mb-2">
        {/* Icon based on status */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${status === 'completed' ? 'bg-gov-emerald/10 text-gov-emerald' :
            status === 'error' ? 'bg-gov-cherry/10 text-gov-cherry' :
              'bg-gov-teal/10 text-gov-teal'
          }`}>
          {status === 'completed' ? <CheckCircle size={20} /> :
            status === 'error' ? <AlertCircle size={20} /> :
              <FileIcon size={20} />}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-0.5">
            <span className="text-sm font-bold text-gov-charcoal dark:text-white truncate" title={fileName}>
              {fileName}
            </span>
            {status === 'uploading' && (
              <span className="text-xs font-bold text-gov-teal">{Math.round(progress)}%</span>
            )}
          </div>

          {/* Status Text / Size */}
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>{fileSize}</span>
            {status === 'uploading' && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span>جاري الرفع...</span>
              </>
            )}
            {status === 'completed' && <span className="text-gov-emerald">تم الرفع بنجاح</span>}
            {status === 'error' && <span className="text-gov-cherry">{error || 'فشل الرفع'}</span>}
          </div>
        </div>

        {/* Cancel Button (only when uploading) */}
        {status === 'uploading' && onCancel && (
          <button
            onClick={onCancel}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 hover:text-gov-cherry transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {status === 'uploading' && (
        <div className="h-1.5 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gov-teal transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default UploadProgress;
