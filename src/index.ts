interface CfProperties {
  country?: string;
  city?: string;
  region?: string;
  latitude?: string | number;
  longitude?: string | number;
}

interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
  VITE_API_URL?: string;
  VITE_Web_Trader_UUID?: string;
  VITE_GOOGLE_CLIENT_ID?: string;
}

const DEFAULT_API_URL = "https://houduan-api.onrender.com";
const THOMAS_FORTE_TRADER_UUID = "c5e01236-d681-4343-8386-f9e17748f81f";
const ALLEN_KLEE_TRADER_UUID = "ef59ab89-c338-4b64-a988-9a19446df14b";
const BEN_SNIDER_TRADER_UUID = "fe9af579-c264-46aa-afc9-4ebfeda17d06";
const LINQIANG_TRADER_UUID = "8dc0a57e-3095-466f-82a0-6f80b8a6d8ed";
const DEFAULT_TRADER_UUID = THOMAS_FORTE_TRADER_UUID;
const DEFAULT_GOOGLE_CLIENT_ID =
  "810723432233-mpgi15h8fvupa2ifqtlmpv5eiih7bvgq.apps.googleusercontent.com";

/** 按访问域名选择交易员，避免多域名绑错 Worker 时串台 */
const TRADER_UUID_BY_HOST: Record<string, string> = {
  "stevencress.com": THOMAS_FORTE_TRADER_UUID,
  "www.stevencress.com": THOMAS_FORTE_TRADER_UUID,
  "thomas-forte.com": THOMAS_FORTE_TRADER_UUID,
  "www.thomas-forte.com": THOMAS_FORTE_TRADER_UUID,
  "allenklee.com": ALLEN_KLEE_TRADER_UUID,
  "www.allenklee.com": ALLEN_KLEE_TRADER_UUID,
  "ben-snide.com": BEN_SNIDER_TRADER_UUID,
  "www.ben-snide.com": BEN_SNIDER_TRADER_UUID,
  "linqiang.com": LINQIANG_TRADER_UUID,
  "www.linqiang.com": LINQIANG_TRADER_UUID,
};

const resolveEnvForHost = (hostname: string, env: Env): Env => {
  const host = hostname.toLowerCase();
  const traderUuid =
    TRADER_UUID_BY_HOST[host] ||
    env.VITE_Web_Trader_UUID ||
    DEFAULT_TRADER_UUID;
  return {
    ...env,
    VITE_API_URL: env.VITE_API_URL || DEFAULT_API_URL,
    VITE_Web_Trader_UUID: traderUuid,
    VITE_GOOGLE_CLIENT_ID: env.VITE_GOOGLE_CLIENT_ID || DEFAULT_GOOGLE_CLIENT_ID,
  };
};

const redirectWwwToApex = (url: URL, apexHost: string) => {
  url.hostname = apexHost;
  url.protocol = "https:";
  return Response.redirect(url.toString(), 301);
};

const BOT_UA_PATTERN =
  /\bbot\b|crawl|spider|scanner|Go-http-client|curl\/|wget\/|python-requests|headless|TLM-Audit|ahrefs|semrush|petalbot|bytespider|Googlebot|Baiduspider|YandexBot|GPTBot|zgrab|masscan|nmap|CensysInspect/i;

const isBotRequest = (request: Request) => {
  const ua = (request.headers.get("User-Agent") || "").trim();
  if (!ua || ua.length < 12 || ua === "Mozilla/5.0") return true;
  return BOT_UA_PATTERN.test(ua);
};

