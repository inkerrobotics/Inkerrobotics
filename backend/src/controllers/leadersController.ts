import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

const schema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  bio: z.string().optional(),
  linkedin: z.string().optional(),
  imageUrl: z.string().optional(),
  order: z.number().optional(),
});

export async function listLeaders(_req: Request, res: Response) {
  const data = await prisma.leader.findMany({ orderBy: { order: 'asc' } });
  return res.json({ success: true, data });
}

export async function createLeader(req: Request, res: Response) {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, errors: parsed.error.flatten().fieldErrors });
  const data = await prisma.leader.create({ data: parsed.data });
  return res.status(201).json({ success: true, data });
}

export async function updateLeader(req: Request, res: Response) {
  const parsed = schema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, errors: parsed.error.flatten().fieldErrors });
  const data = await prisma.leader.update({ where: { id: req.params.id }, data: parsed.data });
  return res.json({ success: true, data });
}

export async function deleteLeader(req: Request, res: Response) {
  await prisma.leader.delete({ where: { id: req.params.id } });
  return res.json({ success: true });
}
