import { strapi } from '@strapi/client';
import type { API, Config } from '@strapi/client';
import { cacheLife, cacheTag, revalidateTag } from 'next/cache';
import { draftMode } from 'next/headers';

import { i18n } from '@/i18n.config';
import { API_URL } from '../utils';

const STRAPI_FETCH_TIMEOUT_MS = 8000;

export class StrapiError extends Error {
  constructor(
    message: string,
    public readonly contentType: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'StrapiError';
  }
}

function assertApiUrl(contentType: string): void {
  if (API_URL === undefined || API_URL.trim() === '') {
    throw new StrapiError(
      'NEXT_PUBLIC_API_URL is empty. Copy next/.env.example to next/.env and restart Next.js.',
      contentType
    );
  }
}

async function withTimeout<T>(promise: Promise<T>, label: string): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(
        new Error(
          `Timed out ${label} from ${API_URL}. Start both apps from the repo root with \`yarn dev\` (Strapi must be on port 1337).`
        )
      );
    }, STRAPI_FETCH_TIMEOUT_MS);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
  }
}

function requestedLocale(options?: API.BaseQueryParams): string | undefined {
  if (typeof options?.locale === 'string' && options.locale.length > 0) {
    return options.locale;
  }

  const localeFilter =
    options?.filters !== undefined && options.filters !== null
      ? (options.filters as { locale?: unknown }).locale
      : undefined;

  if (typeof localeFilter === 'string' && localeFilter.length > 0) {
    return localeFilter;
  }

  if (
    localeFilter !== undefined &&
    localeFilter !== null &&
    typeof localeFilter === 'object' &&
    '$eq' in localeFilter
  ) {
    const equals = (localeFilter as { $eq?: unknown }).$eq;
    if (typeof equals === 'string' && equals.length > 0) {
      return equals;
    }
  }

  return undefined;
}

function withLocale(
  options: API.BaseQueryParams | undefined,
  locale: string
): API.BaseQueryParams {
  const next: API.BaseQueryParams = { ...options };

  if (typeof options?.locale === 'string') {
    next.locale = locale;
  }

  if (options?.filters !== undefined && options.filters !== null) {
    const filters = { ...(options.filters as Record<string, unknown>) };
    if (typeof filters.locale === 'string') {
      filters.locale = locale;
    } else if (
      filters.locale !== undefined &&
      filters.locale !== null &&
      typeof filters.locale === 'object' &&
      '$eq' in (filters.locale as object)
    ) {
      filters.locale = { $eq: locale };
    }
    next.filters = filters as API.BaseQueryParams['filters'];
  }

  return next;
}

function httpStatus(error: unknown): number | undefined {
  if (error === null || error === undefined || typeof error !== 'object') {
    return undefined;
  }

  if (
    'status' in error &&
    typeof (error as { status?: unknown }).status === 'number'
  ) {
    return (error as { status: number }).status;
  }

  const response =
    'response' in error
      ? (error as { response?: { status?: unknown } }).response
      : undefined;
  if (response !== undefined && typeof response.status === 'number') {
    return response.status;
  }

  return undefined;
}

function isLocaleFallbackError(error: unknown): boolean {
  const status = httpStatus(error);
  if (status === 400 || status === 404) {
    return true;
  }

  const message = error instanceof Error ? error.message : '';
  return (
    message.includes('400') ||
    message.includes('404') ||
    message.includes('Bad Request') ||
    message.includes('Not Found')
  );
}

function withDraftStatus(
  options: API.BaseQueryParams | undefined,
  isDraft: boolean
): API.BaseQueryParams {
  if (isDraft === true) {
    return { ...options, status: 'draft' };
  }

  // Published is the REST default. Sending status=published 400s on some
  // Strapi Cloud versions ("Invalid key status") and fails the Vercel prerender.
  return { ...options };
}

