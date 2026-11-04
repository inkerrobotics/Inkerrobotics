import { Router } from 'express';
import { adminAuth } from '../middleware/adminAuth';
import { loginLimiter } from '../middleware/rateLimits';
import { safeEqual } from '../middleware/adminAuth';
import { mailDiagnostics } from '../lib/mail';
import { login, listInquiries, getInquiry, updateInquiry, deleteInquiry, getStats } from '../controllers/adminController';

const router = Router();

router.post('/login', loginLimiter, login);

router.get('/stats', adminAuth, getStats);
router.get('/inquiries', adminAuth, listInquiries);
router.get('/inquiries/:id', adminAuth, getInquiry);
router.patch('/inquiries/:id', adminAuth, updateInquiry);
router.delete('/inquiries/:id', adminAuth, deleteInquiry);

// TEMPORARY mail check: open /api/admin/mail-test?key=<ADMIN_SECRET>
// in a browser. Remove once email delivery is confirmed.
router.get('/mail-test', loginLimiter, async (req, res) => {
  const secret = process.env.ADMIN_SECRET;
  const key = typeof req.query.key === 'string' ? req.query.key : '';
  if (!secret || !key || !safeEqual(key, secret)) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  try {
    res.json(await mailDiagnostics());
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

export default router;
