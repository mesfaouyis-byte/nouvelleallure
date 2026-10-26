// Public tracking IDs only. Leave blank until your accounts and consent policy are ready.
export const analyticsIds = { google: "", meta: "", tiktok: "" };
export function enableAnalytics() {
  const w = window as any;
  if (localStorage.getItem("na-consent") !== "granted") return;
  if (w.naAnalyticsLoaded) {
    if (analyticsIds.google) {
      w[`ga-disable-${analyticsIds.google}`] = false;
      w.gtag?.("consent", "update", { analytics_storage: "granted" });
    }
    w.fbq?.("consent", "grant");
    w.ttq?.grantConsent?.();
    return;
  }
  w.naAnalyticsLoaded = true;
  const inject = (src: string) => {
    const s = document.createElement("script");
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
  };
  if (analyticsIds.google) {
    w.dataLayer = w.dataLayer || [];
    w.gtag = function () {
      w.dataLayer.push(arguments);
    };
    w.gtag("consent", "default", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    w.gtag("js", new Date());
    w.gtag("config", analyticsIds.google);
    inject(
      `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsIds.google)}`,
    );
  }
  if (analyticsIds.meta) {
    const f: any = function (...args: any[]) {
      f.callMethod ? f.callMethod(...args) : f.queue.push(args);
    };
    f.queue = [];
    f.loaded = true;
    f.version = "2.0";
    w.fbq = f;
    inject("https://connect.facebook.net/en_US/fbevents.js");
    f("init", analyticsIds.meta);
    f("track", "PageView");
  }
  if (analyticsIds.tiktok) {
    w.TiktokAnalyticsObject = "ttq";
    const ttq: any = [];
    w.ttq = ttq;
    for (const method of [
      "page",
      "track",
      "identify",
      "ready",
      "alias",
      "group",
      "enableCookie",
      "disableCookie",
      "holdConsent",
      "revokeConsent",
      "grantConsent",
    ])
      ttq[method] = (...args: any[]) => ttq.push([method, ...args]);
    ttq._i = {};
    ttq._i[analyticsIds.tiktok] = [];
    ttq._i[analyticsIds.tiktok]._u =
      "https://analytics.tiktok.com/i18n/pixel/events.js";
    ttq._t = { [analyticsIds.tiktok]: Date.now() };
    ttq._o = { [analyticsIds.tiktok]: {} };
    inject(
      `https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${encodeURIComponent(analyticsIds.tiktok)}&lib=ttq`,
    );
    ttq.page();
  }
}
export function revokeAnalytics() {
  const w = window as any;
  if (analyticsIds.google) {
    w[`ga-disable-${analyticsIds.google}`] = true;
    w.gtag?.("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  }
  w.fbq?.("consent", "revoke");
  w.ttq?.revokeConsent?.();
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (/^(_ga|_gid|_gat|_fbp|_fbc|_ttp)/.test(name)) {
      document.cookie = `${name}=; Max-Age=0; path=/`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.${location.hostname}`;
    }
  }
}
