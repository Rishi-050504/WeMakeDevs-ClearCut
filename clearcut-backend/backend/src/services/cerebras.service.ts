import Cerebras from '@cerebras/cerebras_cloud_sdk';
import { logger } from '../utils/logger.js';
import { trackPerformance } from '../utils/performance.js';

const cerebras = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY,
});

const MODEL = 'llama3.3-70b';

function safeJsonParse(jsonString: string): any {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    logger.error("CRITICAL: Failed to parse JSON from AI.", { jsonString });
    return {}; // Return an empty object on failure
  }
}

interface AnalysisResult {
  riskScore: number;
  keyClauses: string[];
  obligations: string[];
  recommendations: string[];
  sentiment: number;
  summary: string;
  analysisTime: number;
}

// export async function analyzeDocumentFast(
//   documentText: string,
//   docType: string
// ): Promise<AnalysisResult> {
//   const startTime = Date.now();

//   try {
//     const systemPrompt = getSystemPrompt(docType);
    
//     const response = await cerebras.chat.completions.create({
//       model: MODEL,
//       messages: [
//         {
//           role: 'system',
//           content: systemPrompt,
//         },
//         {
//           role: 'user',
//           content: `Analyze this ${docType} document:\n\n${documentText.slice(0, 50000)}`,
//         },
//       ],
//       temperature: 0.1,
//       max_tokens: 2048,
//       response_format: { type: 'json_object' },
//     });

//     const analysisTime = Date.now() - startTime;
//     const content = (response.choices as any)?.[0]?.message?.content || '{}';
//     const parsed = JSON.parse(content);
//     const tokensUsed = (response.usage as any)?.total_tokens || 0;
//     logger.info('Cerebras analysis completed', {
//       docType,
//       analysisTime: `${analysisTime}ms`,
//       tokensUsed: tokensUsed,
//     });

//     return {
//       riskScore: parsed.riskScore || 0,
//       keyClauses: parsed.keyClauses || [],
//       obligations: parsed.obligations || [],
//       recommendations: parsed.recommendations || [],
//       sentiment: parsed.sentiment || 0,
//       summary: parsed.summary || '',
//       analysisTime,
//     };
//   } catch (error) {
//     logger.error('Cerebras analysis failed:', error);
//     throw new Error('Failed to analyze document with Cerebras');
//   }
// }
export async function analyzeDocumentFast(
  documentText: string,
  docType: string
): Promise<any> { 
  const startTime = Date.now();
  try {
    const systemPrompt = getSystemPrompt(docType);
    
    const response = await cerebras.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analyze this document:\n\n${documentText.slice(0, 50000)}` },
      ],
      temperature: 0.1,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    });

    const analysisTime = Date.now() - startTime;
    const content = (response.choices as any)?.[0]?.message?.content || '{}';
    const parsed = safeJsonParse(content);
    const tokensUsed = (response.usage as any)?.total_tokens || 0;
    
    logger.info('Cerebras analysis completed', { docType, analysisTime: `${analysisTime}ms`, tokensUsed });

    return { ...parsed, analysisTime };
  } catch (error) {
    logger.error('Cerebras analysis API call failed:', error);
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

    return (response.choices as any)?.[0]?.message?.content || 'I cannot answer that question.';
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
      const content = (chunk.choices as any)?.[0]?.delta?.content;
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
    Legal: `You are a legal document analyzer. Analyze the provided document and return a SINGLE JSON object.
    The JSON object must have this exact structure:
    {
      "riskScore": number (0-100),
      "contractInfo": { "title": string, "parties": [string], "effectiveDate": string, "termDate": string, "value": string, "pages": number },
      "riskyClauses": [ { "clause": string, "section": string, "risk": "high" | "moderate" | "low", "description": string } ],
      "keyTerms": [ { "term": "Term Name", "value": "Net 30", "status": "standard" | "favorable" | "neutral" | "unfavorable" } ],
      "recommendations": [string],
      "summary": { "executiveSummary": string, "criticalRisks": [string], "recommendedActions": [string] }
    }`,
    Medical: `You are a medical document analyzer. Analyze the provided document and return a SINGLE JSON object.
    The JSON object must have this exact structure:
    {
      "urgencyScore": number (0-100),
      "patientInfo": { "name": string, "age": number, "gender": string, "mrn": string },
      "vitalSigns": [ { "sign": "Blood Pressure", "value": "120/80 mmHg", "status": "normal" | "elevated" | "low" } ],
      "abnormalFindings": [ { "finding": string, "severity": "high" | "moderate" | "low", "details": string } ],
      "medications": [ { "name": "Lisinopril", "dosage": "10mg", "notes": string } ],
      "recommendations": [string],
      "summary": { "executiveSummary": string, "keyConcerns": [string], "followUpActions": [string] }
    }`,
    General: `You are a general document analyzer. Analyze the provided document and return a SINGLE JSON object.
    The JSON object must have this exact structure:
    {
      "priorityLevel": number (0-100),
      "documentInfo": { "title": string, "type": string, "created": string, "pages": number },
      "keyPoints": [ { "point": string, "category": string, "priority": "high" | "moderate" | "low", "confidence": number } ],
      "actionItems": [string],
      "timeline": [ { "event": "Event Name", "date": "YYYY-MM-DD", "status": "completed" | "upcoming" | "planned" } ],
      "summary": { "executiveSummary": string, "mainInsights": [string], "nextSteps": [string] }
    }`,
  };

  return prompts[docType as keyof typeof prompts] || prompts.General;
}