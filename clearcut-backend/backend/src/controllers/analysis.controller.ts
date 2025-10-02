import { Request, Response } from 'express';
import { DocumentModel } from '../models/Document.js';
import {
  checkCompliance,
  extractEntities,
  buildTimeline,
  verifyClaim,
} from '../services/mcp-orchestrator.js';
import { logger } from '../utils/logger.js';

export async function analyzeCompliance(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const { documentId, standards } = req.body;

    const document = await DocumentModel.findOne({
      _id: documentId,
      userId,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    const startTime = Date.now();
    const compliance = await checkCompliance(document.rawText, standards);
    const executionTime = Date.now() - startTime;

    logger.info('Compliance check completed', {
      documentId,
      standards,
      executionTime: `${executionTime}ms`,
    });

    res.json({
      success: true,
      compliance,
      executionTime: `${executionTime}ms`,
    });
  } catch (error) {
    logger.error('Compliance analysis failed:', error);
    res.status(500).json({
      success: false,
      message: 'Compliance analysis failed',
    });
  }
}

export async function analyzeEntities(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const { documentId } = req.body;

    const document = await DocumentModel.findOne({
      _id: documentId,
      userId,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    const startTime = Date.now();
    const entities = await extractEntities(document.rawText);
    const executionTime = Date.now() - startTime;

    logger.info('Entity extraction completed', {
      documentId,
      executionTime: `${executionTime}ms`,
    });

    res.json({
      success: true,
      entities,
      executionTime: `${executionTime}ms`,
    });
  } catch (error) {
    logger.error('Entity analysis failed:', error);
    res.status(500).json({
      success: false,
      message: 'Entity analysis failed',
    });
  }
}

export async function analyzeTimeline(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const { documentId } = req.body;

    const document = await DocumentModel.findOne({
      _id: documentId,
      userId,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    const startTime = Date.now();
    const timeline = await buildTimeline(document.rawText);
    const executionTime = Date.now() - startTime;

    logger.info('Timeline analysis completed', {
      documentId,
      executionTime: `${executionTime}ms`,
    });

    res.json({
      success: true,
      timeline,
      executionTime: `${executionTime}ms`,
    });
  } catch (error) {
    logger.error('Timeline analysis failed:', error);
    res.status(500).json({
      success: false,
      message: 'Timeline analysis failed',
    });
  }
}

export async function verifyClaimEndpoint(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const { documentId, claim } = req.body;

    const document = await DocumentModel.findOne({
      _id: documentId,
      userId,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    const startTime = Date.now();
    const verification = await verifyClaim(document.rawText, claim);
    const executionTime = Date.now() - startTime;

    logger.info('Claim verification completed', {
      documentId,
      executionTime: `${executionTime}ms`,
    });

    res.json({
      success: true,
      ...verification,
      executionTime: `${executionTime}ms`,
    });
  } catch (error) {
    logger.error('Claim verification failed:', error);
    res.status(500).json({
      success: false,
      message: 'Claim verification failed',
    });
  }
}