/**
 * Turns a pasted Strapi Cloud / admin / endpoint URL into the public origin
 * the Next client expects: https://<project>.strapiapp.com
 */
export function normalizeStrapiApiUrl(raw) {
  const trimmed = raw.trim();

  try {
    const parsed = new URL(trimmed);

    if (parsed.hostname === 'localhost') {
      parsed.hostname = '127.0.0.1';
    }

    if (parsed.hostname.endsWith('.admin.strapiapp.com')) {
      parsed.hostname = parsed.hostname.replace(
        '.admin.strapiapp.com',
        '.strapiapp.com'
      );
    }

    parsed.pathname = parsed.pathname.replace(/\/+$/, '');
    if (
      parsed.pathname === '/admin' ||
      parsed.pathname === '/api' ||
      parsed.pathname.startsWith('/api/') ||
      parsed.pathname.startsWith('/admin/')
    ) {
      parsed.pathname = '';
    }

    parsed.search = '';
    parsed.hash = '';

    return parsed.toString().replace(/\/$/, '');
  } catch {
    return trimmed.replace(/\/$/, '');
  }
}
