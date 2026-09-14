'use client';

export function ErrorFallback({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const cause = error.cause instanceof Error ? error.cause.message : undefined;
  const message = cause ?? error.message;

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center bg-white px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold text-brand-black">
        The page failed to load
      </h1>
      <p className="mt-3 max-w-lg text-sm leading-6 text-neutral-600">
        {message}
      </p>
      <p className="mt-3 max-w-lg text-sm leading-6 text-neutral-500">
        Run `yarn dev` from the repo root so Strapi is on port 1337 and Next is
        on port 3000, then try again.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-8 rounded-full bg-brand-salmon px-5 py-2 text-sm font-semibold text-white"
      >
        Try again
      </button>
    </div>
  );
}
