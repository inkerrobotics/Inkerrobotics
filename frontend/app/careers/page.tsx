import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: "Careers at Inker Robotics — Build the Future",
  description: "Open roles, On-the-Job Trainee (OJT) program, and internship opportunities at Inker Robotics. Work on robotics, AI, EduTech, and experiential technology ecosystems.",
  alternates: { canonical: "/careers" },
  openGraph: {
    title: "Careers at Inker Robotics — Build the Future",
    description: "Open roles, On-the-Job Trainee (OJT) program, and internship opportunities at Inker Robotics. Work on robotics, AI, EduTech, and experiential technology ecosystems.",
    url: "/careers",
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: "Careers at Inker Robotics — Build the Future",
    description: "Open roles, On-the-Job Trainee (OJT) program, and internship opportunities at Inker Robotics. Work on robotics, AI, EduTech, and experiential technology ecosystems."
  }
};

const jsonLd: object[] = [{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://inkerrobotics.com/"},{"@type":"ListItem","position":2,"name":"Careers at Inker Robotics — Build the Future","item":"https://inkerrobotics.com/careers"}]}];

const PERKS = [
  ['Robotics & AI projects', 'Work on humanoids, kiosks, automation and AI engagement systems that ship to real customers.'],
  ['Cross-functional learning', 'Mechanical, electronics, firmware and software sit in one room — you will touch all of it.'],
  ['Innovation-driven culture', 'Ideas get prototyped, not filed. If it can be built, someone here will try.'],
  ['Hands-on project exposure', 'No shadowing from the sidelines. You own a part of the build from day one.'],
  ['Real-world solutions', 'Everything we make ends up in a bank, a broadcast studio, a campus or a public expo.'],
];

const ROLES = [
  ['Robotics Engineer', 'Full-time · Kerala, India', 'Mechanical design, electronics and control systems for humanoid and service robotics.'],
  ['AI Solutions Developer', 'Full-time · Kerala, India', 'Build the WhatsApp-first engagement and customer management platforms behind our AI vertical.'],
];

export default function Page() {
  return (
    <>
      {jsonLd.map((d, i) => <JsonLd key={i} data={d} />)}

      <main className="sv-page">
        {/* ── HERO ── */}
        <section className="sv-hero" style={{ minHeight: '72vh' }}>
          <div className="sv-brackets" aria-hidden="true"><i /><i /><i /><i /></div>

          <div className="cg-depth" aria-hidden="true">
            <span className="cg-ghost-type" data-parallax="0.3" data-parallax-x="0.18" data-parallax-trigger="self">CAREERS</span>
            <span className="cg-mark cg-mark-a" data-parallax="0.55" data-parallax-rotate="28" data-parallax-trigger="self" />
            <span className="cg-rule cg-rule-b" data-parallax="0.36" data-parallax-trigger="self" />
          </div>

          <div className="sv-hero-grid">
            <div className="sv-hero-copy">
              <p className="cine-eyebrow" data-anim="fade-up">Careers</p>
              <h1 className="sv-hero-title" data-anim="chars" data-anim-stagger="0.035">
                WORK ON MACHINES THAT SHIP
              </h1>
              <div className="sv-hero-actions" data-anim="fade-up" data-anim-delay="0.25">
                <a className="cine-btn" href="/contact" data-magnetic="0.3"><span className="dot" />Apply now</a>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHY INKER ── */}
        <section className="sv-section">
          <div className="cg-depth" aria-hidden="true">
            <span className="cg-mark cg-mark-c" data-parallax="0.5" data-parallax-rotate="-24" data-parallax-trigger="self" />
            <span className="cg-rule cg-rule-a" data-parallax="0.4" data-parallax-trigger="self" />
          </div>

          <div className="sv-inner">
            <div className="sv-limitless-head">
              <h2 className="sv-title" data-anim="words" data-anim-stagger="0.05">WHY BUILD HERE</h2>
              <div className="sv-tags">
                <span className="sv-tag">Robotics</span>
                <span className="sv-tag">AI</span>
                <span className="sv-tag">EduTech</span>
              </div>
            </div>

            <div className="ink-roles" data-anim="stagger">
              {PERKS.map(([title, desc]) => (
                <div className="ink-role" key={title} style={{ display: 'block' }}>
                  <h4>{title}</h4>
                  <p style={{ color: 'rgba(255,255,255,0.62)', marginTop: 10, maxWidth: '70ch' }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── OPEN ROLES ── */}
        <section className="sv-section">
          <div className="cg-depth" aria-hidden="true">
            <span className="cg-ghost-type right" data-parallax="0.26" data-parallax-x="-0.2" data-parallax-trigger="self">ROLES</span>
            <span className="cg-rule cg-rule-c" data-parallax="0.38" data-parallax-trigger="self" />
          </div>

          <div className="sv-inner">
            <p className="cine-eyebrow" data-anim="fade-up">Now hiring</p>
            <h2 className="sv-title" data-anim="words" style={{ marginTop: '0.7rem' }}>OPEN ROLES</h2>
            <div className="sv-divider" />

            <div className="ink-roles">
              {ROLES.map(([title, meta, desc]) => (
                <article className="ink-role" key={title}>
                  <div style={{ flex: '1 1 340px' }}>
                    <h4>{title}</h4>
                    <div className="ink-role-meta">{meta}</div>
                    <p style={{ color: 'rgba(255,255,255,0.62)', marginTop: 12, maxWidth: '62ch' }}>{desc}</p>
                  </div>
                  <a className="cine-btn" href="/contact" data-magnetic="0.25"><span className="dot" />Apply</a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── OJT / INTERNSHIP ── */}
        <section className="sv-section">
          <div className="sv-inner sv-split">
            <div className="sv-media" data-wipe="left">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/Robotics/Robotics.png" alt="On-the-job training at Inker" data-parallax="0.1" />
            </div>

            <div className="sv-copy">
              <p className="cine-eyebrow" data-anim="fade-up">Students & graduates</p>
              <h2 className="sv-title" data-anim="words">ON-THE-JOB TRAINEE PROGRAM</h2>
              <div className="sv-divider" />
              <p className="cine-body" data-anim="fade-up" data-anim-delay="0.14">
                Structured internships and trainee placements where you work alongside the
                engineering team on live robotics and AI projects — with mentorship, real
                hardware and portfolio-ready outcomes at the end of it.
              </p>
              <ul className="ink-list">
                <li>Live project exposure from week one</li>
                <li>Mentored by working engineers</li>
                <li>Robotics, electronics, firmware and AI tracks</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── DIVE ── */}
        <section className="sv-dive">
          <div className="sv-brackets" aria-hidden="true"><i /><i /><i /><i /></div>
          <div className="sv-dive-media" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/Robotics/Humanoids.png" alt="" />
          </div>
          <h2 className="sv-dive-title" data-anim="chars" data-anim-stagger="0.03">JOIN INKER</h2>
        </section>
      </main>
    </>
  );
}
