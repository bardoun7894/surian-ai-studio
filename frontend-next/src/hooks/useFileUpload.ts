import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { getCsrfCookie } from '@/lib/api';

export type UploadStatus = 'idle' | 'ready' | 'uploading' | 'completed' | 'error';

/** Per-file upload state for immediate staging uploads (M1-T3). */
export interface StagedFile {
    file: File;
    /** Server-returned UUID after successful upload */
    serverId: string | null;
    status: UploadStatus;
    progress: number;
    error?: string;
}

export interface RejectedFile {
    name: string;
    size: number;
    reason: string;
}

interface UseFileUploadOptions {
    maxFiles?: number;
    maxSizeMB?: number;
    isAr?: boolean;
    /**
     * M1-T3: When provided, files are uploaded immediately on selection
     * to this endpoint (e.g. '/api/v1/attachments/stage').
     * The response must contain { id, file_name, size, mime_type }.
     */
    stagingEndpoint?: string;
    /** Required when stagingEndpoint is set. Context string sent to the backend. */
    stagingContext?: 'complaint' | 'suggestion';
}

const ALLOWED_EXTENSIONS = new Set(['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png']);

const ALLOWED_MIME_TYPES = new Set([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
]);

/** Generate a cryptographically random 64-char hex token for session binding. */
function generateSessionToken(): string {
    const arr = new Uint8Array(32);
    crypto.getRandomValues(arr);
    return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
}

