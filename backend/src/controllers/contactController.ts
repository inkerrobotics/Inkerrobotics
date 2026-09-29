import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { sendInquiryNotification } from '../lib/mail';
import { verifyRecaptcha } from '../lib/recaptcha';

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

  try {
    const inquiry = await prisma.inquiry.create({ data });
    sendInquiryNotification(data).catch(err => console.error('[mail]', err));
    return res.status(201).json({ success: true, id: inquiry.id });
  } catch (err) {
    console.error('[submitInquiry]', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
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
