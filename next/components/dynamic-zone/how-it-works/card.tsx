import React from 'react';

export const Card = ({
  title,
  description,
  index,
}: {
  title: string;
  description: string;
  index: number;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 max-w-4xl mx-auto items-start rounded-2xl border border-neutral-200 bg-white p-6 md:p-8 shadow-sm">
      <p className="text-4xl md:text-5xl font-display font-semibold text-brand-salmon leading-none">
        {String(index).padStart(2, '0')}
      </p>
      <div>
        <p className="text-xl font-semibold text-brand-black">{title}</p>
        <p className="text-muted mt-3">{description}</p>
      </div>
    </div>
  );
};
