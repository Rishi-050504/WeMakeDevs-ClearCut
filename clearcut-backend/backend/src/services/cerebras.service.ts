import Cerebras from '@cerebras/cerebras_cloud_sdk';
import { logger } from '../utils/logger.js';
import { trackPerformance } from '../utils/performance.js';

const cerebras = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY,
});

const MODEL = 'llama3.3-70b';

interface AnalysisResult {
  riskScore: number;
  keyClauses: string[];
  obligations: string[];
  recommendations: string[];
  sentiment: number;
  summary: string;
  analysisTime: number;
}

export async function analyzeDocumentFast(
  documentText: string,
  docType: string
): Promise<AnalysisResult> {
  const startTime = Date.now();

  try {
    const systemPrompt = getSystemPrompt(docType);
    
    const response = await cerebras.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: `Analyze this ${docType} document:\n\n${documentText.slice(0, 50000)}`,
        },
      ],
      temperature: 0.1,
      max_tokens: 2048,
      response_format: { type: 'json_object' },
    });

    const analysisTime = Date.now() - startTime;
    const content = response.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);

    logger.info('Cerebras analysis completed', {
      docType,
      analysisTime: `${analysisTime}ms`,
      tokensUsed: response.usage?.total_tokens,
    });

    return {
      riskScore: parsed.riskScore || 0,
      keyClauses: parsed.keyClauses || [],
      obligations: parsed.obligations || [],
      recommendations: parsed.recommendations || [],
      sentiment: parsed.sentiment || 0,
      summary: parsed.summary || '',
      analysisTime,
    };
  } catch (error) {
    logger.error('Cerebras analysis failed:', error);
    throw new Error('Failed to analyze document with Cerebras');
  }
}

export async function generateChatResponse(
  context: string,
  question: string
): Promise<string> {
  try {
    const response = await cerebras.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `You are a document analysis assistant. Answer questions based ONLY on the provided context. Include citation numbers [1], [2] etc. when referencing specific parts.`,
        },
        {
          role: 'user',
          content: `Context:\n${context}\n\nQuestion: ${question}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 1024,
    });

    return response.choices[0]?.message?.content || 'I cannot answer that question.';
  } catch (error) {
    logger.error('Chat response generation failed:', error);
    throw error;
  }
}

export async function* streamChatResponse(
  context: string,
  question: string
): AsyncGenerator<string> {
  try {
    const stream = await cerebras.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `You are a document analysis assistant. Answer based ONLY on the provided context.`,
        },
        {
          role: 'user',
          content: `Context:\n${context}\n\nQuestion: ${question}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 1024,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  } catch (error) {
    logger.error('Streaming failed:', error);
    throw error;
  }
}

function getSystemPrompt(docType: string): string {
  const prompts = {
    Legal: `You are a legal document analyzer. Analyze the document and return JSON with:
{
  "riskScore": number (1-100),
  "keyClauses": ["clause1", "clause2"],
  "obligations": ["obligation1", "obligation2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "sentiment": number (-1 to 1),
  "summary": "brief summary"
}`,
    Medical: `You are a medical document analyzer. Analyze the document and return JSON with:
{
  "riskScore": number (1-100, urgency level),
  "keyClauses": ["finding1", "finding2"],
  "obligations": ["follow-up1", "follow-up2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "sentiment": number (-1 to 1),
  "summary": "brief summary"
}`,
    Business: `You are a business document analyzer. Return JSON with required fields.`,
    General: `You are a document analyzer. Return JSON with required fields.`,
  };

  return prompts[docType as keyof typeof prompts] || prompts.General;
}