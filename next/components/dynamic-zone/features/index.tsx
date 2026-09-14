import React from 'react';

import { Container } from '../../container';
import { Heading } from '../../elements/heading';
import { Subheading } from '../../elements/subheading';
import { Card, CardDescription, CardTitle } from './card';

export const Features = ({
  heading,
  sub_heading,
  globe_card,
  ray_card,
  graph_card,
  social_media_card,
}: {
  heading: string;
  sub_heading: string;
  globe_card: any;
  ray_card: any;
  graph_card: any;
  social_media_card: any;
}) => {
  const cards = [
    globe_card ? { ...globe_card, tone: 'peach' as const } : null,
    ray_card ? { ...ray_card, tone: 'lavender' as const } : null,
    graph_card ? { ...graph_card, tone: 'cream' as const } : null,
    social_media_card
      ? {
          title: social_media_card.title ?? social_media_card.Title,
          description:
            social_media_card.description ?? social_media_card.Description,
          tone: 'blue' as const,
        }
      : null,
  ].filter(
    (
      card
    ): card is {
      title: string;
      description: string;
      tone: 'peach' | 'lavender' | 'cream' | 'blue';
    } => card !== null
  );

  return (
    <section className="bg-white">
      <Container className="py-20 max-w-7xl mx-auto relative z-40">
        <Heading className="pt-4">{heading}</Heading>
        <Subheading className="max-w-3xl mx-auto">{sub_heading}</Subheading>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-10">
          {cards.map((card) => (
            <Card key={card.title} tone={card.tone}>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};
