import { Router } from 'express';
import { adminAuth } from '../middleware/adminAuth';
import { loginLimiter } from '../middleware/rateLimits';
import { login, listInquiries, getInquiry, updateInquiry, deleteInquiry, getStats } from '../controllers/adminController';

const router = Router();

router.post('/login', loginLimiter, login);

router.get('/stats', adminAuth, getStats);
router.get('/inquiries', adminAuth, listInquiries);
router.get('/inquiries/:id', adminAuth, getInquiry);
router.patch('/inquiries/:id', adminAuth, updateInquiry);
router.delete('/inquiries/:id', adminAuth, deleteInquiry);

export default router;
