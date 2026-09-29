import { Router } from 'express';
import { listBrandsPublic } from '../controllers/brandsController';

const router = Router();

router.get('/brands', listBrandsPublic);

export default router;
