import Http from '../../http';
import { useUserStore } from '../../../store/user';

const buildClientBeacon = () => ({
  client_verified: true,
  path: window.location.pathname,
  visit_host: window.location.host,
  visit_url: window.location.href,
  user_agent: navigator.userAgent,
  screen_width: window.screen?.width || 0,
  screen_height: window.screen?.height || 0,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
  language: navigator.language || '',
});

const shouldUseBeaconProxy = () => {
  const host = window.location.hostname;
  if (import.meta.env.DEV || host === 'localhost' || host === '127.0.0.1') return false;
  if (host.endsWith('.workers.dev')) return false;
  return true;
};

/** 浏览器端上报真实用户访问（须能执行 JS，爬虫无法模拟） */
export const trackRealVisit = async () => {
  const payload = buildClientBeacon();

  if (shouldUseBeaconProxy()) {
    const userStore = useUserStore();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (userStore.token) headers['session-token'] = String(userStore.token);

    const response = await fetch(`${window.location.origin}/api/visit-beacon`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    return response.json();
  }

  return Http.post('/web/track-visit', payload);
};

/** @deprecated 请使用 trackRealVisit */
export const identifyVisitUser = () => trackRealVisit();
