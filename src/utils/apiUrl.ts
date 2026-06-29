/** 与 http.ts 一致：优先使用 Cloudflare Worker 注入的运行时 API 地址 */
export function getApiUrl(): string {
  if (typeof window !== 'undefined' && (window as any).__ENV__?.VITE_API_URL) {
    return (window as any).__ENV__.VITE_API_URL;
  }
  return import.meta.env.VITE_API_URL || 'https://houduan-api.onrender.com';
}

export function getUploadUrl(path: string): string {
  const base = getApiUrl().replace(/\/$/, '');
  return `${base}/api/upload/${path.replace(/^\//, '')}`;
}

/** 解析 lay-upload @done 回调的响应体 */
export function parseUploadResponse(response: unknown): { success?: boolean; data?: { url?: string; mimeType?: string } } | null {
  if (!response) return null;

  if (typeof response === 'string') {
    try {
      return JSON.parse(response);
    } catch {
      return null;
    }
  }

  const payload = response as Record<string, unknown>;
  if (payload.success !== undefined) {
    return payload as { success?: boolean; data?: { url?: string; mimeType?: string } };
  }

  if (payload.data !== undefined) {
    if (typeof payload.data === 'string') {
      try {
        return JSON.parse(payload.data);
      } catch {
        return null;
      }
    }
    return payload.data as { success?: boolean; data?: { url?: string; mimeType?: string } };
  }

  return null;
}

const VIDEO_EXTENSIONS = new Set(['mp4', 'mov', 'avi', 'mkv', 'webm']);
const DOCUMENT_EXTENSIONS = new Set(['pdf', 'doc', 'docx', 'xls', 'xlsx', 'zip', 'rar']);

export function isAllowedVideoFile(file: File): boolean {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const validTypes = [
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-matroska',
    'video/webm',
    'video/avi',
    'video/mov',
    'video/mkv',
  ];
  if (validTypes.includes(file.type)) return true;
  return !file.type && VIDEO_EXTENSIONS.has(ext);
}

export function isAllowedDocumentFile(file: File): boolean {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const validTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip',
    'application/x-zip-compressed',
    'application/x-rar-compressed',
    'application/vnd.rar',
    'application/octet-stream',
  ];
  if (validTypes.includes(file.type)) return true;
  return DOCUMENT_EXTENSIONS.has(ext);
}
