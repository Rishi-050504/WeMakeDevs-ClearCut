import { Router } from 'express';
import { chat, streamChat, getChatHistory } from '../controllers/chat.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import { z } from 'zod';

const router = Router();

const chatSchema = z.object({
  documentId: z.string(),
  message: z.string().min(1).max(1000),
});

router.use(authenticate);

router.post('/', validateRequest(chatSchema), chat);
router.post('/stream', validateRequest(chatSchema), streamChat);
router.get('/:documentId', getChatHistory);

export default router;