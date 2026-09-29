import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export async function getSettings(_req: Request, res: Response) {
  const rows = await prisma.siteSetting.findMany();
  const data = Object.fromEntries(rows.map(r => [r.key, r.value]));
  return res.json({ success: true, data });
}

export async function updateSettings(req: Request, res: Response) {
  const updates = req.body as Record<string, string>;
  await Promise.all(
    Object.entries(updates).map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  );
  return res.json({ success: true });
}

export async function getPageSections(req: Request, res: Response) {
  const { page } = req.params;
  const rows = await prisma.pageSection.findMany({ where: { page } });
  const data: Record<string, Record<string, string>> = {};
  for (const r of rows) {
    if (!data[r.section]) data[r.section] = {};
    data[r.section][r.field] = r.value;
  }
  return res.json({ success: true, data });
}

export async function updatePageSection(req: Request, res: Response) {
  const { page, section } = req.params;
  const fields = req.body as Record<string, string>;
  await Promise.all(
    Object.entries(fields).map(([field, value]) =>
      prisma.pageSection.upsert({
        where: { page_section_field: { page, section, field } },
        update: { value },
        create: { page, section, field, value },
      })
    )
  );
  return res.json({ success: true });
}
