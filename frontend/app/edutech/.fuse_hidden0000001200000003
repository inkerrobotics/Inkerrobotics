import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: "Future Skills for Students, Educators & Professionals",
  description: "Hands-on workshops, internships, faculty development programs, add-on courses, Robo Clubs, Arduino Innovation Labs, and AI Centers of Excellence by Inker Robotics for schools, colleges, and engineering institutions.",
  alternates: { canonical: "/edutech" },
  openGraph: {
    title: "Future Skills for Students, Educators & Professionals",
    description: "Hands-on workshops, internships, faculty development programs, add-on courses, Robo Clubs, Arduino Innovation Labs, and AI Centers of Excellence by Inker Robotics for schools, colleges, and engineering institutions.",
    url: "/edutech",
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: "Future Skills for Students, Educators & Professionals",
    description: "Hands-on workshops, internships, faculty development programs, add-on courses, Robo Clubs, Arduino Innovation Labs, and AI Centers of Excellence by Inker Robotics for schools, colleges, and engineering institutions."
  }
};

const jsonLd: object[] = [{"@context":"https://schema.org","@type":"OfferCatalog","name":"Future Skills for Students, Educators & Professionals","provider":{"@id":"https://inkerrobotics.com#organization"},"itemListElement":[{"@type":"Offer","position":1,"itemOffered":{"@type":"Service","name":"Robotics Workshops","description":"Hands-on workshops in robotics, AI, IoT, embedded systems, coding, and electronics.","provider":{"@id":"https://inkerrobotics.com#organization"}}},{"@type":"Offer","position":2,"itemOffered":{"@type":"Service","name":"Internship Programs","description":"Industry-oriented internships across robotics, AI, IoT, and product development.","provider":{"@id":"https://inkerrobotics.com#organization"}}},{"@type":"Offer","position":3,"itemOffered":{"@type":"Service","name":"Faculty Development Programs","description":"Faculty development on AI in education, robotics in learning, and digital tools.","provider":{"@id":"https://inkerrobotics.com#organization"}}},{"@type":"Offer","position":4,"itemOffered":{"@type":"Service","name":"Innovation Labs","description":"Arduino Innovation Lab and AI Center of Excellence setups for institutions.","provider":{"@id":"https://inkerrobotics.com#organization"}}},{"@type":"Offer","position":5,"itemOffered":{"@type":"Service","name":"Robo Clubs","description":"Long-term robotics communities for schools and colleges.","provider":{"@id":"https://inkerrobotics.com#organization"}}}]},{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://inkerrobotics.com/"},{"@type":"ListItem","position":2,"name":"Future Skills for Students, Educators & Professionals","item":"https://inkerrobotics.com/edutech"}]}];
import SolutionPage from '@/components/SolutionPage';

const SHOWCASE = [
    { title: 'Workshops', image: '/images/Edutech/Arduino innovation lab.png', description: 'Hands-on robotics and AI workshops delivered on campus — students build, break and rebuild real hardware rather than watching slides.', bullets: ['Delivered on campus', 'Hardware in every pair of hands', 'Scales from a class to a cohort'] },
    { title: 'Internships', image: '/images/Robotics/Robotics.png', description: 'Structured internships where students work alongside the engineering team on live robotics and AI projects.', bullets: ['Live project exposure', 'Mentored by working engineers', 'Portfolio-ready outcomes'] },
    { title: 'Innovation Labs', image: '/images/Edutech/Arduino innovation lab.png', description: 'Arduino Innovation Labs and AI Centers of Excellence — permanent on-campus facilities that give an institution its own build space.', bullets: ['Permanent campus installation', 'Equipment, curriculum and training', 'Ongoing institutional support'] },
    { title: 'Robo Clubs & FDPs', image: '/images/Edutech/AI Center of Excellence.png', description: 'Year-round Robo Clubs for students and faculty development programs that bring teaching staff up to speed on robotics and AI.', bullets: ['Continuous student engagement', 'Faculty upskilling', 'Add-on certified courses'] }
];

const SPECS = [
    { value: '200', suffix: 'K+', label: 'Students impacted' },
    { value: '500', suffix: '+', label: 'Technology programs' },
    { value: '1000', suffix: '+', label: 'Professionals trained' },
    { value: '200', suffix: '+', label: 'Technology expos' }
];

export default function Page() {
  return (
    <>
      {jsonLd.map((d, i) => <JsonLd key={i} data={d} />)}
      <SolutionPage
        ghost='LEARN'
        eyebrow='EduTech'
        title='FUTURE SKILLS, TAUGHT HANDS-ON'
        heroImage='/images/Edutech/Arduino innovation lab.png'
        heroStat={{ value: '200', suffix: 'K+', label: <>Students<br />impacted</> }}
        tabs={['PROGRAMS', 'LABS']}
        aboutEyebrow='About the practice'
        aboutTitle='LEARNING YOU CAN HOLD'
        aboutBody='Inker delivers workshops, internships, faculty development programs, add-on courses, Robo Clubs, Arduino Innovation Labs and AI Centers of Excellence to schools, colleges and engineering institutions — always with hardware in students’ hands.'
        aboutImage='/images/Edutech/AI Center of Excellence.png'
        showcaseTitle='OUR PROGRAMS'
        showcase={SHOWCASE}
        specs={SPECS}
        limitlessTitle='FUTURE TECH EXPO — ROBOTICS ON YOUR CAMPUS'
        limitlessTags={['Expo', 'Schools', 'Colleges']}
        limitlessImage='/images/Edutech/AI Center of Excellence.png'
        articleTitle='Bring the expo to the students'
        articleBody='The Future Tech Expo takes Inker’s robots, AI demonstrations and hands-on stations directly to schools and colleges — so an entire campus meets the technology in a single day.'
        diveTitle='START A PROGRAM'
        diveImage='/images/Edutech/Arduino innovation lab.png'
      />
    </>
  );
}
