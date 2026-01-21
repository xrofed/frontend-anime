'use client';

import Script from 'next/script';

export default function AdScript() {
  return (
    <>
      <Script
        id="google-ads-obfuscated"
        strategy="afterInteractive"
        data-cfasync="false"
        dangerouslySetInnerHTML={{
          __html: ` `
        }}
      />
    </>
  );
}
