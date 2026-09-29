import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: "About Inker Robotics — Engineering the Future",
  description: "Inker Robotics is a technology company building intelligent robotics, AI-powered solutions, experiential technology ecosystems, and future-ready education programs. Mission, vision, leadership, and journey.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Inker Robotics — Engineering the Future",
    description: "Inker Robotics is a technology company building intelligent robotics, AI-powered solutions, experiential technology ecosystems, and future-ready education programs. Mission, vision, leadership, and journey.",
    url: "/about",
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: "About Inker Robotics — Engineering the Future",
    description: "Inker Robotics is a technology company building intelligent robotics, AI-powered solutions, experiential technology ecosystems, and future-ready education programs. Mission, vision, leadership, and journey."
  }
};

const jsonLd: object[] = [{"@context":"https://schema.org","@type":"AboutPage","@id":"https://inkerrobotics.com/about#about","url":"https://inkerrobotics.com/about","name":"About Inker Robotics — Engineering the Future","description":"Inker Robotics is a technology company building intelligent robotics, AI-powered solutions, experiential technology ecosystems, and future-ready education programs. Mission, vision, leadership, and journey.","about":{"@id":"https://inkerrobotics.com#organization"}},{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://inkerrobotics.com/"},{"@type":"ListItem","position":2,"name":"About Inker Robotics — Engineering the Future","item":"https://inkerrobotics.com/about"}]}];

import AboutClient from './AboutClient';

export default function Page() {
  return (
    <>
      {jsonLd.map((d, i) => <JsonLd key={i} data={d} />)}
      <AboutClient />
    </>
  );
}
