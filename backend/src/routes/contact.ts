import { Router } from 'express';
import { adminAuth } from '../middleware/adminAuth';
import { submitInquiry } from '../controllers/contactController';

const router = Router();

router.post('/', submitInquiry);

export default router;
