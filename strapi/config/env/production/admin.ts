const getPreviewPathname = (uid, { locale, document }): string | null => {
  const { slug } = document;

  switch (uid) {
    case 'api::page.page': {
      if (slug === 'homepage') {
        return '/';
      }
      return `/${slug}`;
    }
    case 'api::product.product':
      return `/products/${slug}`;
    case 'api::product-page.product-page':
      return '/products';
    case 'api::article.article':
      return `/blog/${slug}`;
    case 'api::blog-page.blog-page':
      return '/blog';
    case 'api::global.global':
      return '/';
    default:
      return null;
  }
};

export default ({ env }) => {
  const clientUrl = env('CLIENT_URL');
  const previewSecret = env('PREVIEW_SECRET');
  const allowedOrigins = [
    clientUrl,
    env('WEBSITE_URL'),
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ].filter((origin) => typeof origin === 'string' && origin.length > 0);

  return {
    auth: {
      secret: env('ADMIN_JWT_SECRET'),
    },
    apiToken: {
      salt: env('API_TOKEN_SALT'),
    },
    transfer: {
      token: {
        salt: env('TRANSFER_TOKEN_SALT'),
      },
    },
    flags: {
      nps: env.bool('FLAG_NPS', true),
      promoteEE: env.bool('FLAG_PROMOTE_EE', true),
    },
    preview: {
      enabled: clientUrl !== undefined && previewSecret !== undefined,
      config: {
        allowedOrigins,
        async handler(uid, { documentId, locale, status }) {
          const document = await strapi
            .documents(uid)
            .findOne({ documentId, locale, status });
          const pathname = getPreviewPathname(uid, { locale, document });

          if (pathname === null || clientUrl === undefined) {
            return null;
          }

          const localizedPath =
            pathname === '/'
              ? `/${locale ?? 'en'}`
              : `/${locale ?? 'en'}${pathname}`;

          const urlSearchParams = new URLSearchParams({
            url: localizedPath,
            secret: previewSecret,
            status,
          });

          return `${clientUrl}/api/preview?${urlSearchParams}`;
        },
      },
    },
  };
};
