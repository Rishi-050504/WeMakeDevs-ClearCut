import { Request, Response } from 'express';
import { DocumentModel } from '../models/Document.js';
import { ChatMessage } from '../models/Chat.js';
import { User } from '../models/User.js';
import { semanticSearch, formatContextForLLM } from '../services/rag.service.js';
import { generateChatResponse, streamChatResponse } from '../services/cerebras.service.js';
import { logger } from '../utils/logger.js';

export async function chat(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const { documentId, message } = req.body;

    // Validate document
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

    if (!document.indexed) {
      return res.status(400).json({
        success: false,
        message: 'Document is still being indexed. Please try again in 30 seconds.',
      });
    }

    // Save user message
    await ChatMessage.create({
      documentId,
      userId,
      role: 'user',
      content: message,
    });

    const startTime = Date.now();

    // Semantic search
    const searchResults = await semanticSearch(documentId, message, 5);
    
    // Build context
    const context = formatContextForLLM(searchResults);

    // Generate response
    const response = await generateChatResponse(context, message);

    // Extract citations
    const citationRegex = /\[(\d+)\]/g;
    const citationMatches = [...response.matchAll(citationRegex)];
    const citations = citationMatches
      .map(match => {
        const index = parseInt(match[1]) - 1;
        return searchResults[index];
      })
      .filter(Boolean);

    const responseTime = Date.now() - startTime;

    // Save assistant message
    await ChatMessage.create({
      documentId,
      userId,
      role: 'assistant',
      content: response,
      citations,
      retrievedChunks: searchResults.length,
      responseTime,
    });

    // Update user stats
    await User.findByIdAndUpdate(userId, {
      $inc: { 'apiUsage.questionsAsked': 1 },
    });

    logger.info('Chat response generated', {
      documentId,
      userId,
      responseTime: `${responseTime}ms`,
      chunks: searchResults.length,
    });

    res.json({
      success: true,
      message: response,
      citations,
      metadata: {
        chunks_retrieved: searchResults.length,
        response_time: `${responseTime}ms`,
      },
    });
  } catch (error) {
    logger.error('Chat failed:', error);
    res.status(500).json({
      success: false,
      message: 'Chat request failed',
    });
  }
}

export async function streamChat(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const { documentId, message } = req.body;

    // Validate document
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

    if (!document.indexed) {
      return res.status(400).json({
        success: false,
        message: 'Document is still being indexed.',
      });
    }

    // Setup SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Save user message
    await ChatMessage.create({
      documentId,
      userId,
      role: 'user',
      content: message,
    });

    // Semantic search
    const searchResults = await semanticSearch(documentId, message, 5);

    // Send citations first
    res.write(`data: ${JSON.stringify({
      type: 'citations',
      data: searchResults,
    })}\n\n`);

    // Build context
    const context = formatContextForLLM(searchResults);

    // Stream response
    let fullResponse = '';
    const startTime = Date.now();

    for await (const token of streamChatResponse(context, message)) {
      fullResponse += token;
      res.write(`data: ${JSON.stringify({
        type: 'token',
        data: token,
      })}\n\n`);
    }

    const responseTime = Date.now() - startTime;

    // Send done
    res.write(`data: ${JSON.stringify({
      type: 'done',
    })}\n\n`);

    res.end();

    // Save assistant message
    const citationRegex = /\[(\d+)\]/g;
    const citationMatches = [...fullResponse.matchAll(citationRegex)];
    const citations = citationMatches
      .map(match => {
        const index = parseInt(match[1]) - 1;
        return searchResults[index];
      })
      .filter(Boolean);

    await ChatMessage.create({
      documentId,
      userId,
      role: 'assistant',
      content: fullResponse,
      citations,
      retrievedChunks: searchResults.length,
      responseTime,
    });

    // Update user stats
    await User.findByIdAndUpdate(userId, {
      $inc: { 'apiUsage.questionsAsked': 1 },
    });

    logger.info('Streaming chat completed', {
      documentId,
      userId,
      responseTime: `${responseTime}ms`,
    });
  } catch (error) {
    logger.error('Streaming chat failed:', error);
    res.write(`data: ${JSON.stringify({
      type: 'error',
      data: 'Streaming failed',
    })}\n\n`);
    res.end();
  }
}

export async function getChatHistory(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const { documentId } = req.params;

    // Verify document ownership
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

    const messages = await ChatMessage.find({ documentId })
      .sort({ createdAt: 1 })
      .limit(100);

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    logger.error('Get chat history failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chat history',
    });
  }
}