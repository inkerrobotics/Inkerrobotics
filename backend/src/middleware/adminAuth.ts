import { createHmac, createHash, timingSafeEqual } from 'crypto';
import { Request, Response, NextFunction } from 'express';

/*
 * Admin sessions.
 *
 * Previously the admin password itself was handed back as the login token,
 * stored in the browser forever and compared with a plain `!==`. Now:
 *  - login returns a signed token that expires (SESSION_HOURS),
 *  - the password never leaves the server again after login,
 *  - comparisons are constant-time,
 *  - changing ADMIN_SECRET in Render signs everyone out at once.
 *
 * Token format: base64url(JSON {exp}) + "." + base64url(HMAC-SHA256).
 */

const SESSION_HOURS = 12;

function b64url(buf: Buffer | string): string {
  return Buffer.from(buf).toString('base64url');
}

function sign(payload: string, secret: string): string {
  return b64url(createHmac('sha256', secret).update(payload).digest());
}

/** Constant-time string comparison (hashing first so lengths always match). */
export function safeEqual(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function issueAdminToken(secret: string): { token: string; expiresAt: number } {
  const expiresAt = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const payload = b64url(JSON.stringify({ exp: expiresAt }));
  return { token: `${payload}.${sign(payload, secret)}`, expiresAt };
}

function verifyAdminToken(token: string, secret: string): boolean {
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;
  if (!safeEqual(signature, sign(payload, secret))) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { exp?: number };
    return typeof exp === 'number' && exp > Date.now();
  } catch {
    return false;
  }
}

export function adminAuth(req: Request, res: Response, next: NextFunction) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    return res.status(500).json({ success: false, message: 'ADMIN_SECRET not configured' });
  }

  const auth = req.headers.authorization ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';

  if (!token || !verifyAdminToken(token, secret)) {
    return res.status(401).json({ success: false, message: 'Session expired — please sign in again' });
  }

  next();
}
