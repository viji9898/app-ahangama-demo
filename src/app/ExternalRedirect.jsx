import React from "react";
import { Seo } from "./seo";

export default function ExternalRedirect({ to }) {
  React.useEffect(() => {
    window.location.replace(to);
  }, [to]);

  return (
    <>
      <Seo
        title="Google Map Redirect — Ahangama"
        description="Direct link to Google Maps for Ahangama."
        canonical={to}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Google Map Redirect — Ahangama",
          url: to,
        }}
      />
      <a href={to}>Continuing to Google Maps</a>
    </>
  );
}
