import { trackRealVisit } from '../api/module/web/visitTrack';

const TRACK_DAILY_KEY = 'visit_tracked_daily';

const shouldTrackVisit = (path: string) => {
  if (path.startsWith('/system')) return false;
  if (path === '/login' || path === '/userlogin') return false;
  if (path.startsWith('/assets')) return false;
  return true;
};

const todayKey = () => new Date().toISOString().slice(0, 10);

/** 同一天内只上报一次，跨天再次访问会累加访问次数 */
const hasTrackedToday = () => {
  try {
    return localStorage.getItem(TRACK_DAILY_KEY) === todayKey();
  } catch {
    return false;
  }
};

const markTrackedToday = () => {
  try {
    localStorage.setItem(TRACK_DAILY_KEY, todayKey());
  } catch {
    // ignore
  }
};

const runTrack = (path: string) => {
  if (!shouldTrackVisit(path)) return;
  if (hasTrackedToday()) return;

  trackRealVisit()
    .then((res) => {
      if (res?.success && !res?.skipped) {
        markTrackedToday();
      }
    })
    .catch(() => {
      // 静默失败，不影响页面使用
    });
};

export const setupVisitIdentify = (router: { afterEach: (fn: (to: { path: string }) => void) => void }) => {
  router.afterEach((to) => {
    window.setTimeout(() => runTrack(to.path), 400);
  });

  window.setTimeout(() => runTrack(window.location.pathname), 1000);
};
