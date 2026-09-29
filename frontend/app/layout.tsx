// The reference site's own stylesheets, in its own load order.
import './globals.css';
import './cinematic.css';
import './home.css';
import './service.css';
// Inker-specific additions layered on top.
import './inker.css';
import './admin.css';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import AppShell from '@/components/AppShell';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://inkerrobotics.com';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Inker Robotics — Robotics, AI, Experiential Tech & EduTech',
    template: '%s · Inker Robotics'
  },
  description:
    'Inker Robotics builds intelligent robotics, AI-powered customer engagement systems, RoboParks experiential ecosystems, and future-ready EduTech programs for schools, colleges, and businesses.',
  keywords: [
    'Inker Robotics', 'robotics company India', 'humanoid robot', 'robotic kiosk',
    'AI customer engagement', 'WhatsApp lucky draw', 'spin wheel marketing',
    'RoboPark', 'RoboLand', 'robotics workshop', 'AI internship',
    'innovation lab schools', 'Robo Club', 'STEM education India',
    'Tholpava Kooth automation', 'Inker Alton humanoid'
  ],
  authors: [{ name: 'Inker Robotics' }],
  creator: 'Inker Robotics',
  publisher: 'Inker Robotics',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'Inker Robotics',
    title: 'Inker Robotics — Engineering the Future with Robotics, AI & Intelligent Experiences',
    description:
      'Engineering intelligent robotics, AI-powered systems, experiential technology ecosystems, and future-ready education solutions.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Inker Robotics' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Inker Robotics — Engineering the Future',
    description:
      'Robotics, AI, experiential technology, and future-ready EduTech — built by Inker Robotics.',
    images: ['/og.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 }
  },
  icons: { icon: '/title logo.webp', apple: '/title logo.webp' }
};

export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1
};

const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}#organization`,
  name: 'Inker Robotics',
  alternateName: 'Inker',
  url: SITE_URL,
  logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png`, width: 512, height: 512 },
  description:
    'Inker Robotics is a technology company building intelligent robotics, AI-powered solutions, experiential technology ecosystems, and future-ready education programs.',
  foundingDate: '2020',
  slogan: 'Engineer the Future.',
  knowsAbout: [
    'Robotics', 'Artificial Intelligence', 'Humanoid Robots',
    'Robotic Automation', 'Robotic Kiosks', 'Customer Engagement Analytics',
    'WhatsApp Marketing', 'Experiential Technology', 'STEM Education',
    'Innovation Labs', 'Embedded Systems', 'IoT'
  ],
  contactPoint: [{
    '@type': 'ContactPoint',
    contactType: 'sales',
    email: 'hello@inkerrobotics.com',
    availableLanguage: ['English']
  }],
  sameAs: [
    'https://www.linkedin.com/company/inker-robotics',
    'https://www.instagram.com/inkerrobotics',
    'https://www.youtube.com/@inkerrobotics'
  ]
};

const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}#website`,
  url: SITE_URL,
  name: 'Inker Robotics',
  publisher: { '@id': `${SITE_URL}#organization` },
  inLanguage: 'en-IN'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <JsonLd data={organizationLd} />
        <JsonLd data={websiteLd} />
        <noscript>
          <style>{`.reveal { opacity: 1 !important; transform: none !important; } .page-transition { animation: none !important; }`}</style>
        </noscript>
      </head>
      <body>
        <AppShell>
          {children}
          <Footer />
        </AppShell>
      </body>
    </html>
  );
}
