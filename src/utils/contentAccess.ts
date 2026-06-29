import type { Router } from 'vue-router';
import type { useUserStore } from '@/store/user';

type PublicFlag = boolean | number | string | null | undefined;

export interface ContentItem {
  ispublic?: PublicFlag;
}

/** ispublic=1/true/'1' 表示免费公开 */
export function isPublicContent(item: ContentItem): boolean {
  const value = item?.ispublic;
  return value === true || value === 1 || value === '1';
}

export function isVipContent(item: ContentItem): boolean {
  return !isPublicContent(item);
}

/** 已登录且签署 VIP 协议 */
export function hasVipMembership(userStore: ReturnType<typeof useUserStore>): boolean {
  return !!userStore.token && !!userStore.userInfo?.signing;
}

export function canAccessContent(
  item: ContentItem,
  userStore: ReturnType<typeof useUserStore>
): boolean {
  return isPublicContent(item) || hasVipMembership(userStore);
}

export function ensureContentAccess(
  item: ContentItem,
  userStore: ReturnType<typeof useUserStore>,
  router: Router,
  contentType: 'video' | 'document'
): boolean {
  if (isPublicContent(item)) {
    return true;
  }

  const label = contentType === 'video' ? 'videos' : 'documents';

  if (!userStore.token) {
    alert(`Please login to access VIP ${label}`);
    router.push('/userlogin');
    return false;
  }

  if (!userStore.userInfo?.signing) {
    alert(`Please become a VIP member to access VIP ${label}`);
    router.push('/vip');
    return false;
  }

  return true;
}
