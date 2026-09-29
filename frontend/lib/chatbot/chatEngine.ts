import {
  COMPANY_INFO,
  VERTICALS,
  INKER_FAQS,
  InkerFAQ,
} from './knowledgeBase';

export interface ChatAction {
  label: string;
  query?: string;
  url?: string;
  isLeadForm?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user' | 'system';
  text: string;
  timestamp: number;
  actions?: ChatAction[];
  isLeadForm?: boolean;
  leadSubmitted?: boolean;
}

export interface LeadSubmission {
  name: string;
  contact: string; // phone or email
  interest: string;
  message?: string;
}

/**
 * Normalizes text for matching: converts to lower case, removes special characters.
 */
function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generates an initial welcoming greeting message for new visitors.
 */
export function getInitialBotMessage(): ChatMessage {
  return {
    id: 'welcome-msg',
    sender: 'bot',
    text:
      `**Welcome to Inker Robotics.**\n\n` +
      `How can I assist you today? Ask me about our robotics platforms, AI customer solutions, EduTech programs, or request a consultation.`,
    timestamp: Date.now(),
    actions: [
      { label: 'Robotics & Alton', query: 'Tell me about your robots' },
      { label: 'AI Solutions', query: 'What AI solutions do you provide?' },
      { label: 'EduTech & Labs', query: 'Tell me about EduTech and Labs' },
      { label: 'RoboParks Vision', query: 'What is RoboPark?' },
      { label: 'Office & Contact', query: 'Where is Inker located and how to contact?' },
      { label: 'Request Quote / Demo', query: 'I want to request a quote', isLeadForm: true },
    ],
  };
}

/**
 * Core query matching engine. Matches user message against knowledge base,
 * specific intents, keywords, or triggers lead capture.
 */
