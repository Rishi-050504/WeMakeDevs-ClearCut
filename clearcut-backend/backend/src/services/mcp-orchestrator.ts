import { callMCPTool } from '../config/mcp-client.js';
import { logger } from '../utils/logger.js';

interface OrchestrationResult {
  legalAnalysis?: any;
  entities?: any;
  timeline?: any;
  compliance?: any;
  orchestrationTime: number;
}

export async function orchestrateAnalysis(
  documentText: string,
  docType: string
): Promise<OrchestrationResult> {
  const startTime = Date.now();
  const results: any = {};

  try {
    // Execute all MCP tasks in parallel
    const tasks = [];

    // Task 1: Document Analysis
    tasks.push(
      callMCPTool('document-analyzer', 'analyze_document', {
        text: documentText,
        type: docType,
      }).then(result => {
        results.legalAnalysis = result;
      })
    );

    // Task 2: Entity Extraction
    tasks.push(
      callMCPTool('entity-extractor', 'extract_all_entities', {
        text: documentText,
      }).then(result => {
        results.entities = result;
      })
    );

    // Task 3: Timeline Construction
    tasks.push(
      callMCPTool('timeline-builder', 'construct_timeline', {
        text: documentText,
      }).then(result => {
        results.timeline = result;
      })
    );

    // Task 4: Compliance Check (if legal document)
    if (docType === 'Legal') {
      tasks.push(
        callMCPTool('legal-analyzer', 'check_compliance', {
          text: documentText,
          standards: ['GDPR', 'HIPAA'],
        }).then(result => {
          results.compliance = result;
        })
      );
    }

    // Wait for all tasks
    await Promise.allSettled(tasks);

    const orchestrationTime = Date.now() - startTime;

    logger.info('MCP orchestration completed', {
      docType,
      tasksExecuted: tasks.length,
      orchestrationTime: `${orchestrationTime}ms`,
    });

    return {
      ...results,
      orchestrationTime,
    };
  } catch (error) {
    logger.error('MCP orchestration failed:', error);
    throw error;
  }
}

export async function checkCompliance(
  documentText: string,
  standards: string[]
): Promise<any> {
  try {
    const result = await callMCPTool('legal-analyzer', 'check_compliance', {
      text: documentText,
      standards,
    });

    return result;
  } catch (error) {
    logger.error('Compliance check failed:', error);
    throw error;
  }
}

export async function extractEntities(documentText: string): Promise<any> {
  try {
    const result = await callMCPTool('entity-extractor', 'extract_all_entities', {
      text: documentText,
    });

    return result;
  } catch (error) {
    logger.error('Entity extraction failed:', error);
    throw error;
  }
}

export async function buildTimeline(documentText: string): Promise<any> {
  try {
    const result = await callMCPTool('timeline-builder', 'construct_timeline', {
      text: documentText,
    });

    return result;
  } catch (error) {
    logger.error('Timeline construction failed:', error);
    throw error;
  }
}

export async function verifyClaim(
  documentText: string,
  claim: string
): Promise<any> {
  try {
    const result = await callMCPTool('fact-verifier', 'verify_claim', {
      text: documentText,
      claim,
    });

    return result;
  } catch (error) {
    logger.error('Claim verification failed:', error);
    throw error;
  }
}