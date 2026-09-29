import JsonLd from '@/components/JsonLd';
import GalleryClient from './GalleryClient';

export const metadata = {
  title: 'Gallery — Robots, Expos, Press & the Team',
  description:
    'Photographs from Inker Robotics: robots on the floor, technology expos and exhibitions, newspaper and media coverage, student workshops, and the workshop behind all of it.',
  alternates: { canonical: '/gallery' },
  openGraph: {
    title: 'Gallery — Robots, Expos, Press & the Team',
    description:
      'Photographs from Inker Robotics: robots on the floor, technology expos, media coverage, student workshops and the team.',
    url: '/gallery',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gallery — Inker Robotics',
    description:
      'Photographs from Inker Robotics: robots, expos, press coverage, workshops and the team.',
  },
};

const jsonLd: object[] = [
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': 'https://inkerrobotics.com/gallery#webpage',
    url: 'https://inkerrobotics.com/gallery',
    name: 'Gallery — Inker Robotics',
    description:
      'Photographs from Inker Robotics: robots, technology expos, media coverage, workshops and the team.',
    isPartOf: { '@id': 'https://inkerrobotics.com#website' },
    about: { '@id': 'https://inkerrobotics.com#organization' },
    inLanguage: 'en-IN',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://inkerrobotics.com/' },
      { '@type': 'ListItem', position: 2, name: 'Gallery', item: 'https://inkerrobotics.com/gallery' },
    ],
  },
];

export default function Page() {
  return (
    <>
      {jsonLd.map((d, i) => <JsonLd key={i} data={d} />)}
      <GalleryClient />
    </>
  );
}
