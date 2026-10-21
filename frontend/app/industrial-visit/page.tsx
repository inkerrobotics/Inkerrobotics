import JsonLd from '@/components/JsonLd';
import PageMotion from '@/components/PageMotion';
import IVEnquiryForm from '@/components/IVEnquiryForm';

/*
 * Industrial Visit — Phase 1 link page.
 *
 * Every IV enquiry (email auto-reply, phone call, website button, exhibition QR)
 * is sent to this one page. It does the explaining; the form at the bottom
 * collects the details once; our team then calls within one working day.
 *
 * Everything editable lives in the constants below. Items marked TODO are
 * not yet signed off — fill them in before launch.
 */

const TITLE = 'Industrial Visit to Inker Robotics — Packages, Meals & Booking';
const DESCRIPTION =
  'Plan a college Industrial Visit to Inker Robotics, Thrissur. Three visit packages from ₹199 per student, meal options, how booking works, and a short enquiry form — we call you back within one working day.';

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/industrial-visit' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: '/industrial-visit', type: 'website' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

const PHONE_DISPLAY = '+91 90615 00800';
const PHONE_TEL = '+919061500800';
const EMAIL = 'info@inkerrobotics.com';
// TODO: confirm office hours for the callback promise (decision #2 in the Phase 1 plan).
const OFFICE_HOURS = 'Mon–Sat · 9:30 AM – 6:00 PM IST';

const ZONES = [
  ['Industrial arms & cobots', 'Industrial robot arms and collaborative robots working up close.'],
  ['AI & computer vision', 'Systems that see, recognise and respond — demonstrated live.'],
  ['IoT', 'Connected sensors and devices, and how they talk to each other.'],
  ['Drones', 'Flight platforms and the electronics that keep them in the air.'],
  ['3D printing & rapid prototyping', 'How an idea becomes a physical part in hours.'],
  ['AR & VR', 'Immersive experiences students can step into themselves.'],
];

// An inclusion is a line, or a line with sub-points beneath it.
type Inclusion = string | { text: string; sub: string[] };
const PACKAGES: {
  name: string;
  title: string;
  duration: string;
  price: number;
  bestFor: string;
  tone: 'grey' | 'blue' | 'orange';
  inclusions: Inclusion[];
}[] = [
  {
    name: 'Option 1',
    title: 'Foundational Package',
    duration: '2 hours',
    price: 199,
    bestFor: 'Technology awareness & industry exposure',
    tone: 'grey',
    inclusions: [
      'Guided walkthrough of different technology zones',
      'Introduction to Robotics, AI, IoT & Automation',
      'Live technology demonstrations',
      'Industry-oriented exposure',
    ],
  },
  {
    name: 'Option 2',
    title: 'IV + Hands-on Workshop',
    duration: '3.5 hours',
    price: 499,
    bestFor: 'Exposure + practical learning',
    tone: 'blue',
    inclusions: [
      '2-hour Industrial Visit',
      'Walkthrough of technology zones',
      {
        text: '1.5-hour Hands-on Workshop',
        sub: ['Choose from AI / Hardware', 'Practical learning with guided activities'],
      },
    ],
  },
  {
    name: 'Option 3',
    title: 'IV + Extended Hands-on Workshop',
    duration: '5 hours',
    price: 799,
    bestFor: 'Immersive industry exposure + in-depth learning',
    tone: 'orange',
    inclusions: [
      '2-hour Industrial Visit',
      'Walkthrough of technology zones',
      {
        text: '3-hour Extended Hands-on Workshop',
        sub: ['Choose from AI / Hardware', 'Deeper practical engagement & project-oriented learning'],
      },
    ],
  },
];

// TODO: list every item on the plate for each meal option.
const MEALS: { name: string; price: string; items: string[] }[] = [
  { name: 'Option A — Biryani', price: '₹180 chicken · ₹160 veg', items: [] },
  { name: 'Option B — Full meal', price: '₹225', items: [] },
  { name: 'Option C — Premium meal', price: '₹300', items: [] },
];

const STEPS = [
  ['Fill in the form', 'At the bottom of this page — about two minutes.'],
  ['Receive our WhatsApp pack', 'Brochure, short videos of a real visit, photos, and who will call you.'],
  ['Take our call', 'Within one working day. We agree the package, the date and the food.'],
  ['Receive the quotation', 'As a PDF, on WhatsApp and email, for your office.'],
  ['Confirm the date and pay', 'We block the date and send written confirmation.'],
  ['Come for the visit', 'We send a reminder the day before with the reporting time.'],
];

const INCLUDED = [
  'Guided walkthrough of the technology zones',
  'Live demonstrations',
  'Hands-on workshop, with materials',
  'Meals, if you choose them',
  'Drinking water',
  'A certificate for every student',
];
const NOT_INCLUDED = ['Transport to and from Inker Robotics'];

