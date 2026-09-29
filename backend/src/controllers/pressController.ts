import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

const schema = z.object({
  publication: z.string().min(1),
  headline: z.string().min(1),
  date: z.string().min(1),
  kind: z.string().default('Newspaper Feature'),
  isVideo: z.boolean().default(false),
  imageUrl: z.string().optional(),
  linkUrl: z.string().optional(),
  page: z.string().default('home'),
  order: z.number().optional(),
});

export async function listPress(req: Request, res: Response) {
  const { page } = req.query;
  const where = page ? { page: String(page) } : {};
  const data = await prisma.pressItem.findMany({ where, orderBy: { order: 'asc' } });
  return res.json({ success: true, data });
}

export async function createPress(req: Request, res: Response) {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, errors: parsed.error.flatten().fieldErrors });
  const data = await prisma.pressItem.create({ data: parsed.data });
  return res.status(201).json({ success: true, data });
}

export async function updatePress(req: Request, res: Response) {
  const parsed = schema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, errors: parsed.error.flatten().fieldErrors });
  const data = await prisma.pressItem.update({ where: { id: req.params.id }, data: parsed.data });
  return res.json({ success: true, data });
}

export async function deletePress(req: Request, res: Response) {
  await prisma.pressItem.delete({ where: { id: req.params.id } });
  return res.json({ success: true });
}
