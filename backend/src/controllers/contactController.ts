import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { sendInquiryNotification } from '../lib/mail';
import { verifyRecaptcha } from '../lib/recaptcha';

import { appendFile } from 'fs/promises';
import path from 'path';

/* Failures are also written to backend/inquiry-errors.log (ignored by git
   via *.log) so the reason can be read without the terminal. */
function logFailure(step: string, err: unknown) {
  const msg = err instanceof Error ? `${err.message}${err.stack ? `\n${err.stack.split('\n').slice(1, 4).join('\n')}` : ''}` : String(err);
  const line = `[${new Date().toISOString()}] ${step} FAILED: ${msg}\n`;
  console.error(line.trim());
  appendFile(path.join(process.cwd(), 'inquiry-errors.log'), line).catch(() => {});
}

type InquiryData = {
  name: string;
  organization?: string;
  phone: string;
  email: string;
  location?: string;
  inquiryType: string;
  message: string;
};

/**
 * Save the enquiry and email it to NOTIFY_EMAIL. Either one succeeding is
 * enough — the enquiry is not lost — so a database outage no longer stops
 * the email, and an email failure no longer stops the save. Both failures
 * are logged with the real reason so they can be fixed.
 */
async function saveAndNotify(data: InquiryData): Promise<{ ok: boolean; id?: string }> {
  let id: string | undefined;
  let mailed = false;

  try {
    const inquiry = await prisma.inquiry.create({ data });
    id = inquiry.id;
  } catch (err) {
    logFailure(`[inquiry:${data.inquiryType}] Database save`, err);
  }

  try {
    await sendInquiryNotification(data);
    mailed = true;
  } catch (err) {
    logFailure(`[inquiry:${data.inquiryType}] Email to ${process.env.NOTIFY_EMAIL ?? 'info@inkerrobotics.com'}`, err);
  }

  return { ok: Boolean(id) || mailed, id };
}

const FAIL_MESSAGE =
  'Sorry, we could not send your enquiry right now. Please call +91 90615 00800 or email info@inkerrobotics.com.';

const inquirySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  organization: z.string().optional(),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Invalid email'),
  location: z.string().optional(),
  inquiryType: z.string().min(1, 'Inquiry type is required'),
  message: z.string().min(1, 'Message is required'),
  recaptchaToken: z.string().min(1, 'reCAPTCHA token is required'),
});

export async function submitInquiry(req: Request, res: Response) {
  const parsed = inquirySchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const { recaptchaToken, ...data } = parsed.data;

  const recaptchaOk = await verifyRecaptcha(recaptchaToken);
  if (!recaptchaOk) {
    return res.status(400).json({ success: false, message: 'reCAPTCHA verification failed' });
  }

  const result = await saveAndNotify(data);
  if (!result.ok) return res.status(500).json({ success: false, message: FAIL_MESSAGE });
  return res.status(201).json({ success: true, id: result.id });
}

export async function listInquiries(req: Request, res: Response) {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, data: inquiries });
  } catch (err) {
    console.error('[listInquiries]', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

// ── Industrial Visit enquiry (Phase 1 link page) ──────────────────────────
// Stored as a regular Inquiry (inquiryType "industrial-visit") so it appears in
// the existing admin list and triggers the same notification email. The
// structured answers are written into `message` in a fixed, readable order.

const ivSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  role: z.string().trim().min(1, 'Role is required').max(60),
  whatsapp: z.string().trim().regex(/^[0-9]{10}$/, 'WhatsApp number must be 10 digits'),
  email: z.string().trim().email('Invalid email').max(160),
  college: z.string().trim().min(1, 'College is required').max(200),
  district: z.string().trim().min(1, 'District is required').max(60),
  department: z.string().trim().min(1, 'Department is required').max(60),
  year: z.string().trim().min(1, 'Year is required').max(40),
  students: z.coerce.number().int().min(1, 'Number of students is required').max(5000),
  teachers: z.coerce.number().int().min(0).max(500),
  package: z.string().trim().min(1, 'Package is required').max(60),
  preferredDates: z.string().trim().min(1, 'Preferred dates are required').max(200),
  mealsWanted: z.string().trim().min(1, 'Meal choice is required').max(30),
  mealOption: z.string().trim().max(30).optional().default(''),
  vegPlates: z.preprocess(v => (v === '' || v == null ? undefined : v), z.coerce.number().int().min(0).max(5000).optional()),
  notes: z.string().trim().max(2000).optional().default(''),
  source: z.string().trim().max(60).optional().default(''),
  whatsappConsent: z.literal(true, { errorMap: () => ({ message: 'WhatsApp consent is required' }) }),
  recaptchaToken: z.string().min(1, 'reCAPTCHA token is required'),
});

export async function submitIvEnquiry(req: Request, res: Response) {
  const parsed = ivSchema.safeParse(req.body);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const first = Object.values(fieldErrors).flat()[0];
    return res.status(400).json({ success: false, message: first ?? 'Please check the form', errors: fieldErrors });
  }

  const { recaptchaToken, ...d } = parsed.data;
  if (!(await verifyRecaptcha(recaptchaToken))) {
    return res.status(400).json({ success: false, message: 'reCAPTCHA verification failed' });
  }

  const lines: [string, string | number | undefined][] = [
    ['Role', d.role],
    ['Department', d.department],
    ['Year of study', d.year],
    ['Students', d.students],
    ['Teachers', d.teachers],
    ['Package considered', d.package],
    ['Preferred dates', d.preferredDates],
    ['Meals wanted', d.mealsWanted],
    ['Meal option', d.mealOption || undefined],
    ['Veg plates', d.vegPlates],
    ['Heard about us via', d.source || undefined],
    ['WhatsApp consent', 'Yes'],
    ['Notes', d.notes || undefined],
  ];
  const message = lines
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');

  const data = {
    name: d.name,
    organization: d.college,
    phone: d.whatsapp,
    email: d.email,
    location: d.district,
    inquiryType: 'industrial-visit',
    message,
  };

  const result = await saveAndNotify(data);
  if (!result.ok) return res.status(500).json({ success: false, message: FAIL_MESSAGE });
  return res.status(201).json({ success: true, id: result.id });
}