// Read XSRF-TOKEN from cookies for XHR requests
function getXsrfToken(): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
    const {
        maxFiles = 5,
        maxSizeMB = 5,
        isAr = true,
        stagingEndpoint,
        stagingContext = 'complaint',
    } = options;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    const [files, setFiles] = useState<File[]>([]);
    const [rejectedFiles, setRejectedFiles] = useState<RejectedFile[]>([]);
    const [fileUploadStatus, setFileUploadStatus] = useState<UploadStatus>('idle');
    const [fileUploadProgress, setFileUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // M1-T3: Per-file staged upload tracking
    const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
    const sessionTokenRef = useRef<string>(generateSessionToken());
    // Track active XHR requests for cancellation
    const activeXhrsRef = useRef<Map<string, XMLHttpRequest>>(new Map());

    /** Returns the session token for this upload session (needed by form submission). */
    const getSessionToken = useCallback(() => sessionTokenRef.current, []);

    /** Returns server IDs of all successfully staged files. */
    const getStagedFileIds = useCallback(() => {
        return stagedFiles
            .filter(sf => sf.serverId !== null)
            .map(sf => sf.serverId as string);
    }, [stagedFiles]);

    /**
     * M1-T3: Upload a single file to the staging endpoint immediately.
     * Uses XHR for real progress tracking.
     */
    const uploadFileToStaging = useCallback(async (file: File, index: number) => {
        if (!stagingEndpoint) return;

        // Fetch CSRF cookie before uploading
        await getCsrfCookie();

        const formData = new FormData();
        formData.append('file', file);
        formData.append('context', stagingContext);
        formData.append('session_token', sessionTokenRef.current);

        return new Promise<string | null>((resolve) => {
            const xhr = new XMLHttpRequest();
            // Track this XHR so we can cancel if the file is removed
            activeXhrsRef.current.set(file.name, xhr);

            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const progress = Math.round((event.loaded / event.total) * 100);
                    setStagedFiles(prev => prev.map((sf, i) =>
                        i === index ? { ...sf, progress, status: 'uploading' as UploadStatus } : sf
                    ));
                }
            });

            xhr.addEventListener('load', () => {
                activeXhrsRef.current.delete(file.name);
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const result = JSON.parse(xhr.responseText);
                        setStagedFiles(prev => prev.map((sf, i) =>
                            i === index ? { ...sf, serverId: result.id, status: 'completed' as UploadStatus, progress: 100 } : sf
                        ));
                        resolve(result.id);
                    } catch {
                        setStagedFiles(prev => prev.map((sf, i) =>
                            i === index ? { ...sf, status: 'error' as UploadStatus, error: 'Invalid response' } : sf
                        ));
                        resolve(null);
                    }
                } else {
                    let errorMsg = isAr ? 'فشل رفع الملف' : 'Upload failed';
                    try {
                        const err = JSON.parse(xhr.responseText);
                        errorMsg = err.message || errorMsg;
                    } catch { /* ignore */ }
                    setStagedFiles(prev => prev.map((sf, i) =>
                        i === index ? { ...sf, status: 'error' as UploadStatus, error: errorMsg } : sf
                    ));
                    toast.error(`${file.name}: ${errorMsg}`);
                    resolve(null);
                }
            });

            xhr.addEventListener('error', () => {
                activeXhrsRef.current.delete(file.name);
                const errorMsg = isAr ? 'خطأ في الاتصال' : 'Connection error';
                setStagedFiles(prev => prev.map((sf, i) =>
                    i === index ? { ...sf, status: 'error' as UploadStatus, error: errorMsg } : sf
                ));
                toast.error(`${file.name}: ${errorMsg}`);
                resolve(null);
            });

            xhr.open('POST', stagingEndpoint);
            // Set XSRF token header for Laravel
            const xsrfToken = getXsrfToken();
            if (xsrfToken) {
                xhr.setRequestHeader('X-XSRF-TOKEN', xsrfToken);
            }
            xhr.withCredentials = true;
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.send(formData);
        });
    }, [stagingEndpoint, stagingContext, isAr]);

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const incoming = event.target.files;
        if (!incoming || incoming.length === 0) return;

        const incomingFiles = Array.from(incoming);

        // Use a synchronous calculation to figure out accepted files
        const currentFiles = files; // read from closure
        const remainingSlots = Math.max(0, maxFiles - currentFiles.length);

        if (remainingSlots === 0) {
            toast.error(isAr
                ? `الحد الأقصى للمرفقات هو ${maxFiles} ملفات`
                : `Maximum ${maxFiles} attachments allowed`);
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        const existingNames = new Set(currentFiles.map(f => f.name.toLowerCase()));
        const accepted: File[] = [];
        const newRejected: RejectedFile[] = [];

        for (const file of incomingFiles) {
            // Duplicate check
            if (existingNames.has(file.name.toLowerCase())) {
                newRejected.push({
                    name: file.name,
                    size: file.size,
                    reason: isAr ? 'الملف مرفق مسبقاً' : 'File already attached',
                });
                continue;
            }

            // Extension check
            const ext = file.name.includes('.')
                ? file.name.split('.').pop()?.toLowerCase() || ''
                : '';
            if (!ALLOWED_EXTENSIONS.has(ext)) {
                newRejected.push({
                    name: file.name,
                    size: file.size,
                    reason: isAr ? 'صيغة ملف غير مدعومة' : 'Unsupported file type',
                });
                continue;
            }

            // MIME type check (client-side)
            if (file.type && !ALLOWED_MIME_TYPES.has(file.type)) {
                newRejected.push({
                    name: file.name,
                    size: file.size,
                    reason: isAr
                        ? 'نوع الملف لا يتطابق مع المحتوى'
                        : 'File MIME type does not match expected type',
                });
                continue;
            }

            // Size check
            if (file.size > maxSizeBytes) {
                newRejected.push({
                    name: file.name,
                    size: file.size,
                    reason: isAr
                        ? `حجم الملف يتجاوز ${maxSizeMB} MB`
                        : `File exceeds ${maxSizeMB} MB limit`,
                });
                continue;
            }

            accepted.push(file);
            existingNames.add(file.name.toLowerCase());
        }

        const filesToAdd = accepted.slice(0, remainingSlots);
        const rejectedByCount = accepted.slice(remainingSlots);

        if (rejectedByCount.length > 0) {
            for (const file of rejectedByCount) {
                newRejected.push({
                    name: file.name,
                    size: file.size,
                    reason: isAr
                        ? `تجاوزت الحد الأقصى (${maxFiles} ملفات)`
                        : `Exceeded attachment limit (${maxFiles} files)`,
                });
            }
        }

        if (newRejected.length > 0) {
            setRejectedFiles(r => [...r, ...newRejected]);

            // Show grouped toast messages
            const typeRejects = newRejected.filter(r => r.reason.includes('غير مدعوم') || r.reason.includes('Unsupported') || r.reason.includes('MIME'));
            const sizeRejects = newRejected.filter(r => r.reason.includes('يتجاوز') || r.reason.includes('exceeds'));
            const countRejects = newRejected.filter(r => r.reason.includes('الحد الأقصى') || r.reason.includes('limit'));
            const dupeRejects = newRejected.filter(r => r.reason.includes('مسبقاً') || r.reason.includes('already'));

            if (typeRejects.length > 0) {
                toast.error(isAr
                    ? `${typeRejects.length} ملف بصيغة غير مدعومة. الصيغ المسموحة: PDF, DOC, DOCX, JPG, PNG`
                    : `${typeRejects.length} file(s) rejected: unsupported type. Allowed: PDF, DOC, DOCX, JPG, PNG`);
            }
            if (sizeRejects.length > 0) {
                toast.error(isAr
                    ? `${sizeRejects.length} ملف يتجاوز ${maxSizeMB} MB`
                    : `${sizeRejects.length} file(s) exceed ${maxSizeMB} MB limit`);
            }
            if (countRejects.length > 0) {
                toast.error(isAr
                    ? `تم تجاوز الحد الأقصى. يمكنك إرفاق ${maxFiles} ملفات فقط`
                    : `Attachment limit reached. You can upload up to ${maxFiles} files`);
            }
            if (dupeRejects.length > 0) {
                toast.error(isAr
                    ? `${dupeRejects.length} ملف مرفق مسبقاً`
                    : `${dupeRejects.length} file(s) already attached`);
            }
        }

        if (fileInputRef.current) fileInputRef.current.value = '';

        if (filesToAdd.length > 0) {
            // Add files to the list
            setFiles(prev => [...prev, ...filesToAdd]);

            if (stagingEndpoint) {
                // M1-T3: Upload immediately — create staged entries and kick off uploads
                const baseIndex = currentFiles.length; // offset for new files
                const newStaged: StagedFile[] = filesToAdd.map(f => ({
                    file: f,
                    serverId: null,
                    status: 'uploading' as UploadStatus,
                    progress: 0,
                }));
                setStagedFiles(prev => [...prev, ...newStaged]);
                setFileUploadStatus('uploading');

                // Fire uploads in parallel
                filesToAdd.forEach((file, i) => {
                    const stagedIndex = baseIndex + i;
                    uploadFileToStaging(file, stagedIndex);
                });
            } else {
                // Legacy: Go straight to 'ready' — no upload, files sent with form
                setFileUploadStatus('ready');
                setFileUploadProgress(0);
            }
        }
    }, [files, maxFiles, maxSizeBytes, maxSizeMB, isAr, stagingEndpoint, uploadFileToStaging]);

    // M1-T3: Derive overall upload status from individual staged files
    useEffect(() => {
        if (!stagingEndpoint || stagedFiles.length === 0) return;

        const allCompleted = stagedFiles.every(sf => sf.status === 'completed');
        const anyUploading = stagedFiles.some(sf => sf.status === 'uploading');
        const anyError = stagedFiles.some(sf => sf.status === 'error');

        if (allCompleted) {
            setFileUploadStatus('completed');
            setFileUploadProgress(100);
        } else if (anyUploading) {
            setFileUploadStatus('uploading');
            // Average progress across all files
            const totalProgress = stagedFiles.reduce((sum, sf) => sum + sf.progress, 0);
            setFileUploadProgress(Math.round(totalProgress / stagedFiles.length));
        } else if (anyError && !anyUploading) {
            // Some errors but no uploads in flight
            const hasAnySuccess = stagedFiles.some(sf => sf.status === 'completed');
            setFileUploadStatus(hasAnySuccess ? 'completed' : 'error');
        }
    }, [stagedFiles, stagingEndpoint]);

    const removeFile = useCallback((index: number) => {
        setFiles(prev => {
            const newFiles = prev.filter((_, i) => i !== index);
            if (newFiles.length === 0) {
                setFileUploadStatus('idle');
                setFileUploadProgress(0);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
            return newFiles;
        });

        // M1-T3: Also remove from staged files and cancel any in-flight XHR
        if (stagingEndpoint) {
            setStagedFiles(prev => {
                const removing = prev[index];
                if (removing) {
                    // Cancel in-flight upload
                    const xhr = activeXhrsRef.current.get(removing.file.name);
                    if (xhr) {
                        xhr.abort();
                        activeXhrsRef.current.delete(removing.file.name);
                    }
                    // Optionally call DELETE on server to remove staged file
                    if (removing.serverId) {
                        fetch(`${stagingEndpoint}/${removing.serverId}?session_token=${sessionTokenRef.current}`, {
                            method: 'DELETE',
                            credentials: 'include',
                            headers: {
                                'Accept': 'application/json',
                                'X-XSRF-TOKEN': getXsrfToken() || '',
                            },
                        }).catch(() => { /* best-effort cleanup */ });
                    }
                }
                const newStaged = prev.filter((_, i) => i !== index);
                if (newStaged.length === 0) {
                    setFileUploadStatus('idle');
                    setFileUploadProgress(0);
                }
                return newStaged;
            });
        }
    }, [stagingEndpoint]);

    const removeRejectedFile = useCallback((index: number) => {
        setRejectedFiles(prev => prev.filter((_, i) => i !== index));
    }, []);

    const resetFiles = useCallback(() => {
        // Cancel any active uploads
        activeXhrsRef.current.forEach(xhr => xhr.abort());
        activeXhrsRef.current.clear();

        setFiles([]);
        setStagedFiles([]);
        setRejectedFiles([]);
        setFileUploadStatus('idle');
        setFileUploadProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
        // Generate new session token for next upload session
        sessionTokenRef.current = generateSessionToken();
    }, []);

    const setUploadStatus = useCallback((status: UploadStatus) => {
        setFileUploadStatus(status);
    }, []);

    const setUploadProgress = useCallback((progress: number) => {
        setFileUploadProgress(progress);
    }, []);

    return {
        files,
        rejectedFiles,
        fileUploadStatus,
        fileUploadProgress,
        handleFileChange,
        removeFile,
        removeRejectedFile,
        resetFiles,
        fileInputRef,
        setUploadStatus,
        setUploadProgress,
        // M1-T3: Staging upload state
        stagedFiles,
        getStagedFileIds,
        getSessionToken,
    };
}
