// src/analytics.js
export const trackPageView = (url) => {
  if (window.gtag) {
    window.gtag("event", "page_view", {
      page_path: url,
    });
  }
};
