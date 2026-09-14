import { cookies, draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

function isSafeRelativePath(url: string): boolean {
  return url.startsWith('/') && url.startsWith('//') === false;
}

async function allowDraftCookieInIframe() {
  const cookieStore = await cookies();
  const draftCookie = cookieStore.get('__prerender_bypass');
  if (draftCookie?.value === undefined) {
    return;
  }

  cookieStore.set({
    name: '__prerender_bypass',
    value: draftCookie.value,
    httpOnly: true,
    path: '/',
    secure: true,
    sameSite: 'none',
  });
}

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const url = searchParams.get('url') ?? '/';
  const status = searchParams.get('status');

  if (secret !== process.env.PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  const draft = await draftMode();

  if (status === 'published') {
    draft.disable();
  } else {
    draft.enable();
    await allowDraftCookieInIframe();
  }

  redirect(isSafeRelativePath(url) === true ? url : '/');
};
