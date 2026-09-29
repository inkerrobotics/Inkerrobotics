'use client';

import { useState } from 'react';
import Script from 'next/script';
import JsonLd from '@/components/JsonLd';

const jsonLd: object[] = [{"@context":"https://schema.org","@type":"ContactPage","url":"https://inkerrobotics.com/contact","name":"Contact Inker Robotics — Lets Build the Future Together","description":"Get in touch with Inker Robotics for robotics solutions, AI systems, RoboPark partnerships, EduTech programs, careers, and collaborations. Response within 24 hours.","about":{"@id":"https://inkerrobotics.com#organization"}},{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://inkerrobotics.com/"},{"@type":"ListItem","position":2,"name":"Contact Inker Robotics — Lets Build the Future Together","item":"https://inkerrobotics.com/contact"}]}];

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '';

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

type Status = 'idle' | 'loading' | 'success' | 'error';

interface FormData {
  name: string;
  organization: string;
  phone: string;
  email: string;
  location: string;
  inquiryType: string;
  message: string;
}

const initialForm: FormData = {
  name: '', organization: '', phone: '', email: '',
  location: '', inquiryType: '', message: '',
};

export default function Page() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.inquiryType) { setErrorMsg('Please select an inquiry type.'); return; }
    setStatus('loading');
    setErrorMsg('');
    try {
      if (!window.grecaptcha) throw new Error('reCAPTCHA failed to load. Please refresh and try again.');
      const recaptchaToken = await new Promise<string>((resolve, reject) => {
        window.grecaptcha!.ready(() => {
          window.grecaptcha!.execute(RECAPTCHA_SITE_KEY, { action: 'contact_submit' }).then(resolve, reject);
        });
      });

      const res = await fetch(`${API_URL}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, recaptchaToken }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message ?? 'Submission failed');
      setStatus('success');
      setForm(initialForm);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  return (
    <>
      {jsonLd.map((d, i) => <JsonLd key={i} data={d} />)}
      {RECAPTCHA_SITE_KEY && (
        <Script src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`} strategy="afterInteractive" />
      )}

      <main className="sv-page">
        {/* ── HERO ── */}
        <section className="sv-hero" style={{ minHeight: '72vh' }}>
          <div className="sv-brackets" aria-hidden="true"><i /><i /><i /><i /></div>

          <div className="cg-depth" aria-hidden="true">
            <span className="cg-ghost-type" data-parallax="0.3" data-parallax-x="0.18" data-parallax-trigger="self">CONTACT</span>
            <span className="cg-mark cg-mark-a" data-parallax="0.55" data-parallax-rotate="28" data-parallax-trigger="self" />
            <span className="cg-rule cg-rule-b" data-parallax="0.36" data-parallax-trigger="self" />
          </div>

          <div className="sv-hero-grid">
            <div className="sv-hero-copy">
              <p className="cine-eyebrow" data-anim="fade-up">Get in touch</p>
              <h1 className="sv-hero-title" data-anim="chars" data-anim-stagger="0.035">
                LET&rsquo;S BUILD IT
              </h1>
              <p className="cine-body" data-anim="fade-up" data-anim-delay="0.2" style={{ maxWidth: '44ch' }}>
                Robotics, AI systems, RoboPark partnerships, EduTech programs, careers or
                collaborations — tell us what you need. We reply within 24 hours.
              </p>
            </div>
          </div>
        </section>

        {/* ── FORM + DETAILS ── */}
        <section className="sv-section">
          <div className="cg-depth" aria-hidden="true">
            <span className="cg-mark cg-mark-c" data-parallax="0.5" data-parallax-rotate="-24" data-parallax-trigger="self" />
            <span className="cg-rule cg-rule-a" data-parallax="0.4" data-parallax-trigger="self" />
          </div>

          <div className="sv-inner">
            <div className="ink-contact-grid">
              {/* details rail */}
              <div>
                <h2 className="sv-title">REACH US</h2>
                <div className="sv-divider" />
                <p className="cine-body" style={{ marginTop: '1.2rem', marginBottom: '1.8rem', color: 'rgba(255,255,255,0.65)', maxWidth: '42ch' }}>
                  Tell us what you&apos;re building, exploring, or need help with. The right team will reach out within 24 hours.
                </p>

                <dl style={{ margin: 0 }}>
                  <div className="ink-detail">
                    <dt>Email</dt>
                    <dd>
                      <a href="mailto:info@inkerrobotics.com">info@inkerrobotics.com</a>
                      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginTop: '4px' }}>
                        For all inquiries, partnerships &amp; programs
                      </div>
                    </dd>
                  </div>

                  <div className="ink-detail">
                    <dt>Phone</dt>
                    <dd>
                      <a href="tel:+919061500800">+91 90615 00800</a>
                      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginTop: '4px' }}>
                        Mon–Fri · 9:00 to 18:30 IST
                      </div>
                    </dd>
                  </div>

                  <div className="ink-detail">
                    <dt>Office</dt>
                    <dd>
                      <div style={{ color: '#fff', fontWeight: 600 }}>Inker Robotic Solutions Pvt Ltd</div>
                      <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, marginTop: '4px' }}>
                        29/164/73, 4th Floor, Suharsha Towers<br />
                        Shornur Road, Thrissur<br />
                        Kerala — 680001
                      </div>
                    </dd>
                  </div>

                  <div className="ink-detail">
                    <dt>Response time</dt>
                    <dd>Within 24 hours</dd>
                  </div>

                  <div className="ink-detail">
                    <dt>Social</dt>
                    <dd>
                      <div className="ink-social-links">
                        <a href="https://www.linkedin.com/company/inkerrobotics/" target="_blank" rel="noopener noreferrer" className="ink-social-pill">LinkedIn</a>
                        <a href="https://www.instagram.com/inkerrobotics" target="_blank" rel="noopener noreferrer" className="ink-social-pill">Instagram</a>
                        <a href="https://www.facebook.com/inkerrobotics" target="_blank" rel="noopener noreferrer" className="ink-social-pill">Facebook</a>
                      </div>
                    </dd>
                  </div>
                </dl>
              </div>

              {/* form */}
              <div className="sv-article hm-glass" style={{ padding: 'clamp(24px, 3vw, 44px)' }}>
                {status === 'success' ? (
                  <div style={{ padding: '2rem 0' }}>
                    <h3 style={{ marginBottom: 12 }}>Message received</h3>
                    <p style={{ color: 'rgba(255,255,255,0.62)' }}>
                      Thanks for reaching out. Our team will get back to you within 24 hours.
                    </p>
                    <button className="ink-submit" style={{ marginTop: 24 }} onClick={() => setStatus('idle')}>
                      Send another
                    </button>
                  </div>
                ) : (
                  <form className="ink-form" onSubmit={handleSubmit}>
                    <div className="ink-form-row">
                      <div className="ink-field">
                        <label htmlFor="name">Name</label>
                        <input id="name" name="name" value={form.name} onChange={handleChange} required placeholder="Your name" />
                      </div>
                      <div className="ink-field">
                        <label htmlFor="organization">Organisation</label>
                        <input id="organization" name="organization" value={form.organization} onChange={handleChange} placeholder="Company or institution" />
                      </div>
                    </div>

                    <div className="ink-form-row">
                      <div className="ink-field">
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" name="email" value={form.email} onChange={handleChange} required placeholder="name@company.com" />
                      </div>
                      <div className="ink-field">
                        <label htmlFor="phone">Phone</label>
                        <input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="+91" />
                      </div>
                    </div>

                    <div className="ink-form-row">
                      <div className="ink-field">
                        <label htmlFor="location">Location</label>
                        <input id="location" name="location" value={form.location} onChange={handleChange} placeholder="City, state" />
                      </div>
                      <div className="ink-field">
                        <label htmlFor="inquiryType">Inquiry type</label>
                        <select
                          id="inquiryType"
                          name="inquiryType"
                          value={form.inquiryType}
                          onChange={(e) => setForm(prev => ({ ...prev, inquiryType: e.target.value }))}
                          required
                        >
                          <option value="">Select one</option>
                          <option value="Robotics">Robotics</option>
                          <option value="AI Solutions">AI Solutions</option>
                          <option value="RoboParks">RoboParks</option>
                          <option value="EduTech">EduTech</option>
                          <option value="Careers">Careers</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="ink-field">
                      <label htmlFor="message">Message</label>
                      <textarea id="message" name="message" rows={5} value={form.message} onChange={handleChange} required placeholder="Tell us what you are trying to build." />
                    </div>

                    {errorMsg && (
                      <p style={{ color: '#FF5B6E', fontSize: 14, margin: 0 }}>{errorMsg}</p>
                    )}

                    <button className="ink-submit" type="submit" disabled={status === 'loading'}>
                      {status === 'loading' ? 'Sending…' : 'Send message'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── DIVE ── */}
        <section className="sv-dive">
          <div className="sv-brackets" aria-hidden="true"><i /><i /><i /><i /></div>
          <div className="sv-dive-media" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/Robotics/Alton.png" alt="" />
          </div>
          <h2 className="sv-dive-title" data-anim="chars" data-anim-stagger="0.03">ENGINEER THE FUTURE</h2>
        </section>
      </main>
    </>
  );
}
