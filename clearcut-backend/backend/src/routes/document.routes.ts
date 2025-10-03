import { Router } from 'express';
import multer from 'multer';
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
const upload = multer({ storage: multer.memoryStorage() });
const analyzeSchema = z.object({
  fileName: z.string(),
  mimeType: z.string(),
  fileData: z.string(), // base64 encoded
  docType: z.enum(['Legal', 'Medical', 'Business', 'General']).optional(),
  context: z.string().optional(),
});

router.use(authenticate);

router.post('/analyze', upload.single('document'), validateRequest(analyzeSchema), analyzeDocument);

router.get('/', getDocuments);
router.get('/:id', getDocument);
router.delete('/:id', deleteDocument);

export default router;