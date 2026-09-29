import { Router } from 'express';
import multer from 'multer';
import { adminAuth } from '../middleware/adminAuth';
import { uploadMedia, listMedia, deleteMedia } from '../controllers/mediaController';
import { listLeaders, createLeader, updateLeader, deleteLeader } from '../controllers/leadersController';
import { listPress, createPress, updatePress, deletePress } from '../controllers/pressController';
import { listPrograms, createProgram, updateProgram, deleteProgram } from '../controllers/programsController';
import { getSettings, updateSettings, getPageSections, updatePageSection } from '../controllers/settingsController';
import { listBrands, createBrand, updateBrand, deleteBrand } from '../controllers/brandsController';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.use(adminAuth);

// Media
router.get('/media', listMedia);
router.post('/media', upload.single('file'), uploadMedia);
router.delete('/media/:id', deleteMedia);

// Leaders
router.get('/leaders', listLeaders);
router.post('/leaders', createLeader);
router.patch('/leaders/:id', updateLeader);
router.delete('/leaders/:id', deleteLeader);

// Press
router.get('/press', listPress);
router.post('/press', createPress);
router.patch('/press/:id', updatePress);
router.delete('/press/:id', deletePress);

// Programs
router.get('/programs', listPrograms);
router.post('/programs', createProgram);
router.patch('/programs/:id', updateProgram);
router.delete('/programs/:id', deleteProgram);

// Settings
router.get('/settings', getSettings);
router.post('/settings', updateSettings);

// Page content
router.get('/pages/:page', getPageSections);
router.post('/pages/:page/:section', updatePageSection);

// Trusted Brands
router.get('/brands', listBrands);
router.post('/brands', createBrand);
router.patch('/brands/:id', updateBrand);
router.delete('/brands/:id', deleteBrand);

export default router;
