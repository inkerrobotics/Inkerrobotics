import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { getSupabase, BUCKET } from '../lib/supabase';
import { prisma } from '../lib/prisma';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
  'video/mp4', 'video/webm',
  'application/pdf',
]);

export async function uploadMedia(req: Request, res: Response) {
  const file = req.file;
  if (!file) return res.status(400).json({ success: false, message: 'No file provided' });

  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    return res.status(400).json({ success: false, message: 'File type not allowed' });
  }

  const extMap: Record<string, string> = {
    'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp',
    'image/gif': 'gif', 'image/svg+xml': 'svg', 'video/mp4': 'mp4',
    'video/webm': 'webm', 'application/pdf': 'pdf',
  };
  const ext = extMap[file.mimetype];
  const path = `${uuid()}.${ext}`;

  const { error } = await getSupabase().storage.from(BUCKET).upload(path, file.buffer, {
    contentType: file.mimetype,
    upsert: false,
  });

  if (error) {
    console.error('[uploadMedia]', error);
    return res.status(500).json({ success: false, message: error.message });
  }

  const { data: { publicUrl } } = getSupabase().storage.from(BUCKET).getPublicUrl(path);

  const asset = await prisma.mediaAsset.create({
    data: {
      name: file.originalname,
      url: publicUrl,
      path,
      size: file.size,
      mimeType: file.mimetype,
    },
  });

  return res.status(201).json({ success: true, data: asset });
}

export async function listMedia(req: Request, res: Response) {
  try {
    const assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: 'desc' } });
    return res.json({ success: true, data: assets });
  } catch (err) {
    console.error('[listMedia]', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

export async function deleteMedia(req: Request, res: Response) {
  try {
    const asset = await prisma.mediaAsset.findUnique({ where: { id: req.params.id } });
    if (!asset) return res.status(404).json({ success: false, message: 'Not found' });

    await getSupabase().storage.from(BUCKET).remove([asset.path]);
    await prisma.mediaAsset.delete({ where: { id: req.params.id } });

    return res.json({ success: true });
  } catch (err) {
    console.error('[deleteMedia]', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
