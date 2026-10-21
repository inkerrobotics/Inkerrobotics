'use client';

import { useState } from 'react';
import Script from 'next/script';

/*
 * Industrial Visit enquiry form (Phase 1).
 * Posts to /api/inquiries/industrial-visit, which stores the enquiry in the
 * admin inquiries list and emails the on-duty notification address.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '';

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

const ROLES = ['Faculty', 'HOD', 'Placement or Training Officer', 'Student Coordinator', 'Administration', 'Other'];
const DISTRICTS = [
  'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam', 'Idukki', 'Ernakulam',
  'Thrissur', 'Palakkad', 'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod', 'Outside Kerala',
];
const DEPARTMENTS = ['CSE or IT', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Robotics or Mechatronics', 'Applied Science', 'Multiple departments'];
const YEARS = ['First', 'Second', 'Third', 'Final', 'Postgraduate', 'Mixed', 'School students'];
const PACKAGES = [
  'Option 1 — Foundational (2 hrs, ₹199)',
  'Option 2 — IV + Hands-on Workshop (3.5 hrs, ₹499)',
  'Option 3 — IV + Extended Workshop (5 hrs, ₹799)',
  'Not sure yet, please advise',
];
const MEALS_WANTED = ['Yes', 'No', 'Not decided yet'];
const MEAL_OPTIONS = ['Option A', 'Option B', 'Option C', 'Advise me'];
const SOURCES = ['Website', 'Google', 'Instagram or Facebook', 'A colleague or another college', 'An exhibition', 'Our brochure', 'Other'];

type Status = 'idle' | 'loading' | 'success' | 'error';

interface IVForm {
  name: string;
  role: string;
  whatsapp: string;
  email: string;
  college: string;
  district: string;
  department: string;
  year: string;
  students: string;
  teachers: string;
  package: string;
  preferredDates: string;
  mealsWanted: string;
  mealOption: string;
  vegPlates: string;
  notes: string;
  source: string;
  whatsappConsent: boolean;
}

const initialForm: IVForm = {
  name: '', role: '', whatsapp: '', email: '', college: '', district: '', department: '', year: '',
  students: '', teachers: '', package: '', preferredDates: '', mealsWanted: '', mealOption: '',
  vegPlates: '', notes: '', source: '', whatsappConsent: false,
};

function Select({ id, label, value, options, onChange, required }: {
  id: keyof IVForm; label: string; value: string; options: string[];
  onChange: (id: keyof IVForm, v: string) => void; required?: boolean;
}) {
  return (
    <div className="ink-field">
      <label htmlFor={`iv-${id}`}>{label}{required ? '' : ' (optional)'}</label>
      <select id={`iv-${id}`} name={id} value={value} required={required} onChange={(e) => onChange(id, e.target.value)}>
        <option value="">Select one</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

export default function IVEnquiryForm() {
  const [form, setForm] = useState<IVForm>(initialForm);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const set = (id: keyof IVForm, v: string | boolean) => setForm((prev) => ({ ...prev, [id]: v }));
  const onInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    set(e.target.name as keyof IVForm, e.target.value);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.whatsappConsent) {
      setErrorMsg('Please tick the box so we can send the details to you on WhatsApp.');
      return;
    }
    setStatus('loading');
    setErrorMsg('');
    try {
      let recaptchaToken = 'test';
      if (RECAPTCHA_SITE_KEY) {
        if (!window.grecaptcha) throw new Error('reCAPTCHA failed to load. Please refresh and try again.');
        recaptchaToken = await new Promise<string>((resolve, reject) => {
          window.grecaptcha!.ready(() => {
            window.grecaptcha!.execute(RECAPTCHA_SITE_KEY, { action: 'iv_enquiry' }).then(resolve, reject);
          });
        });
      }

      const res = await fetch(`${API_URL}/api/inquiries/industrial-visit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, recaptchaToken }),
      });
      // If the API is down the proxy returns an HTML error page, not JSON.
      const data = await res.json().catch(() => ({ success: false, message: '' }));
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'We could not send your enquiry right now. Please call +91 90615 00800 or email info@inkerrobotics.com.');
      }
      setStatus('success');
      setForm(initialForm);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  if (status === 'success') {
    return (
      <div style={{ padding: '2rem 0' }} role="status">
        <h3 style={{ marginBottom: 12 }}>Thank you — your enquiry is with us</h3>
        <p style={{ color: 'rgba(255,255,255,0.62)' }}>Here is what happens next:</p>
        <ul className="ink-list">
          <li>Within minutes, our WhatsApp pack reaches you: brochure, videos of a real visit, and the name of the person who will call.</li>
          <li>Within one working day, our team calls you to agree the package, the date and the food.</li>
          <li>We then send the quotation as a PDF on WhatsApp and email.</li>
        </ul>
        <button className="ink-submit" style={{ marginTop: 24 }} onClick={() => setStatus('idle')}>
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <>
      {RECAPTCHA_SITE_KEY && (
        <Script src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`} strategy="afterInteractive" />
      )}
      <form className="ink-form" onSubmit={handleSubmit}>
        <p className="iv-form-group">About you</p>
        <div className="ink-form-row">
          <div className="ink-field">
            <label htmlFor="iv-name">Your name</label>
            <input id="iv-name" name="name" value={form.name} onChange={onInput} required autoComplete="name" />
          </div>
          <Select id="role" label="Your role at the college" value={form.role} options={ROLES} onChange={set} required />
        </div>
        <div className="ink-form-row">
          <div className="ink-field">
            <label htmlFor="iv-whatsapp">WhatsApp number</label>
            <input id="iv-whatsapp" name="whatsapp" type="tel" inputMode="numeric" pattern="[0-9]{10}" maxLength={10}
              title="10-digit mobile number" placeholder="10 digits" value={form.whatsapp} onChange={onInput} required autoComplete="tel-national" />
          </div>
          <div className="ink-field">
            <label htmlFor="iv-email">Email address</label>
            <input id="iv-email" name="email" type="email" value={form.email} onChange={onInput} required autoComplete="email" />
          </div>
        </div>

        <p className="iv-form-group">Your college</p>
        <div className="ink-form-row">
          <div className="ink-field">
            <label htmlFor="iv-college">College or school name</label>
            <input id="iv-college" name="college" value={form.college} onChange={onInput} required autoComplete="organization" />
          </div>
          <Select id="district" label="District" value={form.district} options={DISTRICTS} onChange={set} required />
        </div>
        <div className="ink-form-row">
          <Select id="department" label="Department" value={form.department} options={DEPARTMENTS} onChange={set} required />
          <Select id="year" label="Year of study" value={form.year} options={YEARS} onChange={set} required />
        </div>

        <p className="iv-form-group">The visit</p>
        <div className="ink-form-row">
          <div className="ink-field">
            <label htmlFor="iv-students">Approximate number of students</label>
            <input id="iv-students" name="students" type="number" min={1} inputMode="numeric" value={form.students} onChange={onInput} required />
          </div>
          <div className="ink-field">
            <label htmlFor="iv-teachers">Teachers accompanying</label>
            <input id="iv-teachers" name="teachers" type="number" min={0} inputMode="numeric" value={form.teachers} onChange={onInput} required />
          </div>
        </div>
        <div className="ink-form-row">
          <Select id="package" label="Which package are you considering?" value={form.package} options={PACKAGES} onChange={set} required />
          <div className="ink-field">
            <label htmlFor="iv-preferredDates">When would you like to come?</label>
            <input id="iv-preferredDates" name="preferredDates" value={form.preferredDates} onChange={onInput} required
              placeholder="Month, plus 2–3 dates if known" />
          </div>
        </div>

        <p className="iv-form-group">Food</p>
        <div className="ink-form-row">
          <Select id="mealsWanted" label="Do you want us to arrange meals?" value={form.mealsWanted} options={MEALS_WANTED} onChange={set} required />
          {form.mealsWanted !== 'No' && (
            <Select id="mealOption" label="If yes, which option?" value={form.mealOption} options={MEAL_OPTIONS} onChange={set} />
          )}
        </div>
        {form.mealsWanted !== 'No' && (
          <div className="ink-field">
            <label htmlFor="iv-vegPlates">Roughly how many vegetarian plates? (optional)</label>
            <input id="iv-vegPlates" name="vegPlates" type="number" min={0} inputMode="numeric" value={form.vegPlates} onChange={onInput} />
          </div>
        )}

        <div className="ink-field">
          <label htmlFor="iv-notes">Anything else we should know? (optional)</label>
          <textarea id="iv-notes" name="notes" rows={3} value={form.notes} onChange={onInput}
            placeholder="Special requirements, accessibility needs, a tight schedule…" />
        </div>
        <Select id="source" label="How did you hear about us?" value={form.source} options={SOURCES} onChange={set} />

        <label className="iv-consent">
          <input type="checkbox" checked={form.whatsappConsent} onChange={(e) => set('whatsappConsent', e.target.checked)} required />
          <span>Yes, you may send me the visit details on WhatsApp.</span>
        </label>

        {errorMsg && <p role="alert" style={{ color: '#FF5B6E', fontSize: 14, margin: 0 }}>{errorMsg}</p>}

        <button className="ink-submit" type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending…' : 'Send enquiry'}
        </button>
        <p className="iv-note" style={{ margin: 0 }}>
          What happens next: our WhatsApp pack within minutes, and a call from our team within one working day.
        </p>
      </form>
    </>
  );
}
