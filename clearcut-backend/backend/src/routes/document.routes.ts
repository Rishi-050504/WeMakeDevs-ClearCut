import { Router } from 'express';
import {
  analyzeDocument,
  getDocuments,
  getDocument,
  deleteDocument,
} from '../controllers/document.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import { z } from 'zod';

const router = Router();

const analyzeSchema = z.object({
  fileName: z.string(),
  mimeType: z.string(),
  rawText: z.string().max(50000),
  docType: z.enum(['Legal', 'Medical', 'Business', 'General']).optional(),
});

router.use(authenticate);

router.post('/analyze', validateRequest(analyzeSchema), analyzeDocument);
router.get('/', getDocuments);
router.get('/:id', getDocument);
router.delete('/:id', deleteDocument);

export default router;