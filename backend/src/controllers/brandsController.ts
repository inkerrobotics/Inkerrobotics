import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function listBrandsPublic(req: Request, res: Response) {
  const { page } = req.query;
  const where = page
    ? { isActive: true, page: { in: [page as string, 'all'] } }
    : { isActive: true };
  const brands = await prisma.trustedBrand.findMany({ where, orderBy: { order: 'asc' } });
  res.json({ success: true, data: brands });
}

export async function listBrands(req: Request, res: Response) {
  const { page } = req.query;
  const where = page ? { page: page as string } : {};
  const brands = await prisma.trustedBrand.findMany({ where, orderBy: { order: 'asc' } });
  res.json({ success: true, data: brands });
}

export async function createBrand(req: Request, res: Response) {
  const { name, logoUrl, page, order, isActive } = req.body;
  const brand = await prisma.trustedBrand.create({
    data: { name, logoUrl, page: page ?? 'all', order: Number(order ?? 0), isActive: Boolean(isActive ?? true) },
  });
  res.json({ success: true, data: brand });
}

export async function updateBrand(req: Request, res: Response) {
  const { name, logoUrl, page, order, isActive } = req.body;
  const data: Record<string, unknown> = {};
  if (name !== undefined) data.name = name;
  if (logoUrl !== undefined) data.logoUrl = logoUrl;
  if (page !== undefined) data.page = page;
  if (order !== undefined) data.order = Number(order);
  if (isActive !== undefined) data.isActive = Boolean(isActive);
  const brand = await prisma.trustedBrand.update({ where: { id: req.params.id }, data });
  res.json({ success: true, data: brand });
}

export async function deleteBrand(req: Request, res: Response) {
  await prisma.trustedBrand.delete({ where: { id: req.params.id } });
  res.json({ success: true });
}
