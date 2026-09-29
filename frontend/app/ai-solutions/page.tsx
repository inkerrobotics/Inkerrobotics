import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: "AI-Powered Customer Engagement & Business Solutions",
  description: "WhatsApp-based digital lucky draw, AI-based physical spin wheel, robotic photo booth, customer analytics, and WhatsApp-first customer management systems for restaurants, hospitals, hotels, and retail.",
  alternates: { canonical: "/ai-solutions" },
  openGraph: {
    title: "AI-Powered Customer Engagement & Business Solutions",
    description: "WhatsApp-based digital lucky draw, AI-based physical spin wheel, robotic photo booth, customer analytics, and WhatsApp-first customer management systems for restaurants, hospitals, hotels, and retail.",
    url: "/ai-solutions",
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: "AI-Powered Customer Engagement & Business Solutions",
    description: "WhatsApp-based digital lucky draw, AI-based physical spin wheel, robotic photo booth, customer analytics, and WhatsApp-first customer management systems for restaurants, hospitals, hotels, and retail."
  }
};

const jsonLd: object[] = [{"@context":"https://schema.org","@type":"OfferCatalog","name":"AI-Powered Customer Engagement & Business Solutions","provider":{"@id":"https://inkerrobotics.com#organization"},"itemListElement":[{"@type":"Offer","position":1,"itemOffered":{"@type":"Service","name":"Digital Lucky Draw","description":"WhatsApp-based promotional lucky draw with customer data capture.","provider":{"@id":"https://inkerrobotics.com#organization"}}},{"@type":"Offer","position":2,"itemOffered":{"@type":"Service","name":"AI-Based Physical Spin Wheel","description":"In-store engagement spin wheel with customer data capture and analytics.","provider":{"@id":"https://inkerrobotics.com#organization"}}},{"@type":"Offer","position":3,"itemOffered":{"@type":"Service","name":"Robotic Photo Booth","description":"Branded photo experiences with social-media engagement and lead capture.","provider":{"@id":"https://inkerrobotics.com#organization"}}},{"@type":"Offer","position":4,"itemOffered":{"@type":"Service","name":"WhatsApp Customer Management","description":"WhatsApp-first CMS for restaurants, hospitals, hotels, and service businesses.","provider":{"@id":"https://inkerrobotics.com#organization"}}}]},{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://inkerrobotics.com/"},{"@type":"ListItem","position":2,"name":"AI-Powered Customer Engagement & Business Solutions","item":"https://inkerrobotics.com/ai-solutions"}]}];
import SolutionPage from '@/components/SolutionPage';

const SHOWCASE = [
    { title: 'Digital Lucky Draw', image: '/images/Al Solutions/Luckydraw.png', description: 'A WhatsApp-based digital lucky draw that captures customer data at the moment of engagement and feeds it straight into your campaign analytics.', bullets: ['WhatsApp-first entry flow', 'Automatic customer data capture', 'Live campaign analytics'] },
    { title: 'AI-Based Physical Spin Wheel', image: '/images/Al Solutions/Phygital.png', description: 'A phygital spin wheel that brings the excitement of a physical activation together with digital tracking, so every spin is a measurable interaction.', bullets: ['Physical hardware, digital tracking', 'Instant reward fulfilment', 'Built for events and retail floors'] },
    { title: 'Robotic Photo Booth', image: '/images/Al Solutions/Photobooth.png', description: 'An interactive robotic system for brand activations, events and exhibitions — memorable photo experiences, social sharing and customer data capture in one unit.', bullets: ['Branded photo experiences', 'Social media integration', 'Data capture at the point of delight'] },
    { title: 'WhatsApp-first CMS', image: '/images/Home/AI-Based Customer Management.png', description: 'Customer management systems built around WhatsApp for restaurants, hospitals, hotels and service businesses — automating enquiries, bookings, feedback and service workflows.', bullets: ['Automated enquiry and booking flows', 'Feedback and service workflows', 'Built for hospitality and healthcare'] }
];

const SPECS = [
    { value: '25', suffix: '+', label: 'AI solutions' },
    { value: '4', suffix: '', label: 'Core industries' },
    { value: '1', suffix: '', label: 'WhatsApp-first stack' },
    { value: '200', suffix: '+', label: 'Expos and activations' }
];

export default function Page() {
  return (
    <>
      {jsonLd.map((d, i) => <JsonLd key={i} data={d} />)}
      <SolutionPage
        ghost='AI'
        eyebrow='AI Solutions'
        title='ENGAGEMENT THAT ACTUALLY CONVERTS'
        heroImage='/images/Al Solutions/Luckydraw.png'
        heroStat={{ value: '25', suffix: '+', label: <>AI solutions<br />delivered</> }}
        tabs={['ENGAGEMENT', 'MANAGEMENT']}
        aboutEyebrow='About the practice'
        aboutTitle='CAPTURE, ENGAGE, ANALYSE'
        aboutBody='Inker builds AI-powered systems that turn footfall into data and data into repeat business — digital lucky draws, physical spin wheels, robotic photo booths and WhatsApp-first customer management for restaurants, hospitals, hotels and retail.'
        aboutImage='/images/Al Solutions/Phygital.png'
        showcaseTitle='OUR SOLUTIONS'
        showcase={SHOWCASE}
        specs={SPECS}
        limitlessTitle='FROM FOOTFALL TO FOLLOW-UP, AUTOMATICALLY'
        limitlessTags={['Analytics', 'WhatsApp', 'Phygital']}
        limitlessImage='/images/Home/AI-Based Customer Engagement.png'
        articleTitle='Every interaction becomes a data point'
        articleBody='Engagement is only half the job. Inker’s systems capture who engaged, what they chose and when — then hand your team a segmented list and a campaign dashboard instead of a pile of paper slips.'
        diveTitle='AUTOMATE YOUR ENGAGEMENT'
        diveImage='/images/Al Solutions/Photobooth.png'
      />
    </>
  );
}
