import { Request, Response, NextFunction } from 'express';

export function adminAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  const secret = process.env.ADMIN_SECRET;

  if (!secret) {
    return res.status(500).json({ success: false, message: 'ADMIN_SECRET not configured' });
  }

  if (!auth || auth !== `Bearer ${secret}`) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  next();
}
