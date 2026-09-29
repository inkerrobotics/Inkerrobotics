import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export function login(req: Request, res: Response) {
  const { password } = req.body as { password?: string };
  const secret = process.env.ADMIN_SECRET;

  if (!secret || password !== secret) {
    return res.status(401).json({ success: false, message: 'Invalid password' });
  }

  return res.json({ success: true, token: secret });
}

export async function listInquiries(req: Request, res: Response) {
  const { status, type, page = '1', limit = '20' } = req.query as Record<string, string>;

  const where: Record<string, string> = {};
  if (status) where.status = status;
  if (type) where.inquiryType = type;

  try {
    const [total, data] = await prisma.$transaction([
      prisma.inquiry.count({ where }),
      prisma.inquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
    ]);

    return res.json({ success: true, data, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error('[listInquiries]', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

export async function getInquiry(req: Request, res: Response) {
  try {
    const inquiry = await prisma.inquiry.findUnique({ where: { id: req.params.id } });
    if (!inquiry) return res.status(404).json({ success: false, message: 'Not found' });

    if (inquiry.status === 'new') {
      await prisma.inquiry.update({ where: { id: req.params.id }, data: { status: 'read' } });
      inquiry.status = 'read';
    }

    return res.json({ success: true, data: inquiry });
  } catch (err) {
    console.error('[getInquiry]', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

const updateSchema = z.object({
  status: z.enum(['new', 'read', 'replied']).optional(),
  notes: z.string().optional(),
});

export async function updateInquiry(req: Request, res: Response) {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  try {
    const inquiry = await prisma.inquiry.update({
      where: { id: req.params.id },
      data: parsed.data,
    });
    return res.json({ success: true, data: inquiry });
  } catch (err) {
    console.error('[updateInquiry]', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

export async function deleteInquiry(req: Request, res: Response) {
  try {
    await prisma.inquiry.delete({ where: { id: req.params.id } });
    return res.json({ success: true });
  } catch (err) {
    console.error('[deleteInquiry]', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

export async function getStats(req: Request, res: Response) {
  try {
    const [total, newCount, read, replied] = await prisma.$transaction([
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { status: 'new' } }),
      prisma.inquiry.count({ where: { status: 'read' } }),
      prisma.inquiry.count({ where: { status: 'replied' } }),
    ]);
    return res.json({ success: true, data: { total, new: newCount, read, replied } });
  } catch (err) {
    console.error('[getStats]', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
