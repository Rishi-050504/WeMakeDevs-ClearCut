import { QdrantClient } from '@qdrant/js-client-rest';
import { logger } from '../utils/logger.js';

const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';
const EMBEDDING_DIMENSION = 384; // all-MiniLM-L6-v2 dimension

export const qdrantClient = new QdrantClient({ url: QDRANT_URL });

export async function initializeQdrant(): Promise<void> {
  try {
    // Test connection
    const health = await qdrantClient.api('cluster').getClusterStatus();
    logger.info('✅ Qdrant connected successfully', { status: health });
  } catch (error) {
    logger.error('❌ Qdrant connection failed:', error);
    throw error;
  }
}

export async function createCollection(collectionName: string): Promise<void> {
  try {
    const exists = await qdrantClient.getCollection(collectionName).catch(() => null);
    
    if (!exists) {
      await qdrantClient.createCollection(collectionName, {
        vectors: {
          size: EMBEDDING_DIMENSION,
          distance: 'Cosine',
        },
        optimizers_config: {
          default_segment_number: 2,
        },
        replication_factor: 1,
      });
      logger.info(`Created Qdrant collection: ${collectionName}`);
    }
  } catch (error) {
    logger.error(`Failed to create collection ${collectionName}:`, error);
    throw error;
  }
}

export async function deleteCollection(collectionName: string): Promise<void> {
  try {
    await qdrantClient.deleteCollection(collectionName);
    logger.info(`Deleted Qdrant collection: ${collectionName}`);
  } catch (error) {
    logger.warn(`Failed to delete collection ${collectionName}:`, error);
  }
}