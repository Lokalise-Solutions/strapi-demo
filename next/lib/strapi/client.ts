import { strapi } from '@strapi/client';
import type { API, Config } from '@strapi/client';
import { cacheLife, cacheTag, revalidateTag } from 'next/cache';
import { draftMode } from 'next/headers';

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
    .find({
      ...options,
      status: 'published',
    });

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

  try {
    return await withTimeout(
      (async () => {
        // Bypass cache in draft mode for real-time preview
        if (isDraftMode) {
          const { data } = await createClient(config, true)
            .collection(collectionName)
            .find({
              ...options,
              status: 'draft',
            });
          return data as T;
        }

        // Bypass cache in development mode
        if (process.env.ENVIRONMENT === 'development') {
          const { data } = await createClient(config)
            .collection(collectionName)
            .find({
              ...options,
              status: 'published',
            });
          return data as T;
        }

        // Use cached version for published content
        return fetchCollectionCached<T>(collectionName, options, config);
      })(),
      `fetching collection "${collectionName}"`
    );
  } catch (error) {
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

  const { data } = await createClient(config)
    .single(singleTypeName)
    .find({
      ...options,
      status: 'published',
    });

  return data as T;
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

  try {
    return await withTimeout(
      (async () => {
        if (isDraftMode) {
          const { data } = await createClient(config, true)
            .single(singleTypeName)
            .find({
              ...options,
              status: 'draft',
            });
          return data as T;
        }

        if (process.env.ENVIRONMENT === 'development') {
          const { data } = await createClient(config)
            .single(singleTypeName)
            .find({
              ...options,
              status: 'published',
            });
          return data as T;
        }

        return fetchSingleCached<T>(singleTypeName, options, config);
      })(),
      `fetching "${singleTypeName}"`
    );
  } catch (error) {
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
    .findOne(documentId, {
      ...options,
      status: 'published',
    });

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
            .findOne(documentId, {
              ...options,
              status: 'draft',
            });
          return data as T;
        }

        if (process.env.ENVIRONMENT === 'development') {
          const { data } = await createClient(config)
            .collection(collectionName)
            .findOne(documentId, {
              ...options,
              status: 'published',
            });
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
