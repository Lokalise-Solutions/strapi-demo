import Link from 'next/link';

export function Banner() {
  return (
    <div className="fixed top-0 inset-x-0 h-[3.25rem] z-[60] bg-peach-100 border-b border-peach-200 flex items-center justify-center">
      <div className="flex w-full h-full items-center justify-center text-sm font-medium text-brand-black px-4">
        <span className="truncate">
          Localization for marketing teams &middot;{' '}
          <Link
            href="https://lokalise.com/solutions/for-marketers/"
            target="_blank"
            className="text-peach-700 hover:text-brand-black transition-colors underline underline-offset-4 decoration-peach-300"
          >
            See how Vantage works
          </Link>
        </span>
      </div>
    </div>
  );
}
