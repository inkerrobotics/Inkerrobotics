/**
 * Comprehensive Knowledge Base for Inker Robotics AI Chatbot.
 * Contains detailed information about the company, its verticals, deployments,
 * founders, leadership, educational initiatives, RoboParks, careers, and contact data.
 */

export interface InkerVertical {
  id: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  highlights: string[];
  keyOfferings: { title: string; desc: string; bullets?: string[] }[];
}

export interface InkerLeader {
  name: string;
  role: string;
  bio: string;
  photo?: string;
  linkedin?: string;
}

export interface InkerFAQ {
  id: string;
  category: 'company' | 'robotics' | 'ai' | 'edutech' | 'roboparks' | 'careers' | 'contact' | 'pricing';
  questions: string[];
  answer: string;
  suggestedActions?: { label: string; query?: string; url?: string }[];
}

export const COMPANY_INFO = {
  name: 'Inker Robotics (Inker Robotic Solutions Pvt Ltd)',
  tagline: 'Engineer the Future',
  vision: 'Improve lives beyond imagination with technology.',
  mission: 'Designing, developing, and delivering intelligent technology solutions that help people, businesses, and institutions move toward a smarter and more innovative future.',
  foundedYear: '2020',
  headquarters: 'Thrissur, Kerala, India',
  address: {
    line1: '29/164/73, 4th Floor, Suharsha Towers',
    street: 'Shornur Road, Thrissur',
    state: 'Kerala — 680001, India',
    full: 'Inker Robotic Solutions Pvt Ltd, 29/164/73, 4th Floor, Suharsha Towers, Shornur Road, Thrissur, Kerala — 680001',
  },
  contact: {
    email: 'info@inkerrobotics.com',
    supportEmail: 'hello@inkerrobotics.com',
    phone: '+91 90615 00800',
    workingHours: 'Monday – Friday, 9:00 AM – 6:30 PM IST',
    responseTime: 'Within 24 hours',
  },
  socialLinks: {
    linkedin: 'https://www.linkedin.com/company/inkerrobotics/',
    instagram: 'https://www.instagram.com/inkerrobotics',
    facebook: 'https://www.facebook.com/inkerrobotics',
    youtube: 'https://www.youtube.com/@inkerrobotics',
  },
  stats: {
    deployments: '12+ major robotic deployments',
    aiSolutions: '25+ AI engagement solutions',
    studentsImpacted: '200,000+ students impacted',
    programsDelivered: '500+ technology programs & workshops',
    professionalsTrained: '1,000+ industry professionals trained',
    exposDelivered: '200+ technology expos and activations',
    institutionsConnected: '50+ colleges, schools, and engineering institutes',
  },
  leadership: [
    {
      name: 'Rahul P B',
      role: 'Founder & Managing Director',
      bio: 'Visionary leader spearheading Inker Robotics since its inception in 2020, dedicated to building advanced robotics and AI engineering capabilities in India for global impact.',
      linkedin: 'https://www.linkedin.com/in/rahul-p-balachandran-8319b128',
    },
    {
      name: 'Amith Raman',
      role: 'Co-Founder & Chief Executive Officer (CEO)',
      bio: 'Co-Founder and executive leader directing business strategy, partner ecosystems, EduTech initiatives, and commercial deployments.',
      linkedin: 'https://www.linkedin.com/in/amith-raman-0b575a21',
    },
  ],
};