async function findSingleWithLocaleFallback<T>(
  singleTypeName: string,
  options: API.BaseQueryParams | undefined,
  config: Omit<Config, 'baseURL'> | undefined,
  isDraft: boolean
): Promise<T> {
  try {
    const { data } = await createClient(config, isDraft)
      .single(singleTypeName)
      .find(withDraftStatus(options, isDraft));
    return data as T;
  } catch (error) {
    const locale = requestedLocale(options);
    if (
      isLocaleFallbackError(error) === true &&
      locale !== undefined &&
      locale !== i18n.defaultLocale
    ) {
      const { data } = await createClient(config, isDraft)
        .single(singleTypeName)
        .find(withDraftStatus(withLocale(options, i18n.defaultLocale), isDraft));
      return data as T;
    }

    throw error;
  }
}

function toStrapiError(
  error: unknown,
  message: string,
  contentType: string
): StrapiError {
  if (error instanceof StrapiError) {
    return error;
  }

  const detail = error instanceof Error ? error.message : 'unknown error';
  return new StrapiError(`${message}: ${detail}`, contentType, error);
}

const createClient = (
  config?: Omit<Config, 'baseURL'>,
  isDraftMode: boolean = false
) => {
  return strapi({
    baseURL: `${API_URL}/api`,
    headers: {
      'strapi-encode-source-maps': isDraftMode ? 'true' : 'false',
      ...config?.headers,
    },
    ...config,
  });
};

/**
 * Cached fetch for collection types (published content only).
 * Uses Next.js 16 'use cache' directive for explicit caching.
 */
async function fetchCollectionCached<T = API.Document[]>(
  collectionName: string,
  options?: API.BaseQueryParams,
  config?: Omit<Config, 'baseURL'>
): Promise<T> {
  'use cache';
  cacheLife('minutes'); // Cache for 15 minutes by default
  cacheTag(`collection-${collectionName}`);

  const { data } = await createClient(config)
    .collection(collectionName)
    .find(withDraftStatus(options, false));

  return data as T;
}

/**
 * Fetches a collection type from Strapi.
 * Automatically bypasses cache in draft mode.
 *
 * @throws {StrapiError} When the fetch fails
 */
export async function fetchCollectionType<T = API.Document[]>(
  collectionName: string,
  options?: API.BaseQueryParams,
  config?: Omit<Config, 'baseURL'>
): Promise<T> {
  assertApiUrl(collectionName);
  const { isEnabled: isDraftMode } = await draftMode();

  const load = async (query: API.BaseQueryParams | undefined): Promise<T> => {
    if (isDraftMode) {
      const { data } = await createClient(config, true)
        .collection(collectionName)
        .find(withDraftStatus(query, true));
      return data as T;
    }

    if (process.env.ENVIRONMENT === 'development') {
      const { data } = await createClient(config)
        .collection(collectionName)
        .find(withDraftStatus(query, false));
      return data as T;
    }

    return fetchCollectionCached<T>(collectionName, query, config);
  };

  try {
    const data = await withTimeout(
      load(options),
      `fetching collection "${collectionName}"`
    );

    const locale = requestedLocale(options);
    if (
      Array.isArray(data) &&
      data.length === 0 &&
      locale !== undefined &&
      locale !== i18n.defaultLocale
    ) {
      return await withTimeout(
        load(withLocale(options, i18n.defaultLocale)),
        `fetching collection "${collectionName}"`
      );
    }

    return data;
  } catch (error) {
    const locale = requestedLocale(options);
    if (locale !== undefined && locale !== i18n.defaultLocale) {
      try {
        return await withTimeout(
          load(withLocale(options, i18n.defaultLocale)),
          `fetching collection "${collectionName}"`
        );
      } catch {
        // Fall through to the original error.
      }
    }

    throw toStrapiError(
      error,
      `Failed to fetch collection "${collectionName}"`,
      collectionName
    );
  }
}

/**
 * Cached fetch for single types (published content only).
 */
async function fetchSingleCached<T = API.Document>(
  singleTypeName: string,
  options?: API.BaseQueryParams,
  config?: Omit<Config, 'baseURL'>
): Promise<T> {
  'use cache';
  cacheLife('minutes');
  cacheTag(`single-${singleTypeName}`);

  return findSingleWithLocaleFallback<T>(
    singleTypeName,
    options,
    config,
    false
  );
}

/**
 * Fetches a single type from Strapi.
 * Automatically bypasses cache in draft mode.
 *
 * @throws {StrapiError} When the fetch fails
 */