// Answers marked TODO are the suggested values from the Phase 1 plan and still need sign-off.
// Questions with an empty answer are hidden until one is written.
const FAQS: [string, string][] = [
  ['What is the minimum group size?', '15 students. One session can take around 80 students; tell us if your group is larger and we will plan for it.'], // TODO: confirm
  ['How far ahead do we need to book?', 'At least 7 days ahead if you want meals, and 3 working days if you do not.'], // TODO: confirm
  ['How long does the visit take?', 'Option 1 takes 2 hours, Option 2 takes 3.5 hours and Option 3 takes 5 hours.'],
  ['Do accompanying teachers pay?', 'No. Teachers visit free of charge; only their meals are charged if you choose food.'], // TODO: confirm
  ['What if our numbers change?', 'That is normal. We confirm the final student count a few days before the visit; the food count is fixed 3 days before.'], // TODO: confirm
  ['Is there parking and bus access?', ''], // TODO: write answer
  ['Can students take photographs?', ''], // TODO: write answer
];

const jsonLd: object[] = [
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Industrial Visit',
    description: DESCRIPTION,
    provider: { '@id': 'https://inkerrobotics.com#organization' },
    areaServed: 'IN',
    offers: PACKAGES.map((p) => ({
      '@type': 'Offer',
      name: `${p.name} — ${p.title} (${p.duration})`,
      price: p.price,
      priceCurrency: 'INR',
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.filter(([, a]) => a).map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://inkerrobotics.com/' },
      { '@type': 'ListItem', position: 2, name: 'Industrial Visit', item: 'https://inkerrobotics.com/industrial-visit' },
    ],
  },
];

export default function Page() {
  return (
    <>
      {jsonLd.map((d, i) => <JsonLd key={i} data={d} />)}

      <main className="sv-page">
        <PageMotion />

        {/* ── HERO ── */}
        <section className="sv-hero" style={{ minHeight: '72vh' }}>
          <div className="sv-brackets" aria-hidden="true"><i /><i /><i /><i /></div>
          <div className="sv-hero-grid">
            <div className="sv-hero-copy">
              <p className="cine-eyebrow" data-anim="fade-up">Industrial Visit · Thrissur</p>
              <h1 className="sv-hero-title" data-anim="chars" data-anim-stagger="0.035">
                SEE THE TECHNOLOGY AT WORK
              </h1>
              <p className="cine-body" data-anim="fade-up" data-anim-delay="0.2" style={{ maxWidth: '50ch' }}>
                Everything about a college visit to Inker Robotics — packages, prices, meals and how
                booking works — on one page. Read it at your own pace, share it with your Head of
                Department, and fill in the short form at the bottom.
              </p>
            </div>
          </div>
        </section>

        {/* ── 1. WHAT AN IV HERE IS ── */}
        <section className="sv-section" id="about-visit">
          <div className="sv-inner sv-split">
            <div className="sv-media" data-wipe="left">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/Robotics/Humanoids.webp" alt="Robots at Inker Robotics, Thrissur" data-parallax="0.1" />
            </div>
            <div className="sv-copy">
              <p className="cine-eyebrow" data-anim="fade-up">What a visit is</p>
              <h2 className="sv-title" data-anim="words">NOT A FACTORY TOUR</h2>
              <div className="sv-divider" />
              <p className="cine-body" data-anim="fade-up" data-anim-delay="0.1">
                Inker Robotics is an Arduino Education Partner and has reached over 2.5 lakh
                learners. An Industrial Visit here puts students in
                front of working robots, AI systems and prototyping tools — and then puts the
                hardware in their hands.
              </p>
              <p className="cine-body" data-anim="fade-up" data-anim-delay="0.16">
                Instead of watching a production line from behind a rope, students see how the
                technology is built, ask the engineers who build it, and make something themselves.
              </p>
            </div>
          </div>
        </section>

        {/* ── 2. ZONES ── */}
        <section className="sv-section" id="zones">
          <div className="sv-inner">
            <p className="cine-eyebrow" data-anim="fade-up">What students will see</p>
            <h2 className="sv-title" data-anim="words">THE TECHNOLOGY ZONES</h2>
            <div className="sv-divider" />
            <div className="iv-grid iv-grid-3">
              {ZONES.map(([title, desc]) => (
                <div className="iv-card" key={title}>
                  <h3 className="iv-card-title">{title}</h3>
                  <p className="iv-card-body">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. PACKAGES ── */}
        <section className="sv-section" id="packages">
          <div className="sv-inner">
            <p className="cine-eyebrow" data-anim="fade-up">Prices per student</p>
            <h2 className="sv-title" data-anim="words">CHOOSE YOUR VISIT</h2>
            <div className="sv-divider" />
            <div className="iv-grid iv-grid-3">
              {PACKAGES.map((p) => (
                <article className={`iv-card iv-package tone-${p.tone}`} key={p.name}>
                  <div className="iv-package-head">
                    <span className="iv-kicker">{p.name}</span>
                    <span className="iv-kicker">{p.duration}</span>
                  </div>
                  <h3 className="iv-card-title iv-package-title">{p.title}</h3>
                  <div className="iv-price">₹{p.price}<span> / student</span></div>
                  <ul className="ink-list iv-inclusions">
                    {p.inclusions.map((x) =>
                      typeof x === 'string' ? (
                        <li key={x}>{x}</li>
                      ) : (
                        <li key={x.text}>
                          {x.text}
                          <ul className="iv-sublist">
                            {x.sub.map((s) => <li key={s}>{s}</li>)}
                          </ul>
                        </li>
                      )
                    )}
                  </ul>
                  <p className="iv-bestfor"><strong>Best for:</strong> {p.bestFor}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. MEALS ── */}
        <section className="sv-section" id="meals">
          <div className="sv-inner">
            <p className="cine-eyebrow" data-anim="fade-up">Optional · per plate</p>
            <h2 className="sv-title" data-anim="words">MEAL OPTIONS</h2>
            <div className="sv-divider" />
            <div className="iv-grid iv-grid-3">
              {MEALS.map((m) => (
                <article className="iv-card" key={m.name}>
                  <h3 className="iv-card-title">{m.name}</h3>
                  <div className="iv-meal-price">{m.price}</div>
                  {m.items.length > 0 && (
                    <ul className="ink-list">{m.items.map((x) => <li key={x}>{x}</li>)}</ul>
                  )}
                </article>
              ))}
            </div>
            <p className="iv-note">Vegetarian plates can be set aside for any option — just tell us roughly how many.</p>
          </div>
        </section>

        {/* ── 5. PROCESS ── */}
        <section className="sv-section" id="process">
          <div className="sv-inner">
            <p className="cine-eyebrow" data-anim="fade-up">From your side</p>
            <h2 className="sv-title" data-anim="words">HOW BOOKING WORKS</h2>
            <div className="sv-divider" />
            <ol className="iv-steps">
              {STEPS.map(([title, desc], i) => (
                <li className="iv-step" key={title}>
                  <span className="iv-step-num">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="iv-card-title">{title}</h3>
                  <p className="iv-card-body">{desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── 6. INCLUDED ── */}
        <section className="sv-section" id="included">
          <div className="sv-inner">
            <h2 className="sv-title" data-anim="words">WHAT&rsquo;S INCLUDED</h2>
            <div className="sv-divider" />
            <div className="iv-grid iv-grid-2">
              <div className="iv-card">
                <span className="iv-kicker">Included</span>
                <ul className="ink-list">{INCLUDED.map((x) => <li key={x}>{x}</li>)}</ul>
              </div>
              <div className="iv-card">
                <span className="iv-kicker">Not included</span>
                <ul className="ink-list">{NOT_INCLUDED.map((x) => <li key={x}>{x}</li>)}</ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. FAQ ── */}
        <section className="sv-section" id="faq">
          <div className="sv-inner">
            <p className="cine-eyebrow" data-anim="fade-up">Common questions</p>
            <h2 className="sv-title" data-anim="words">BEFORE YOU ASK</h2>
            <div className="sv-divider" />
            <div className="iv-faq">
              {FAQS.filter(([, a]) => a).map(([q, a]) => (
                <details className="iv-faq-item" key={q}>
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8. FORM + 9. REACH A PERSON ── */}
        <section className="sv-section" id="enquire">
          <div className="sv-inner">
            <div className="ink-contact-grid">
              <div>
                <p className="cine-eyebrow" data-anim="fade-up">Enquire</p>
                <h2 className="sv-title" data-anim="words">PLAN YOUR VISIT</h2>
                <div className="sv-divider" />
                <p className="cine-body" style={{ marginTop: '1.2rem', maxWidth: '42ch' }}>
                  Fill in the form and you will receive our WhatsApp pack within minutes. One of our
                  team will call you within one working day to agree the package, the date and the food.
                </p>
                <dl style={{ margin: '1.8rem 0 0' }}>
                  <div className="ink-detail">
                    <dt>Prefer to talk?</dt>
                    <dd><a className="iv-big-contact" href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a></dd>
                  </div>
                  <div className="ink-detail">
                    <dt>Email</dt>
                    <dd><a className="iv-big-contact" href={`mailto:${EMAIL}?subject=Industrial%20Visit%20enquiry`}>{EMAIL}</a></dd>
                  </div>
                  <div className="ink-detail">
                    <dt>Office hours</dt>
                    <dd>{OFFICE_HOURS}</dd>
                  </div>
                </dl>
              </div>
              <div className="sv-article hm-glass" style={{ padding: 'clamp(24px, 3vw, 44px)' }}>
                <IVEnquiryForm />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