export const VERTICALS: Record<string, InkerVertical> = {
  robotics: {
    id: 'robotics',
    name: 'Robotics & Automation',
    tagline: 'Machines Built for the Real World',
    description: 'Custom robotics, automation systems, robotic kiosks, humanoid robots, and entertainment robotics engineered end-to-end in-house.',
    url: '/robotics',
    highlights: [
      'Full in-house mechanical, electronic, firmware, and AI control design',
      'Deployed in active banking branches, television studios, and heritage arts',
      'Available for direct sale or as Robot as a Service (RaaS) with zero CAPEX',
    ],
    keyOfferings: [
      {
        title: 'Inker Alton (Humanoid Robot)',
        desc: 'A flagship full-body humanoid robot developed 100% in-house by Inker. Features full-body articulation, natural voice and touch interaction, and an expressive robotic presence.',
        bullets: ['Full-body articulation', 'Voice, vision & touch interaction', 'Built and maintained in-house in Kerala'],
      },
      {
        title: 'Robotic Kiosk (Federal Bank)',
        desc: 'A branch-ready interactive robotic kiosk deployed for Federal Bank. Automates routine customer inquiries, guides banking visitors, and eliminates queues.',
        bullets: ['Deployed in a live commercial banking environment', 'Automates customer enquiry handling', 'Custom branded enclosure'],
      },
      {
        title: 'Tholpava Kooth Automation',
        desc: 'Kerala’s ancient shadow puppetry automated through high-precision robotics, preserving centuries-old cultural heritage through synchronized multi-puppet mechanical engineering. Extensively covered in regional and national press.',
        bullets: ['Cultural heritage preservation', 'Synchronized multi-puppet robotic control', 'National media recognition'],
      },
      {
        title: 'Robotic Kunjiraman',
        desc: 'A custom broadcast character robot engineered for Flowers TV, delivering expressive live on-air performances for television programming.',
        bullets: ['Engineered for live TV broadcast', 'High expressiveness & fluid movement', 'Broadcast-grade reliability'],
      },
      {
        title: 'Serving Robots & RoboDog',
        desc: 'Service robotics for hospitality, corporate events, and experiential marketing. Includes autonomous delivery serving robots and agile quadruped platforms (RoboDog).',
        bullets: ['Autonomous indoor navigation', 'Hospitality serving & guest greeting', 'Available on rental / RaaS'],
      },
      {
        title: 'Robot as a Service (RaaS)',
        desc: 'Flexible rental and deployment model for events, activations, product launches, and expos. Clients get the machine, trained operator, and full engineering support without large capital expense.',
        bullets: ['Zero upfront capital expense', 'Operator and technical support included', 'Perfect for events, launches and expos'],
      },
    ],
  },
  aiSolutions: {
    id: 'ai-solutions',
    name: 'AI Solutions & Customer Engagement',
    tagline: 'Engagement that Actually Converts',
    description: 'AI-powered platforms that transform footfall into verified customer data and repeat business through phygital and WhatsApp-first systems.',
    url: '/ai-solutions',
    highlights: [
      'WhatsApp-first architecture with zero app-download barrier',
      'Phygital hardware bridging tangible interaction with live analytics',
      'Deployed across restaurants, healthcare, hospitality, and retail',
    ],
    keyOfferings: [
      {
        title: 'Digital Lucky Draw',
        desc: 'A seamless WhatsApp-based digital lucky draw that captures verified customer contact info at the moment of peak engagement, feeding directly into campaign analytics.',
        bullets: ['Frictionless WhatsApp entry flow', 'Automatic customer phone/lead capture', 'Live campaign dashboard & analytics'],
      },
      {
        title: 'AI-Based Physical Spin Wheel (Phygital)',
        desc: 'An eye-catching physical spin wheel integrated with digital tracking and WhatsApp reward fulfillment, giving visitors tactile delight while capturing high-intent leads.',
        bullets: ['Physical mechanical wheel with digital sensors', 'Instant WhatsApp coupon/prize delivery', 'Ideal for retail stores and trade expos'],
      },
      {
        title: 'Robotic Photo Booth',
        desc: 'An automated interactive photo capture station for corporate activations, weddings, and expos. Offers custom branding, immediate digital sharing, and lead capture.',
        bullets: ['Branded instant photo experiences', 'Social media sharing & instant delivery', 'Customer opt-in data capture'],
      },
      {
        title: 'WhatsApp-First CMS',
        desc: 'Omnichannel customer management system built on WhatsApp for hospitals, restaurants, hotels, and service businesses. Automates bookings, menu browsing, feedback, and customer queries.',
        bullets: ['Automated booking & inquiry flows', 'Customer feedback & survey automation', 'Tailored for hospitality and healthcare'],
      },
    ],
  },
  edutech: {
    id: 'edutech',
    name: 'EduTech & Future Skills',
    tagline: 'Future Skills, Taught Hands-On',
    description: 'Future-ready technology education delivering hardware into students’ hands through campus labs, workshops, internships, and educator development.',
    url: '/edutech',
    highlights: [
      'Over 200,000+ students impacted across India',
      'Hardware-in-hand methodology — students build, test, and innovate',
      'Permanent campus labs and certified curricula for institutions',
    ],
    keyOfferings: [
      {
        title: 'Hands-On Robotics & AI Workshops',
        desc: 'Engaging on-campus workshops where students assemble, code, and control real robotics hardware, covering IoT, embedded electronics, AI, and microcontrollers.',
        bullets: ['Delivered directly on school/college campuses', 'Hardware provided for every student', 'Customized by grade and skill level'],
      },
      {
        title: 'Industry Internships & OJT Program',
        desc: 'Structured internships and On-the-Job Trainee (OJT) opportunities where students work alongside Inker’s core engineering team on live robotics and AI products.',
        bullets: ['Hands-on engineering mentorship', 'Real project portfolio building', 'Robotics, IoT, firmware, and web development tracks'],
      },
      {
        title: 'Arduino Innovation Labs & AI Centers of Excellence',
        desc: 'Turnkey institutional infrastructure setup. Inker installs state-of-the-art permanent labs on campus equipped with hardware, structured curricula, and educator training.',
        bullets: ['Permanent campus facility setup', 'Comprehensive multi-year curriculum', 'Continuous institutional support & kits'],
      },
      {
        title: 'Robo Clubs & Faculty Development Programs (FDP)',
        desc: 'Year-round student robotics clubs and specialized upskilling programs for school and college faculty on AI in education and robotics fundamentals.',
        bullets: ['Year-round student community building', 'Accredited faculty training and certifications', 'National robotics competition preparation'],
      },
      {
        title: 'Future Tech Expo',
        desc: 'A dynamic mobile technology exhibition brought directly to educational campuses, allowing thousands of students to experience humanoid robots, AI demos, and robotic arms in one day.',
        bullets: ['Mobile expo format brought to your campus', 'Live robotic demonstrations', 'Interactive hands-on tech stations'],
      },
    ],
  },
  roboparks: {
    id: 'roboparks',
    name: 'RoboParks (Experiential Ecosystems)',
    tagline: 'Experiential Technology Ecosystems',
    description: 'Immersive technology destinations uniting robotics, artificial intelligence, experiential entertainment, and hands-on learning under one roof.',
    url: '/roboparks',
    highlights: [
      'Three scalable formats: RoboPark, RoboLand, and RoboLand Mini',
      'Currently in active discussions with institutional, corporate, and tourism stakeholders',
      'Transforms public venues, malls, and theme parks into futuristic technology attractions',
    ],
    keyOfferings: [
      {
        title: 'RoboPark (Destination-Scale)',
        desc: 'Large-scale destination park featuring multi-zone robotics exhibits, humanoid stages, robotic dog agility arenas, and maker labs.',
        bullets: ['Destination-scale footprint', 'Multi-zone interactive robotic exhibits', 'Live demonstration and competition arenas'],
      },
      {
        title: 'RoboLand (City & Mall Scale)',
        desc: 'Mid-scale experiential center designed for urban shopping malls, prime commercial centers, and civic hubs.',
        bullets: ['Optimized for urban malls and civic centers', 'Modular interactive installations', 'Year-round commercial ticketed footfall'],
      },
      {
        title: 'RoboLand Mini (Compact & Portable)',
        desc: 'Rapidly deployable, modular setup suited for school campuses, pop-up events, and shorter-term retail activations.',
        bullets: ['Portable & fast setup', 'Low barrier to entry', 'Ideal for schools and temporary expos'],
      },
    ],
  },
};

