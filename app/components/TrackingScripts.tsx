'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

/**
 * Component to handle third-party tracking scripts (GA4 & Meta Pixel)
 * based on user cookie consent.
 */
export default function TrackingScripts() {
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    // Check consent status on mount
    const savedConsent = localStorage.getItem('jbi_cookie_consent');
    setConsent(savedConsent);
  }, []);

  // Use IDs from env variables to keep the code clean and configurable
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;
  const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

  // We only load these scripts if the user clicked "Aceptar todo" ('all')
  if (consent !== 'all') {
    return null;
  }

  return (
    <>
      {/* --- Google Analytics 4 --- */}
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `}
          </Script>
        </>
      )}

      {/* --- Meta Pixel (Facebook / Instagram) --- */}
      {FB_PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  );
}
