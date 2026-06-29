declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          renderButton: (element: HTMLElement, options: Record<string, unknown>) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';
export const DEFAULT_GOOGLE_CLIENT_ID =
  '810723432233-mpgi15h8fvupa2ifqtlmpv5eiih7bvgq.apps.googleusercontent.com';

export const getGoogleClientId = () => {
  const runtimeId =
    typeof window !== 'undefined'
      ? (window as any).__ENV__?.VITE_GOOGLE_CLIENT_ID
      : '';
  const buildId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  return runtimeId || buildId || DEFAULT_GOOGLE_CLIENT_ID;
};

export const hasGoogleLogin = () => !!getGoogleClientId();

let scriptPromise: Promise<void> | null = null;

export const loadGoogleScript = () => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google login is only available in the browser'));
  }

  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${GOOGLE_SCRIPT_SRC}"]`);
      if (existing) {
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', () => reject(new Error('Failed to load Google login script')));
        return;
      }

      const script = document.createElement('script');
      script.src = GOOGLE_SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google login script'));
      document.head.appendChild(script);
    });
  }

  return scriptPromise;
};

export const renderGoogleSignInButton = async (
  container: HTMLElement,
  onCredential: (credential: string) => void
) => {
  const clientId = getGoogleClientId();
  if (!clientId) {
    container.innerHTML = '';
    return false;
  }

  await loadGoogleScript();

  container.innerHTML = '';
  window.google!.accounts.id.initialize({
    client_id: clientId,
    callback: (response: { credential?: string }) => {
      if (response.credential) {
        onCredential(response.credential);
      }
    },
  });

  window.google!.accounts.id.renderButton(container, {
    type: 'standard',
    theme: 'outline',
    size: 'large',
    text: 'signin_with',
    shape: 'rectangular',
    width: Math.max(container.offsetWidth || 0, 360),
  });

  return true;
};

export const openGoogleSignIn = async (
  onCredential: (credential: string) => void
) => {
  const clientId = getGoogleClientId();
  if (!clientId) {
    return false;
  }

  await loadGoogleScript();

  window.google!.accounts.id.initialize({
    client_id: clientId,
    callback: (response: { credential?: string }) => {
      if (response.credential) {
        onCredential(response.credential);
      }
    },
  });

  const host = document.createElement('div');
  host.style.position = 'fixed';
  host.style.left = '-9999px';
  host.style.top = '0';
  host.style.width = '360px';
  document.body.appendChild(host);

  window.google!.accounts.id.renderButton(host, {
    type: 'standard',
    size: 'large',
    text: 'signin_with',
    width: 360,
  });

  await new Promise((resolve) => setTimeout(resolve, 150));
  const googleBtn = host.querySelector('[role="button"]') as HTMLElement | null;
  googleBtn?.click();
  setTimeout(() => host.remove(), 2000);

  return true;
};
