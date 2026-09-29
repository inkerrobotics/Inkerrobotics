import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

const schema = z.object({
  title: z.string().min(1),
  tag: z.string().min(1),
  status: z.enum(['live', 'upcoming']).default('live'),
  audience: z.string().min(1),
  duration: z.string().min(1),
  mode: z.string().min(1),
  startDate: z.string().min(1),
  fee: z.string().min(1),
  certificate: z.string().min(1),
  outcome: z.string().min(1),
  order: z.number().optional(),
  isActive: z.boolean().optional(),
});

export async function listPrograms(_req: Request, res: Response) {
  const data = await prisma.eduProgram.findMany({ orderBy: { order: 'asc' } });
  return res.json({ success: true, data });
}

export async function createProgram(req: Request, res: Response) {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, errors: parsed.error.flatten().fieldErrors });
  const data = await prisma.eduProgram.create({ data: parsed.data });
  return res.status(201).json({ success: true, data });
}

export async function updateProgram(req: Request, res: Response) {
  const parsed = schema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, errors: parsed.error.flatten().fieldErrors });
  const data = await prisma.eduProgram.update({ where: { id: req.params.id }, data: parsed.data });
  return res.json({ success: true, data });
}

export async function deleteProgram(req: Request, res: Response) {
  await prisma.eduProgram.delete({ where: { id: req.params.id } });
  return res.json({ success: true });
}
