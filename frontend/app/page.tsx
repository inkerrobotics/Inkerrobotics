import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: "Inker Robotics — Engineering the Future with Robotics, AI & Intelligent Experiences",
  description: "Engineering intelligent robotics, AI-powered systems, experiential technology ecosystems, and future-ready education solutions. 6+ robotic deployments, 7+ AI solutions, 50,000+ students impacted.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Inker Robotics — Engineering the Future with Robotics, AI & Intelligent Experiences",
    description: "Engineering intelligent robotics, AI-powered systems, experiential technology ecosystems, and future-ready education solutions. 6+ robotic deployments, 7+ AI solutions, 50,000+ students impacted.",
    url: "/",
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: "Inker Robotics — Engineering the Future with Robotics, AI & Intelligent Experiences",
    description: "Engineering intelligent robotics, AI-powered systems, experiential technology ecosystems, and future-ready education solutions. 6+ robotic deployments, 7+ AI solutions, 50,000+ students impacted."
  }
};

const jsonLd: object[] = [{"@context":"https://schema.org","@type":"WebPage","@id":"https://inkerrobotics.com/#webpage","url":"https://inkerrobotics.com/","name":"Inker Robotics — Engineering the Future with Robotics, AI & Intelligent Experiences","description":"Engineering intelligent robotics, AI-powered systems, experiential technology ecosystems, and future-ready education solutions. 6+ robotic deployments, 7+ AI solutions, 50,000+ students impacted.","isPartOf":{"@id":"https://inkerrobotics.com#website"},"about":{"@id":"https://inkerrobotics.com#organization"},"inLanguage":"en-IN"},{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What does Inker Robotics do?","acceptedAnswer":{"@type":"Answer","text":"Inker Robotics builds intelligent robotics, AI-powered customer engagement systems, experiential technology ecosystems (RoboParks), and future-ready EduTech programs."}},{"@type":"Question","name":"What kinds of robots has Inker Robotics built?","acceptedAnswer":{"@type":"Answer","text":"Inker has built the Inker Alton humanoid robot, a robotic kiosk for Federal Bank, the Tholpava Kooth shadow-puppetry automation system, the RoboMaker phygital learning platform, and the Robotic Kunjiraman for Flowers TV."}},{"@type":"Question","name":"Does Inker Robotics offer AI solutions for businesses?","acceptedAnswer":{"@type":"Answer","text":"Yes. Inker offers WhatsApp-based digital lucky draws, AI-based physical spin wheels, robotic photo booths, customer engagement analytics, and WhatsApp-first customer management for restaurants, hospitals, hotels, and retail."}},{"@type":"Question","name":"What is a RoboPark?","acceptedAnswer":{"@type":"Answer","text":"A RoboPark is an experiential technology ecosystem envisioned by Inker Robotics that combines robotics, AI, innovation, education, and entertainment. It comes in three formats: RoboPark, RoboLand, and RoboLand Mini."}},{"@type":"Question","name":"Does Inker Robotics work with schools and colleges?","acceptedAnswer":{"@type":"Answer","text":"Yes. Through its EduTech vertical, Inker delivers workshops, internships, faculty development programs, add-on courses, Robo Clubs, Arduino Innovation Labs, and AI Centers of Excellence."}}]},{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://inkerrobotics.com/"},{"@type":"ListItem","position":2,"name":"Inker Robotics — Engineering the Future with Robotics, AI & Intelligent Experiences","item":"https://inkerrobotics.com/"}]}];
import HomeClient from './HomeClient';

export default function Page() {
  return (
    <>
      {jsonLd.map((d, i) => <JsonLd key={i} data={d} />)}
      <HomeClient />
    </>
  );
}