export function processUserQuery(input: string): {
  replyText: string;
  actions?: ChatAction[];
  isLeadForm?: boolean;
} {
  const query = normalize(input);
  const words = query.split(' ').filter(Boolean);

  if (!query) {
    return {
      replyText: "I'm listening! Please feel free to ask anything about Inker Robotics, our robots, AI systems, or programs.",
      actions: [
        { label: 'Our Robots', query: 'What robots do you build?' },
        { label: 'AI Solutions', query: 'Tell me about AI solutions' },
        { label: 'Contact Info', query: 'How to contact Inker?' },
      ],
    };
  }

  // 1. Check for Lead / Demo / Contact Intent
  const leadIntentRegex = /\b(hire|rent|quote|price|pricing|cost|buy|book|demo|callback|call me|consultation|talk to sales|human|representative|quotation|inquiry)\b/i;
  if (leadIntentRegex.test(query) && (words.length <= 6 || query.includes('quote') || query.includes('demo') || query.includes('call') || query.includes('hire'))) {
    return {
      replyText:
        `I would be glad to connect you with our engineering and solutions team!\n\n` +
        `You can provide your details using the quick card below, or reach us directly at:\n` +
        `• **Phone:** ${COMPANY_INFO.contact.phone}\n` +
        `• **Email:** ${COMPANY_INFO.contact.email}\n` +
        `• **Response:** Within 24 hours guaranteed.`,
      actions: [
        { label: 'Submit Inquiry', isLeadForm: true },
        { label: 'Contact Page', url: '/contact' },
        { label: 'Inker Alton', query: 'Tell me about Inker Alton' },
      ],
      isLeadForm: true,
    };
  }

  // 2. Greetings
  const greetingRegex = /^(hi|hello|hey|greetings|vanakkam|namaste|good morning|good afternoon|good evening|sup|hola|yo)\b/i;
  if (greetingRegex.test(query) && words.length <= 3) {
    return {
      replyText:
        `Hello! Great to have you here. I can tell you all about **Inker Robotics** — from our flagship humanoid **Alton**, **Federal Bank Kiosk**, and **AI Engagement tools** to our **EduTech Labs** and **RoboParks**.\n\n` +
        `What can I assist you with today?`,
      actions: [
        { label: 'What robots do you make?', query: 'What robots do you make?' },
        { label: 'AI Solutions & Spin Wheel', query: 'Tell me about AI solutions' },
        { label: 'Student Programs & Labs', query: 'Tell me about EduTech programs' },
        { label: 'Office & Location', query: 'Where is Inker located?' },
      ],
    };
  }

  // 3. Small talk & identity
  if (
    query.includes('who are you') ||
    query.includes('what are you') ||
    query.includes('what can you do') ||
    query.includes('who made you') ||
    query.includes('who built you')
  ) {
    return {
      replyText:
        `I am **Inker Assistant**, the AI guide for **Inker Robotics**!\n\n` +
        `I have complete knowledge of Inker's:\n` +
        `• **Robotic systems:** Inker Alton, Federal Bank Kiosk, Tholpava Kooth automation, Robotic Kunjiraman, and RaaS (Robot as a Service).\n` +
        `• **AI & Customer Engagement:** WhatsApp lucky draw, phygital spin wheel, robotic photo booth, and WhatsApp CMS.\n` +
        `• **EduTech:** Workshops, internships, Arduino Innovation Labs, AI Centers of Excellence, and Robo Clubs.\n` +
        `• **RoboParks:** Destination, city, and portable experiential technology formats.\n` +
        `• **Company details:** Leadership, headquarters in Kerala, career openings, and contact channels.`,
      actions: [
        { label: 'Inker Alton', query: 'Tell me about Inker Alton' },
        { label: 'AI Solutions', query: 'Tell me about AI solutions' },
        { label: 'Leadership', query: 'Who is the founder and CEO?' },
      ],
    };
  }

  // 4. Thanks & gratitude
  if (/^(thank you|thanks|thx|awesome|great|cool|perfect|got it|super)\b/i.test(query) && words.length <= 4) {
    return {
      replyText: `You are very welcome! If there's anything else you need about our robots, AI solutions, or programs, just let me know. Engineer the future!`,
      actions: [
        { label: 'Robotics', url: '/robotics' },
        { label: 'Contact', url: '/contact' },
        { label: 'Request Quote', isLeadForm: true },
      ],
    };
  }

  // 5. Check Knowledge Base FAQs by scoring
  let bestFaq: InkerFAQ | null = null;
  let highestScore = 0;

  for (const faq of INKER_FAQS) {
    for (const q of faq.questions) {
      const normalizedQ = normalize(q);
      const qWords = normalizedQ.split(' ').filter(Boolean);

      // Exact phrase match
      if (query.includes(normalizedQ) || normalizedQ.includes(query)) {
        const score = 100 + normalizedQ.length;
        if (score > highestScore) {
          highestScore = score;
          bestFaq = faq;
        }
        continue;
      }

      // Word overlap score
      let matchCount = 0;
      for (const w of words) {
        if (w.length > 2 && qWords.includes(w)) {
          matchCount++;
        }
      }

      if (matchCount > 0) {
        const score = (matchCount / Math.max(words.length, qWords.length)) * 80 + matchCount * 10;
        if (score > highestScore) {
          highestScore = score;
          bestFaq = faq;
        }
      }
    }
  }

  // Check specific high-priority keywords
  if (query.includes('alton')) {
    const altonFaq = INKER_FAQS.find((f) => f.id === 'inker-alton');
    if (altonFaq) return { replyText: altonFaq.answer, actions: altonFaq.suggestedActions };
  }
  if (query.includes('federal') || (query.includes('bank') && query.includes('kiosk'))) {
    const kioskFaq = INKER_FAQS.find((f) => f.id === 'federal-bank-kiosk');
    if (kioskFaq) return { replyText: kioskFaq.answer, actions: kioskFaq.suggestedActions };
  }
  if (query.includes('puppetry') || query.includes('tholpava') || query.includes('kooth')) {
    const puppetFaq = INKER_FAQS.find((f) => f.id === 'tholpava-kooth');
    if (puppetFaq) return { replyText: puppetFaq.answer, actions: puppetFaq.suggestedActions };
  }
  if (query.includes('spin wheel') || query.includes('phygital')) {
    const spinFaq = INKER_FAQS.find((f) => f.id === 'phygital-spin-wheel');
    if (spinFaq) return { replyText: spinFaq.answer, actions: spinFaq.suggestedActions };
  }
  if (query.includes('lucky draw') || query.includes('draw')) {
    const drawFaq = INKER_FAQS.find((f) => f.id === 'digital-lucky-draw');
    if (drawFaq) return { replyText: drawFaq.answer, actions: drawFaq.suggestedActions };
  }
  if (query.includes('arduino') || query.includes('center of excellence') || (query.includes('lab') && query.includes('school'))) {
    const labFaq = INKER_FAQS.find((f) => f.id === 'innovation-labs');
    if (labFaq) return { replyText: labFaq.answer, actions: labFaq.suggestedActions };
  }
  if (query.includes('intern') || query.includes('ojt') || query.includes('training')) {
    const internFaq = INKER_FAQS.find((f) => f.id === 'internships-ojt');
    if (internFaq) return { replyText: internFaq.answer, actions: internFaq.suggestedActions };
  }
  if (query.includes('rahul') || query.includes('amith') || query.includes('founder') || query.includes('ceo') || query.includes('director')) {
    const leaderFaq = INKER_FAQS.find((f) => f.id === 'founders-leadership');
    if (leaderFaq) return { replyText: leaderFaq.answer, actions: leaderFaq.suggestedActions };
  }
  if (query.includes('address') || query.includes('location') || query.includes('thrissur') || query.includes('where is')) {
    const locFaq = INKER_FAQS.find((f) => f.id === 'company-location');
    if (locFaq) return { replyText: locFaq.answer, actions: locFaq.suggestedActions };
  }
  if (query.includes('hire') || query.includes('rent') || query.includes('raas')) {
    const raasFaq = INKER_FAQS.find((f) => f.id === 'raas-rental');
    if (raasFaq) return { replyText: raasFaq.answer, actions: raasFaq.suggestedActions };
  }
  if (query.includes('robopark') || query.includes('roboland')) {
    const parkFaq = INKER_FAQS.find((f) => f.id === 'roboparks-general');
    if (parkFaq) return { replyText: parkFaq.answer, actions: parkFaq.suggestedActions };
  }
  if (query.includes('job') || query.includes('career') || query.includes('hiring') || query.includes('vacancy')) {
    const careerFaq = INKER_FAQS.find((f) => f.id === 'careers-general');
    if (careerFaq) return { replyText: careerFaq.answer, actions: careerFaq.suggestedActions };
  }

  // If match score is sufficient
  if (bestFaq && highestScore >= 35) {
    return {
      replyText: bestFaq.answer,
      actions: bestFaq.suggestedActions,
    };
  }

  // 6. Generic vertical check
  if (query.includes('robot') || query.includes('hardware') || query.includes('automation') || query.includes('machine')) {
    const v = VERTICALS.robotics;
    return {
      replyText:
        `**${v.name}**\n*${v.tagline}*\n\n${v.description}\n\n` +
        `**Key Highlights:**\n` +
        v.highlights.map((h) => `• ${h}`).join('\n') +
        `\n\nNotable creations include the **Inker Alton** humanoid, **Federal Bank Kiosk**, and **Tholpava Kooth** puppetry automation.`,
      actions: [
        { label: 'Inker Alton', query: 'Tell me about Inker Alton' },
        { label: 'Robot as a Service', query: 'How does Robot as a Service work?' },
        { label: 'Robotics Page', url: '/robotics' },
      ],
    };
  }

  if (query.includes('ai') || query.includes('customer') || query.includes('whatsapp') || query.includes('marketing')) {
    const v = VERTICALS.aiSolutions;
    return {
      replyText:
        `**${v.name}**\n*${v.tagline}*\n\n${v.description}\n\n` +
        `**Key Solutions:**\n` +
        `• **Digital Lucky Draw:** WhatsApp-based lead capture during promotional campaigns.\n` +
        `• **AI Physical Spin Wheel:** Tactile physical arcade wheel with digital WhatsApp coupon delivery.\n` +
        `• **Robotic Photo Booth:** Automated social sharing and lead gathering for events.\n` +
        `• **WhatsApp CMS:** Tailored CRM/booking system for hospitals, restaurants, and retail.`,
      actions: [
        { label: 'Digital Lucky Draw', query: 'How does digital lucky draw work?' },
        { label: 'Phygital Spin Wheel', query: 'Tell me about AI spin wheel' },
        { label: 'AI Solutions Page', url: '/ai-solutions' },
      ],
    };
  }

  if (query.includes('edutech') || query.includes('student') || query.includes('school') || query.includes('college') || query.includes('workshop')) {
    const v = VERTICALS.edutech;
    return {
      replyText:
        `**${v.name}**\n*${v.tagline}*\n\n${v.description}\n\n` +
        `We have impacted over **200,000+ students** and **1,000+ professionals** through:\n` +
        `• Hands-on robotics, AI, and IoT workshops\n` +
        `• Turnkey **Arduino Innovation Labs** and **AI Centers of Excellence**\n` +
        `• Student Robo Clubs & Faculty Development Programs (FDP)\n` +
        `• Live industry internships and On-the-Job Trainee (OJT) opportunities.`,
      actions: [
        { label: 'Campus Labs Setup', query: 'Tell me about Arduino Innovation Labs' },
        { label: 'Internships & OJT', query: 'How can I apply for an internship?' },
        { label: 'EduTech Page', url: '/edutech' },
      ],
    };
  }

  // 7. Intelligent Fallback with broad suggestions
  return {
    replyText:
      `I want to make sure you get the exact information you're looking for about **Inker Robotics**!\n\n` +
      `Here are the most popular topics I can help you with right away:\n` +
      `• **Robotics:** Inker Alton humanoid, Federal Bank robotic kiosk, cultural shadow puppetry, RoboDog & RaaS rentals.\n` +
      `• **AI Solutions:** WhatsApp digital lucky draws, physical spin wheels, robotic photo booths, and customer management systems.\n` +
      `• **EduTech:** Robotics workshops, college Arduino Innovation Labs, AI Centers of Excellence, and student internships.\n` +
      `• **RoboParks:** Immersive destination-scale and urban experiential technology ecosystems.\n` +
      `• **Contact:** Phone (+91 90615 00800), email, and office location in Thrissur, Kerala.\n\n` +
      `What would you like to know more about?`,
    actions: [
      { label: 'Inker Alton & Robots', query: 'Tell me about Inker Alton' },
      { label: 'AI & WhatsApp Marketing', query: 'Tell me about AI solutions' },
      { label: 'EduTech & Campus Labs', query: 'Tell me about EduTech' },
      { label: 'Request Callback / Quote', isLeadForm: true },
      { label: 'Contact Details', query: 'How do I contact Inker?' },
    ],
  };
}
