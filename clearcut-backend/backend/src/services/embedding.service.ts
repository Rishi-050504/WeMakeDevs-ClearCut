import { pipeline, env } from '@xenova/transformers';
import { logger } from '../utils/logger.js';

// Disable local model cache for production
env.allowLocalModels = false;
env.useBrowserCache = false;

let embeddingPipeline: any = null;

export async function initializeEmbeddings(): Promise<void> {
  try {
    logger.info('Loading embedding model...');
    embeddingPipeline = await pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2'
    );
    logger.info('Embedding model loaded successfully');
  } catch (error) {
    logger.error('Failed to load embedding model:', error);
    throw error;
  }
}

export async function generateEmbedding(text: string): Promise<number[]> {
  if (!embeddingPipeline) {
    await initializeEmbeddings();
  }

  try {
    const output = await embeddingPipeline(text, {
      pooling: 'mean',
      normalize: true,
    });

    return Array.from(output.data);
  } catch (error) {
    logger.error('Embedding generation failed:', error);
    throw error;
  }
}

export async function generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
  const embeddings: number[][] = [];
  
  for (const text of texts) {
    const embedding = await generateEmbedding(text);
    embeddings.push(embedding);
  }
  
  return embeddings;
}