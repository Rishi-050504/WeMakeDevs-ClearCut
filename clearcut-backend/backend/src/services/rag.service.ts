import { qdrantClient, createCollection } from '../config/qdrant.js';
import { generateEmbedding, generateBatchEmbeddings } from './embedding.service.js';
import { logger } from '../utils/logger.js';

interface Chunk {
  text: string;
  startIndex: number;
  endIndex: number;
  chunkIndex: number;
}

interface SearchResult {
  text: string;
  startIndex: number;
  endIndex: number;
  relevanceScore: number;
  chunkIndex: number;
}

const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;

export async function indexDocument(
  documentId: string,
  text: string
): Promise<number> {
  const collectionName = `doc_${documentId}`;
  
  try {
    // Create collection
    await createCollection(collectionName);

    // Split into chunks
    const chunks = splitIntoChunks(text);
    logger.info(`Split document into ${chunks.length} chunks`);

    // Generate embeddings
    const texts = chunks.map(c => c.text);
    const embeddings = await generateBatchEmbeddings(texts);

    // Upload to Qdrant
    const points = chunks.map((chunk, i) => ({
      id: i,
      vector: embeddings[i],
      payload: {
        text: chunk.text,
        startIndex: chunk.startIndex,
        endIndex: chunk.endIndex,
        chunkIndex: chunk.chunkIndex,
      },
    }));

    await qdrantClient.upsert(collectionName, {
      wait: true,
      points,
    });

    logger.info(`Indexed ${chunks.length} chunks for document ${documentId}`);
    return chunks.length;
  } catch (error) {
    logger.error(`RAG indexing failed for document ${documentId}:`, error);
    throw error;
  }
}

export async function semanticSearch(
  documentId: string,
  query: string,
  topK: number = 5
): Promise<SearchResult[]> {
  const collectionName = `doc_${documentId}`;

  try {
    // Generate query embedding
    const queryEmbedding = await generateEmbedding(query);

    // Search Qdrant
    const searchResult = await qdrantClient.search(collectionName, {
      vector: queryEmbedding,
      limit: topK,
      with_payload: true,
    });

    return searchResult.map(result => ({
      text: result.payload?.text as string,
      startIndex: result.payload?.startIndex as number,
      endIndex: result.payload?.endIndex as number,
      relevanceScore: result.score,
      chunkIndex: result.payload?.chunkIndex as number,
    }));
  } catch (error) {
    logger.error(`Semantic search failed for document ${documentId}:`, error);
    throw error;
  }
}

export async function deleteDocumentIndex(documentId: string): Promise<void> {
  const collectionName = `doc_${documentId}`;
  
  try {
    await qdrantClient.deleteCollection(collectionName);
    logger.info(`Deleted index for document ${documentId}`);
  } catch (error) {
    logger.warn(`Failed to delete index for document ${documentId}:`, error);
  }
}

function splitIntoChunks(text: string): Chunk[] {
  const chunks: Chunk[] = [];
  let startIndex = 0;
  let chunkIndex = 0;

  while (startIndex < text.length) {
    const endIndex = Math.min(startIndex + CHUNK_SIZE, text.length);
    const chunkText = text.slice(startIndex, endIndex);

    chunks.push({
      text: chunkText,
      startIndex,
      endIndex,
      chunkIndex,
    });

    startIndex += CHUNK_SIZE - CHUNK_OVERLAP;
    chunkIndex++;
  }

  return chunks;
}

export function formatContextForLLM(searchResults: SearchResult[]): string {
  return searchResults
    .map(
      (result, i) =>
        `[${i + 1}] ${result.text} [chars: ${result.startIndex}-${result.endIndex}]`
    )
    .join('\n\n');
}