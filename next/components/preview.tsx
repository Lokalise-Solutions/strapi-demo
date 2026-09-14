'use client';

import { API_URL } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function isTrustedStrapiOrigin(origin: string): boolean {
  if (origin === API_URL) {
    return true;
  }

  try {
    const api = new URL(API_URL);
    const incoming = new URL(origin);
    if (incoming.hostname === api.hostname) {
      return true;
    }

    const localHosts = new Set(['localhost', '127.0.0.1']);
    if (
      localHosts.has(incoming.hostname) &&
      localHosts.has(api.hostname) &&
      incoming.port === api.port
    ) {
      return true;
    }

    if (
      incoming.hostname.endsWith('.admin.strapiapp.com') &&
      api.hostname.endsWith('.strapiapp.com')
    ) {
      const apiSlug = api.hostname.replace('.strapiapp.com', '');
      const adminSlug = incoming.hostname.replace('.admin.strapiapp.com', '');
      return apiSlug === adminSlug;
    }
  } catch {
    return false;
  }

  return false;
}

export const Preview = () => {
  const router = useRouter();

  useEffect(() => {
    const handleMessage = async (message: MessageEvent<any>) => {
      const { origin, data } = message;

      if (isTrustedStrapiOrigin(origin) === false) {
        return;
      }

      if (data.type === 'strapiUpdate') {
        router.refresh();
      } else if (data.type === 'strapiScript') {
        const script = window.document.createElement('script');
        script.textContent = data.payload.script;
        window.document.head.appendChild(script);
      }
    };

    // Add the event listener
    window.addEventListener('message', handleMessage);

    // Let Strapi know we're ready to receive the script
    window.parent?.postMessage({ type: 'previewReady' }, '*');

    // Remove the event listener on unmount
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [router]);

  return null;
};
