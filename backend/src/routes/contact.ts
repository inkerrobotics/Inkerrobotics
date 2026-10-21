import { Router } from 'express';
import { adminAuth } from '../middleware/adminAuth';
import { submitInquiry, submitIvEnquiry } from '../controllers/contactController';

const router = Router();

router.post('/', submitInquiry);
router.post('/industrial-visit', submitIvEnquiry);

export default router;
