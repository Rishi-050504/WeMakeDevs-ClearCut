import { Router } from 'express';
import {
  analyzeCompliance,
  analyzeEntities,
  analyzeTimeline,
  verifyClaimEndpoint,
} from '../controllers/analysis.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import { z } from 'zod';

const router = Router();

const complianceSchema = z.object({
  documentId: z.string(),
  standards: z.array(z.string()),
});

const entitySchema = z.object({
  documentId: z.string(),
});

const timelineSchema = z.object({
  documentId: z.string(),
});

const verifySchema = z.object({
  documentId: z.string(),
  claim: z.string(),
});

router.use(authenticate);

router.post('/compliance', validateRequest(complianceSchema), analyzeCompliance);
router.post('/entities', validateRequest(entitySchema), analyzeEntities);
router.post('/timeline', validateRequest(timelineSchema), analyzeTimeline);
router.post('/verify', validateRequest(verifySchema), verifyClaimEndpoint);

export default router;