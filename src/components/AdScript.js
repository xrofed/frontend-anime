'use client';

import Script from 'next/script';

export default function AdScript() {
  return (
    <>
      <Script
        id="histats-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var _Hasync = _Hasync || [];
            _Hasync.push(['Histats.start', '1,4999046,4,0,0,0,00010000']);
            _Hasync.push(['Histats.fasi', '1']);
            _Hasync.push(['Histats.track_hits', '']);

            (function() {
              var hs = document.createElement('script');
              hs.type = 'text/javascript';
              hs.async = true;
              hs.src = '//s10.histats.com/js15_as.js';
              (document.head || document.body).appendChild(hs);
            })();
          `,
        }}
      />

      <Script
        id="google-ads-obfuscated"
        strategy="afterInteractive"
        data-cfasync="false"
        dangerouslySetInnerHTML={{
          __html: `
            /* isi script ads kamu di sini */
          `,
        }}
      />
    </>
  );
}