export const INKER_FAQS: InkerFAQ[] = [
  // Company & General
  {
    id: 'company-overview',
    category: 'company',
    questions: [
      'who is inker robotics',
      'what is inker robotics',
      'tell me about inker robotics',
      'what does inker do',
      'company overview',
      'about inker',
    ],
    answer:
      `**Inker Robotics** is an Indian technology company headquartered in Thrissur, Kerala. Founded in 2020, Inker works at the cutting-edge intersection of **Robotics**, **Artificial Intelligence**, **Experiential Technology (RoboParks)**, and **EduTech**.\n\n` +
      `Guided by the mission **"Engineer the Future"**, Inker has deployed humanoids in public life, automated traditional arts, built AI customer engagement stacks for enterprises, and empowered over **200,000+ students** with hands-on hardware education.`,
    suggestedActions: [
      { label: 'Explore Robotics', query: 'What robots do you build?' },
      { label: 'AI Solutions', query: 'Tell me about AI solutions' },
      { label: 'EduTech Programs', query: 'What education programs do you offer?' },
      { label: 'Contact Info', query: 'Where is Inker Robotics located?' },
    ],
  },
  {
    id: 'founders-leadership',
    category: 'company',
    questions: [
      'who founded inker',
      'who is the founder',
      'who is the ceo',
      'who runs inker robotics',
      'leadership team',
      'rahul p b',
      'amith raman',
      'who are the leaders',
    ],
    answer:
      `Inker Robotics is led by:\n\n` +
      `• **Rahul P B** — Founder & Managing Director: Drives the engineering vision, robotics innovation, and core R&D.\n` +
      `• **Amith Raman** — Co-Founder & CEO: Leads corporate strategy, business expansion, EduTech growth, and commercial partnerships.\n\n` +
      `Supported by an in-house engineering team specializing in mechanical design, firmware, electronics, AI, and experiential software.`,
    suggestedActions: [
      { label: 'About Page', url: '/about' },
      { label: 'Contact Leadership', query: 'How do I contact Inker Robotics?' },
    ],
  },
  {
    id: 'company-location',
    category: 'contact',
    questions: [
      'where are you located',
      'where is inker robotics',
      'office address',
      'headquarters',
      'thrissur office',
      'kerala office',
      'visit inker',
    ],
    answer:
      `Inker Robotics is based in **Kerala, India**:\n\n` +
      `📍 **Office Address:**\n` +
      `Inker Robotic Solutions Pvt Ltd\n` +
      `4th Floor, Suharsha Towers, 29/164/73\n` +
      `Shornur Road, Thrissur, Kerala — 680001\n\n` +
      `• **Phone:** +91 90615 00800 (Mon–Fri, 9:00 AM – 6:30 PM IST)\n` +
      `• **Email:** info@inkerrobotics.com`,
    suggestedActions: [
      { label: 'Contact Page', url: '/contact' },
      { label: 'Book Consultation', query: 'I want to book a consultation' },
    ],
  },

  // Robotics & Deployments
  {
    id: 'robotics-general',
    category: 'robotics',
    questions: [
      'what robots do you make',
      'robotics services',
      'tell me about robotics',
      'custom robotics',
      'robot platforms',
      'robot solutions',
    ],
    answer:
      `Inker Robotics designs and builds hardware and software completely in-house. Our robotics offerings include:\n\n` +
      `1. **Inker Alton** — Flagship full-body humanoid robot with interactive voice, touch & movement.\n` +
      `2. **Robotic Kiosks** — Deployed at Federal Bank to automate customer desk inquiries.\n` +
      `3. **Tholpava Kooth Automation** — Robotic preservation of Kerala's heritage shadow puppetry.\n` +
      `4. **Robotic Kunjiraman** — Expressive broadcast character robot for Flowers TV.\n` +
      `5. **Serving Robots & RoboDog** — Autonomous hospitality delivery robots and quadruped platforms.\n` +
      `6. **Robot as a Service (RaaS)** — Flexible rentals with trained operators for events and expos.`,
    suggestedActions: [
      { label: 'Inker Alton', query: 'Tell me about Inker Alton' },
      { label: 'Federal Bank Kiosk', query: 'Tell me about the robotic kiosk' },
      { label: 'Puppetry Automation', query: 'Tell me about Tholpava Kooth automation' },
      { label: 'Rent a Robot (RaaS)', query: 'How does Robot as a Service work?' },
    ],
  },
  {
    id: 'inker-alton',
    category: 'robotics',
    questions: [
      'inker alton',
      'alton robot',
      'humanoid robot',
      'tell me about alton',
      'what is alton',
      'humanoid capabilities',
    ],
    answer:
      `**Inker Alton** is Inker Robotics' flagship humanoid robot platform, designed, fabricated, and programmed 100% in-house:\n\n` +
      `• **Full-Body Articulation:** Fluid mechanical gestures and expressive head, arm, and torso movements.\n` +
      `• **Interactive Human-Machine Interface:** Combines speech recognition, natural voice synthesis, and an integrated high-definition touch display.\n` +
      `• **Deployment Scenarios:** Enterprise reception, technology expos, experiential branding, educational showcases, and event hosting.\n` +
      `• **Built in India:** Demonstrates end-to-end indigenous mechatronics and AI robotics prowess.`,
    suggestedActions: [
      { label: 'Robotics Page', url: '/robotics' },
      { label: 'Book Alton for Event', query: 'Can I rent Alton for my event?' },
    ],
  },
  {
    id: 'federal-bank-kiosk',
    category: 'robotics',
    questions: [
      'federal bank',
      'bank kiosk',
      'robotic kiosk',
      'bank robot',
      'customer service robot',
    ],
    answer:
      `The **Inker Robotic Kiosk** was engineered and deployed for **Federal Bank** in a live branch environment:\n\n` +
      `• **Purpose:** Automates routine front-desk customer queries, navigation guidance, and banking process explanations.\n` +
      `• **Benefit:** Reduces counter wait times and queue congestion while creating a modern, tech-forward customer experience.\n` +
      `• **Custom Enclosure:** Tailored commercial-grade build with branded styling and intuitive touchscreen UI.`,
    suggestedActions: [
      { label: 'Custom Kiosks', query: 'Can you build a kiosk for my company?' },
      { label: 'Contact Sales', url: '/contact' },
    ],
  },
  {
    id: 'tholpava-kooth',
    category: 'robotics',
    questions: [
      'tholpava kooth',
      'shadow puppetry',
      'cultural robot',
      'puppet automation',
      'heritage robotics',
    ],
    answer:
      `**Tholpava Kooth Automation** is one of Inker's most celebrated cultural engineering projects:\n\n` +
      `• **What it is:** Kerala’s traditional shadow puppetry (Tholpava Kooth), dating back centuries, automated through synchronized multi-puppet robotic actuators.\n` +
      `• **Significance:** Preserves an ancient cultural art form by translating delicate human puppeteer wrist and finger movements into precise mechanical motions.\n` +
      `• **Recognition:** Featured widely across regional and national television, press, and cultural expos.`,
    suggestedActions: [
      { label: 'Robotics Showcase', url: '/robotics' },
    ],
  },
  {
    id: 'raas-rental',
    category: 'pricing',
    questions: [
      'robot as a service',
      'raas',
      'rent a robot',
      'hire a robot',
      'robot for event',
      'robot rental price',
      'pricing for robot',
      'how much does a robot cost',
    ],
    answer:
      `**Robot as a Service (RaaS)** from Inker allows businesses and event organizers to deploy cutting-edge robotics **without large capital expenditures (CAPEX)**:\n\n` +
      `• **What’s Included:** We supply the robot (Alton, Serving Robot, RoboDog, or custom activation), an experienced on-site operator/technician, and complete technical support.\n` +
      `• **Use Cases:** Trade expos, tech summits, product launches, corporate galas, weddings, and retail pop-ups.\n` +
      `• **Pricing:** Tailored according to duration, location, robot model, and custom branding requirements.\n\n` +
      `Would you like to get a customized quote or check availability for your dates?`,
    suggestedActions: [
      { label: 'Request a Quote', query: 'I want a quote for robot rental' },
      { label: 'Talk to Sales', url: '/contact' },
    ],
  },

  // AI Solutions
  {
    id: 'ai-solutions-general',
    category: 'ai',
    questions: [
      'ai solutions',
      'what ai solutions do you have',
      'customer engagement',
      'whatsapp marketing',
      'spin wheel',
      'lucky draw',
    ],
    answer:
      `Inker's **AI Solutions** vertical focuses on turning customer footfall into verified, repeat business through high-converting engagement tools:\n\n` +
      `1. **Digital Lucky Draw** — WhatsApp-first lucky draw capturing verified phone numbers and opt-in consent automatically.\n` +
      `2. **AI-Based Physical Spin Wheel** — Phygital wheel with real-time digital tracking and instant WhatsApp prize delivery.\n` +
      `3. **Robotic Photo Booth** — Interactive branded photo station with instant digital delivery and lead capture.\n` +
      `4. **WhatsApp-First CMS** — Automated booking, ordering, feedback, and customer management system for restaurants, hospitals, and hotels.`,
    suggestedActions: [
      { label: 'Digital Lucky Draw', query: 'How does the digital lucky draw work?' },
      { label: 'Phygital Spin Wheel', query: 'Tell me about the AI spin wheel' },
      { label: 'WhatsApp CMS', query: 'What is WhatsApp CMS?' },
      { label: 'AI Solutions Page', url: '/ai-solutions' },
    ],
  },
  {
    id: 'digital-lucky-draw',
    category: 'ai',
    questions: [
      'digital lucky draw',
      'whatsapp lucky draw',
      'how does lucky draw work',
      'lucky draw system',
    ],
    answer:
      `The **Digital Lucky Draw** replaces paper coupon slips with a friction-free digital workflow:\n\n` +
      `• **How it works:** Customers scan a QR code at your store, restaurant, or booth, opening an interactive WhatsApp conversation to enter the draw.\n` +
      `• **Zero Friction:** No app installation required; works on any smartphone with WhatsApp.\n` +
      `• **100% Verified Data:** Captures verified mobile numbers with explicit marketing consent.\n` +
      `• **Analytics Dashboard:** Gives your marketing team segmented lead lists, entry timestamps, and campaign ROI in real time.`,
    suggestedActions: [
      { label: 'Spin Wheel', query: 'Tell me about the AI spin wheel' },
      { label: 'Request Demo', query: 'I want a demo of AI solutions' },
    ],
  },
  {
    id: 'phygital-spin-wheel',
    category: 'ai',
    questions: [
      'spin wheel',
      'ai spin wheel',
      'physical spin wheel',
      'phygital',
    ],
    answer:
      `The **AI-Based Physical Spin Wheel** is a "phygital" innovation bridging the physical and digital worlds:\n\n` +
      `• **Tactile Excitement:** Customers spin a physical, visually captivating arcade-style wheel in your retail store, mall, or expo booth.\n` +
      `• **Smart Automation:** Sensors track the exact winning segment and instantly dispatch the discount code, coupon, or gift voucher directly to the customer's WhatsApp.\n` +
      `• **Data Capture:** Guarantees verified customer phone numbers and high excitement without paper coupons or manual logging.`,
    suggestedActions: [
      { label: 'Robotic Photo Booth', query: 'Tell me about the robotic photo booth' },
      { label: 'Get Pricing', url: '/contact' },
    ],
  },
  {
    id: 'whatsapp-cms',
    category: 'ai',
    questions: [
      'whatsapp cms',
      'whatsapp customer management',
      'customer management system',
      'crm for whatsapp',
    ],
    answer:
      `Inker’s **WhatsApp-First Customer Management System (CMS)** is engineered specifically for hospitality, healthcare, and retail:\n\n` +
      `• **Healthcare & Hospitals:** Automated appointment booking, department navigation, report dispatch, and doctor consultation reminders.\n` +
      `• **Hotels & Restaurants:** Digital menu access, table reservations, feedback surveys, and automated loyalty rewards.\n` +
      `• **Enterprise Support:** Intelligent routing of complex queries to staff while automating standard FAQs 24/7 on WhatsApp.`,
    suggestedActions: [
      { label: 'Healthcare CMS', query: 'I want to book a consultation' },
      { label: 'Hospitality CMS', query: 'I want to book a consultation' },
    ],
  },

  // EduTech
  {
    id: 'edutech-general',
    category: 'edutech',
    questions: [
      'edutech',
      'education programs',
      'robotics workshop',
      'stem education',
      'what courses do you offer',
      'training programs',
    ],
    answer:
      `Inker Robotics' **EduTech vertical** is dedicated to future skills development with hands-on hardware training. Impact to date: **200,000+ students** and **500+ programs**!\n\n` +
      `Key educational initiatives:\n` +
      `1. **Hands-on Workshops** — Robotics, AI, IoT, embedded C, and coding for schools & engineering colleges.\n` +
      `2. **Arduino Innovation Labs & AI Centers of Excellence** — Permanent turnkey labs set up directly on campus.\n` +
      `3. **Robo Clubs** — Year-round student robotics community programs.\n` +
      `4. **Internships & OJT** — Real-world engineering internships working alongside Inker's R&D engineers.\n` +
      `5. **Faculty Development Programs (FDP)** — Equipping educators with modern AI & robotics pedagogical skills.\n` +
      `6. **Future Tech Expo** — On-campus mobile robotics exhibition.`,
    suggestedActions: [
      { label: 'Campus Labs', query: 'Tell me about Arduino Innovation Labs' },
      { label: 'Student Internships', query: 'How can I apply for an internship?' },
      { label: 'Future Tech Expo', query: 'Tell me about Future Tech Expo' },
      { label: 'EduTech Page', url: '/edutech' },
    ],
  },
  {
    id: 'innovation-labs',
    category: 'edutech',
    questions: [
      'arduino innovation lab',
      'ai center of excellence',
      'innovation lab',
      'setup lab in college',
      'school robotics lab',
    ],
    answer:
      `Inker’s **Arduino Innovation Labs & AI Centers of Excellence** are turnkey physical build spaces installed directly on your campus:\n\n` +
      `• **Equipment Provided:** Microcontrollers, sensors, robotic chassis, 3D printers, IoT kits, and electronics testing gear.\n` +
      `• **Curriculum & Pedagogy:** Year-round certified syllabus aligned with modern industry and STEM standards.\n` +
      `• **Educator Training:** Extensive Faculty Development Programs so teachers can mentor student innovators.\n` +
      `• **Competition Mentorship:** Preparing student cohorts for national and international robotics olympiads and hackathons.`,
    suggestedActions: [
      { label: 'Partner with Inker', query: 'How can our institution partner with Inker?' },
      { label: 'Contact EduTech', url: '/contact' },
    ],
  },
  {
    id: 'internships-ojt',
    category: 'careers',
    questions: [
      'internship',
      'internships',
      'ojt',
      'on the job training',
      'student training',
      'apply for internship',
    ],
    answer:
      `Inker Robotics offers high-impact **Internships** and an **On-the-Job Trainee (OJT) Program**:\n\n` +
      `• **Real Projects:** Interns do not shadow from the sidelines — you work hands-on with mechanical design, firmware, PCB layout, AI computer vision, or software development.\n` +
      `• **Mentorship:** Guided daily by working robotics engineers who build machines that deploy to real-world clients.\n` +
      `• **Who can apply:** Engineering and polytechnic students (ECE, EEE, Mech, CS, Robotics) and passionate tech enthusiasts.\n\n` +
      `You can apply directly via our Careers page or submit your details right here in the chat!`,
    suggestedActions: [
      { label: 'Apply for Internship', query: 'I want to apply for an internship' },
      { label: 'Careers Page', url: '/careers' },
    ],
  },

  // RoboParks
  {
    id: 'roboparks-general',
    category: 'roboparks',
    questions: [
      'what is robopark',
      'roboparks',
      'roboland',
      'roboland mini',
      'theme park',
      'experiential park',
    ],
    answer:
      `**RoboParks** is Inker Robotics' grand vision for immersive experiential technology destinations that bring robotics, AI, hands-on learning, and family entertainment together under one roof.\n\n` +
      `Three Scalable Formats:\n` +
      `1. **RoboPark (Destination-Scale):** Large-scale tourist/city attraction featuring multiple interactive technology zones, humanoid stages, robotic dog agility arenas, and maker labs.\n` +
      `2. **RoboLand (City & Mall Scale):** Contained urban footprint suited for major shopping malls, campus hubs, and civic entertainment centers.\n` +
      `3. **RoboLand Mini (Compact & Portable):** Modular, easily transportable installations for schools, expos, and short-term festivals.\n\n` +
      `*Status:* Currently in active stakeholder, government, and investor discussions.`,
    suggestedActions: [
      { label: 'Partner on RoboParks', query: 'How can I partner on RoboParks?' },
      { label: 'RoboParks Page', url: '/roboparks' },
    ],
  },

  // Careers
  {
    id: 'careers-general',
    category: 'careers',
    questions: [
      'careers',
      'job openings',
      'hiring',
      'work at inker',
      'open roles',
      'jobs in kerala',
      'robotics engineer jobs',
    ],
    answer:
      `Inker Robotics is actively growing its engineering and technology team in **Kerala, India**!\n\n` +
      `**Active Openings:**\n` +
      `• **Robotics Engineer (Full-time):** Mechanical design, electronics, sensors, motor drivers, and control systems for humanoid and service robotics.\n` +
      `• **AI Solutions Developer (Full-time):** Full-stack and Python development for WhatsApp-first customer engagement platforms and analytics.\n` +
      `• **OJT Trainees & Interns:** Hands-on hardware prototyping, embedded systems, and STEM education delivery.\n\n` +
      `**Culture:** We build real machines that ship. You touch hardware and software from day one in a cross-functional environment.`,
    suggestedActions: [
      { label: 'Careers Page', url: '/careers' },
      { label: 'Submit Application', query: 'I want to submit my resume' },
    ],
  },

  // Contact & Inquiries
  {
    id: 'contact-sales',
    category: 'contact',
    questions: [
      'how to contact inker',
      'contact number',
      'email address',
      'sales inquiry',
      'book a demo',
      'talk to human',
      'speak to representative',
      'get in touch',
    ],
    answer:
      `You can reach Inker Robotics directly through any of these channels:\n\n` +
      `• **Phone:** +91 90615 00800 (Mon–Fri, 9:00 AM – 6:30 PM IST)\n` +
      `• **Email:** info@inkerrobotics.com or hello@inkerrobotics.com\n` +
      `• **Office:** Suharsha Towers, Shornur Road, Thrissur, Kerala — 680001\n` +
      `• **Response Time:** We reply to all inquiries within 24 hours.\n\n` +
      `Or if you prefer, I can collect your details right here and have our team call you back!`,
    suggestedActions: [
      { label: 'Quick Inquiry Form', query: 'I want to submit an inquiry' },
      { label: 'Contact Page', url: '/contact' },
    ],
  },
];
