import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: "RoboParks — Experiential Technology Ecosystems",
  description: "RoboPark, RoboLand, and RoboLand Mini — immersive technology ecosystems bringing robotics, AI, innovation, education, entertainment, and hands-on learning together. Currently in stakeholder discussions.",
  alternates: { canonical: "/roboparks" },
  openGraph: {
    title: "RoboParks — Experiential Technology Ecosystems",
    description: "RoboPark, RoboLand, and RoboLand Mini — immersive technology ecosystems bringing robotics, AI, innovation, education, entertainment, and hands-on learning together. Currently in stakeholder discussions.",
    url: "/roboparks",
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: "RoboParks — Experiential Technology Ecosystems",
    description: "RoboPark, RoboLand, and RoboLand Mini — immersive technology ecosystems bringing robotics, AI, innovation, education, entertainment, and hands-on learning together. Currently in stakeholder discussions."
  }
};

const jsonLd: object[] = [{"@context":"https://schema.org","@type":"Project","name":"RoboParks Experiential Technology Ecosystems","description":"RoboPark, RoboLand, and RoboLand Mini — immersive technology ecosystems bringing robotics, AI, innovation, education, entertainment, and hands-on learning together. Currently in stakeholder discussions.","funder":{"@id":"https://inkerrobotics.com#organization"},"url":"https://inkerrobotics.com/roboparks"},{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://inkerrobotics.com/"},{"@type":"ListItem","position":2,"name":"RoboParks — Experiential Technology Ecosystems","item":"https://inkerrobotics.com/roboparks"}]}];
import SolutionPage from '@/components/SolutionPage';

const SHOWCASE = [
    { title: 'RoboPark', image: '/images/Roboparks/RoboPark.png', description: 'The full destination format — a large-scale experiential park combining robotics exhibits, AI experiences, hands-on learning zones and live demonstrations.', bullets: ['Destination-scale footprint', 'Robotics and AI exhibits', 'Live demonstration arenas'] },
    { title: 'RoboLand', image: '/images/Roboparks/Roboland.png', description: 'A mid-scale ecosystem designed for city venues, campuses and malls — the RoboPark experience adapted to a contained urban footprint.', bullets: ['City and campus venues', 'Modular exhibit design', 'Year-round operation'] },
    { title: 'RoboLand Mini', image: '/images/Roboparks/Roboland Mini.png', description: 'The compact format — a portable installation that brings robotics and AI experiences into schools, events and short-run activations.', bullets: ['Portable and rapid to deploy', 'Ideal for schools and events', 'Lowest entry cost'] }
];

const SPECS = [
    { value: '3', suffix: '', label: 'Formats' },
    { value: '1', suffix: '', label: 'Shared platform' },
    { value: '200', suffix: '+', label: 'Expos delivered' },
    { value: '200', suffix: 'K+', label: 'Students reached' }
];

export default function Page() {
  return (
    <>
      {jsonLd.map((d, i) => <JsonLd key={i} data={d} />)}
      <SolutionPage
        ghost='PARKS'
        eyebrow='RoboParks'
        title='EXPERIENTIAL TECHNOLOGY ECOSYSTEMS'
        heroImage='/images/Roboparks/RoboPark.png'
        heroStat={{ value: '3', suffix: '+', label: <>Ecosystem<br />formats</> }}
        tabs={['FORMATS', 'PARTNERSHIPS']}
        aboutEyebrow='The vision'
        aboutTitle='WHERE ROBOTICS MEETS PUBLIC LIFE'
        aboutBody='A RoboPark is an experiential technology ecosystem envisioned by Inker Robotics — bringing robotics, AI, innovation, education and entertainment together in one destination. Three formats scale the idea from a full park to a compact installation. Currently in stakeholder discussions.'
        aboutImage='/images/Roboparks/Roboland.png'
        showcaseTitle='THREE FORMATS'
        showcase={SHOWCASE}
        specs={SPECS}
        limitlessTitle='LOOKING FOR PARTNERS AND STAKEHOLDERS'
        limitlessTags={['Partnership', 'Ecosystem', 'Vision']}
        limitlessImage='/images/Roboparks/Roboland Mini.png'
        articleTitle='The RoboPark is open for collaboration'
        articleBody='RoboParks is currently in stakeholder discussions. If you operate a venue, a campus or a public space and want to bring robotics into it, we would like to talk about what a RoboPark could look like there.'
        diveTitle='PARTNER WITH US'
        diveImage='/images/Roboparks/RoboPark.png'
      />
    </>
  );
}