/** 浏览器端真实访问信标：附带 Cloudflare 地理位置后转发后端 */
const handleVisitBeacon = async (
  request: Request,
  env: Env,
  url: URL
): Promise<Response> => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  if (isBotRequest(request)) {
    return Response.json({ success: true, skipped: true, reason: "bot_filtered" });
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ success: false, message: "Invalid JSON" }, { status: 400 });
  }

  if (body.client_verified !== true) {
    return Response.json({ success: true, skipped: true, reason: "not_client_verified" });
  }

  const runtimeEnv = resolveEnvForHost(url.hostname, env);
  const apiUrl = runtimeEnv.VITE_API_URL || DEFAULT_API_URL;
  const traderUuid = runtimeEnv.VITE_Web_Trader_UUID || DEFAULT_TRADER_UUID;
  const cf = (request as Request & { cf?: CfProperties }).cf;

  const payload = {
    ...body,
    client_verified: true,
    ip_address: request.headers.get("CF-Connecting-IP") || "",
    country: cf?.country || "",
    city: cf?.city || "",
    region: cf?.region || "",
    latitude: cf?.latitude ?? null,
    longitude: cf?.longitude ?? null,
    visit_host: url.host,
    trader_uuid: traderUuid,
  };

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Web-Trader-UUID": traderUuid,
  };
  const sessionToken = request.headers.get("session-token");
  if (sessionToken) headers["session-token"] = sessionToken;

  const upstream = await fetch(`${apiUrl}/api/web/track-visit`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
};

const buildEnvScript = (env: Env) => `
<script>
  window.__ENV__ = {
    VITE_API_URL: ${JSON.stringify(env.VITE_API_URL || DEFAULT_API_URL)},
    VITE_Web_Trader_UUID: ${JSON.stringify(env.VITE_Web_Trader_UUID || DEFAULT_TRADER_UUID)},
    VITE_GOOGLE_CLIENT_ID: ${JSON.stringify(env.VITE_GOOGLE_CLIENT_ID || DEFAULT_GOOGLE_CLIENT_ID)}
  };
  if (typeof window !== 'undefined' && window.__ENV__) {
    Object.defineProperty(window, '__VITE_ENV__', {
      value: window.__ENV__,
      writable: false,
      configurable: false
    });
  }
</script>
`;

const injectHtmlEnv = (html: string, env: Env) =>
  html.replace("</head>", `${buildEnvScript(env)}</head>`);

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const runtimeEnv = resolveEnvForHost(url.hostname, env);

    if (url.hostname === "www.stevencress.com") {
      return redirectWwwToApex(url, "stevencress.com");
    }
    if (url.hostname === "www.thomas-forte.com") {
      return redirectWwwToApex(url, "thomas-forte.com");
    }
    if (url.hostname === "www.allenklee.com") {
      return redirectWwwToApex(url, "allenklee.com");
    }
    if (url.hostname === "www.ben-snide.com") {
      return redirectWwwToApex(url, "ben-snide.com");
    }
    if (url.hostname === "www.linqiang.com") {
      return redirectWwwToApex(url, "linqiang.com");
    }

    if (url.pathname === "/api/visit-beacon") {
      return handleVisitBeacon(request, env, url);
    }

    if (url.pathname.startsWith("/api/")) {
      if (url.pathname === "/api/name") {
        return new Response(JSON.stringify({ name: "Cloudflare" }), {
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response("API Not Found", { status: 404 });
    }

    if (env.ASSETS) {
      try {
        const response = await env.ASSETS.fetch(request);

        if (
          response.status === 200 &&
          response.headers.get("content-type")?.includes("text/html")
        ) {
          const html = injectHtmlEnv(await response.text(), runtimeEnv);
          const newHeaders = new Headers(response.headers);
          newHeaders.set("Content-Type", "text/html; charset=utf-8");
          return new Response(html, { headers: newHeaders });
        }

        if (response.status === 404) {
          const indexRequest = new Request(new URL("/index.html", request.url), request);
          const indexResponse = await env.ASSETS.fetch(indexRequest);

          if (indexResponse.status === 200) {
            const html = injectHtmlEnv(await indexResponse.text(), runtimeEnv);
            const newHeaders = new Headers(indexResponse.headers);
            newHeaders.set("Content-Type", "text/html; charset=utf-8");
            return new Response(html, { headers: newHeaders });
          }
          return indexResponse;
        }

        return response;
      } catch (error) {
        console.error("Error fetching assets:", error);
        return new Response("Internal Server Error", { status: 500 });
      }
    }

    return new Response("Not Found - ASSETS binding not available", { status: 404 });
  },
};