export async function fetchSingleType<T = API.Document>(
  singleTypeName: string,
  options?: API.BaseQueryParams,
  config?: Omit<Config, 'baseURL'>
): Promise<T> {
  assertApiUrl(singleTypeName);
  const { isEnabled: isDraftMode } = await draftMode();

  const load = async (query: API.BaseQueryParams | undefined): Promise<T> => {
    if (isDraftMode) {
      return findSingleWithLocaleFallback<T>(
        singleTypeName,
        query,
        config,
        true
      );
    }

    if (process.env.ENVIRONMENT === 'development') {
      return findSingleWithLocaleFallback<T>(
        singleTypeName,
        query,
        config,
        false
      );
    }

    return fetchSingleCached<T>(singleTypeName, query, config);
  };

  try {
    return await withTimeout(load(options), `fetching "${singleTypeName}"`);
  } catch (error) {
    const locale = requestedLocale(options);
    if (locale !== undefined && locale !== i18n.defaultLocale) {
      try {
        return await withTimeout(
          load(withLocale(options, i18n.defaultLocale)),
          `fetching "${singleTypeName}"`
        );
      } catch {
        // Fall through to the original error.
      }
    }

    throw toStrapiError(
      error,
      `Failed to fetch single type "${singleTypeName}"`,
      singleTypeName
    );
  }
}

/**
 * Cached fetch for documents (published content only).
 */
async function fetchDocumentCached<T = API.Document>(
  collectionName: string,
  documentId: string,
  options?: API.BaseQueryParams,
  config?: Omit<Config, 'baseURL'>
): Promise<T> {
  'use cache';
  cacheLife('minutes');
  cacheTag(`document-${collectionName}-${documentId}`);

  const { data } = await createClient(config)
    .collection(collectionName)
    .findOne(documentId, withDraftStatus(options, false));

  return data as T;
}

/**
 * Fetches a single document from a collection by documentId.
 * Automatically bypasses cache in draft mode.
 *
 * @throws {StrapiError} When the fetch fails
 */
export async function fetchDocument<T = API.Document>(
  collectionName: string,
  documentId: string,
  options?: API.BaseQueryParams,
  config?: Omit<Config, 'baseURL'>
): Promise<T> {
  assertApiUrl(collectionName);
  const { isEnabled: isDraftMode } = await draftMode();

  try {
    return await withTimeout(
      (async () => {
        if (isDraftMode) {
          const { data } = await createClient(config, true)
            .collection(collectionName)
            .findOne(documentId, withDraftStatus(options, true));
          return data as T;
        }

        if (process.env.ENVIRONMENT === 'development') {
          const { data } = await createClient(config)
            .collection(collectionName)
            .findOne(documentId, withDraftStatus(options, false));
          return data as T;
        }

        return fetchDocumentCached<T>(
          collectionName,
          documentId,
          options,
          config
        );
      })(),
      `fetching document "${documentId}" from "${collectionName}"`
    );
  } catch (error) {
    throw toStrapiError(
      error,
      `Failed to fetch document "${documentId}" from "${collectionName}"`,
      collectionName
    );
  }
}

/**
 * Revalidate cache for a specific content type.
 * Call this from a webhook when Strapi content is updated.
 *
 * @example
 * // Revalidate all articles
 * revalidateContent('collection', 'articles');
 *
 * // Revalidate a specific document
 * revalidateContent('document', 'articles', 'abc123');
 *
 * // Revalidate a single type
 * revalidateContent('single', 'global');
 */
export function revalidateContent(
  type: 'collection' | 'single' | 'document',
  contentType: string,
  documentId?: string
): void {
  // Use 'max' profile for stale-while-revalidate behavior
  // This serves stale content while fetching fresh data in background
  switch (type) {
    case 'collection':
      revalidateTag(`collection-${contentType}`, 'max');
      break;
    case 'single':
      revalidateTag(`single-${contentType}`, 'max');
      break;
    case 'document':
      if (documentId) {
        revalidateTag(`document-${contentType}-${documentId}`, 'max');
      }
      break;
  }
}
