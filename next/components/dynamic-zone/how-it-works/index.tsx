import React from 'react';

import { Container } from '../../container';
import { Heading } from '../../elements/heading';
import { Subheading } from '../../elements/subheading';
import { Card } from './card';

export const HowItWorks = ({
  heading,
  sub_heading,
  steps,
}: {
  heading: string;
  sub_heading: string;
  steps: any;
}) => {
  return (
    <section className="bg-neutral-50">
      <Container className="py-20 max-w-7xl mx-auto relative z-40">
        <Heading className="pt-4">{heading}</Heading>
        <Subheading className="max-w-3xl mx-auto">{sub_heading}</Subheading>

        <div className="mt-10 space-y-4">
          {steps &&
            steps.map(
              (item: { title: string; description: string }, index: number) => (
                <Card
                  title={item.title}
                  description={item.description}
                  index={index + 1}
                  key={'card' + index}
                />
              )
            )}
        </div>
      </Container>
    </section>
  );
};
