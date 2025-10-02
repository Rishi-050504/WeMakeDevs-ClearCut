import { Request, Response } from 'express';
import { DocumentModel } from '../models/Document.js';
import { User } from '../models/User.js';
import { analyzeDocumentFast } from '../services/cerebras.service.js';
import { orchestrateAnalysis } from '../services/mcp-orchestrator.js';
import { indexDocument } from '../services/rag.service.js';
import { logger } from '../utils/logger.js';

export async function analyzeDocument(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const { fileName, mimeType, rawText, docType } = req.body;

    // Create document record
    const document = await DocumentModel.create({
      userId,
      fileName,
      fileSize: rawText.length,
      mimeType,
      docType: docType || 'General',
      rawText,
      status: 'processing',
    });

    logger.info('Document created', { documentId: document._id, userId });

    // FAST PATH: Direct Cerebras analysis
    const analysisResult = await analyzeDocumentFast(rawText, docType);

    // Update document with analysis
    document.analysis = analysisResult;
    document.status = 'completed';
    await document.save();

    logger.info('Fast analysis completed', {
      documentId: document._id,
      analysisTime: `${analysisResult.analysisTime}ms`,
    });

    // Update user stats
    await User.findByIdAndUpdate(userId, {
      $inc: { 'apiUsage.documentsAnalyzed': 1 },
    });

    // POWERFUL PATH: MCP orchestration (async, don't wait)
    orchestrateAnalysis(rawText, docType)
      .then(async mcpResults => {
        document.mcpResults = mcpResults;
        await document.save();
        logger.info('MCP analysis completed', { documentId: document._id });
      })
      .catch(error => {
        logger.error('MCP analysis failed:', error);
      });

    // RAG indexing (async, don't wait)
    indexDocument(document._id.toString(), rawText)
      .then(async chunkCount => {
        document.vectorStoreId = `doc_${document._id}`;
        document.chunkCount = chunkCount;
        document.indexed = true;
        await document.save();
        logger.info('RAG indexing completed', {
          documentId: document._id,
          chunkCount,
        });
      })
      .catch(error => {
        logger.error('RAG indexing failed:', error);
      });

    // Return immediate response
    res.json({
      success: true,
      documentId: document._id,
      analysis: {
        cerebras: analysisResult,
      },
      performance: {
        cerebras_time: `${analysisResult.analysisTime}ms`,
        total_response: `${analysisResult.analysisTime}ms`,
        mcp_processing: 'background',
        rag_indexing: 'background',
      },
    });
  } catch (error) {
    logger.error('Document analysis failed:', error);
    res.status(500).json({
      success: false,
      message: 'Document analysis failed',
    });
  }
}

export async function getDocuments(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [documents, total] = await Promise.all([
      DocumentModel.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-rawText'),
      DocumentModel.countDocuments({ userId }),
    ]);

    res.json({
      success: true,
      documents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Get documents failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch documents',
    });
  }
}

export async function getDocument(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    const document = await DocumentModel.findOne({
      _id: id,
      userId,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    res.json({
      success: true,
      document,
    });
  } catch (error) {
    logger.error('Get document failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch document',
    });
  }
}

export async function deleteDocument(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    const document = await DocumentModel.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    // Delete vector store (async)
    if (document.vectorStoreId) {
      const { deleteDocumentIndex } = await import('../services/rag.service.js');
      deleteDocumentIndex(id).catch(err =>
        logger.warn('Failed to delete vector store:', err)
      );
    }

    res.json({
      success: true,
      message: 'Document deleted successfully',
    });
  } catch (error) {
    logger.error('Delete document failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete document',
    });
  }
}