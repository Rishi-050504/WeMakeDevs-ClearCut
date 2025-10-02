import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import Cerebras from '@cerebras/cerebras_cloud_sdk';

const cerebras = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY,
});

const MODEL = 'llama3.3-70b';

const server = new Server(
  {
    name: 'document-analyzer',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool definitions
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'analyze_document',
        description: 'Perform comprehensive document analysis',
        inputSchema: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: 'Document text to analyze',
            },
            type: {
              type: 'string',
              description: 'Document type (Legal, Medical, etc.)',
            },
          },
          required: ['text', 'type'],
        },
      },
      {
        name: 'extract_clauses',
        description: 'Extract key clauses from legal documents',
        inputSchema: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: 'Document text',
            },
          },
          required: ['text'],
        },
      },
      {
        name: 'risk_assessment',
        description: 'Assess risk level in documents',
        inputSchema: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: 'Document text',
            },
          },
          required: ['text'],
        },
      },
    ],
  };
});

// Tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (!args || typeof args !== 'object') {
      throw new Error('Invalid arguments');
    }

    switch (name) {
      case 'analyze_document': {
        const { text, type } = args as { text: string; type: string };
        if (!text || !type) {
          throw new Error('Missing required arguments: text and type');
        }
        return await analyzeDocument(text, type);
      }
      
      case 'extract_clauses': {
        const { text } = args as { text: string };
        if (!text) {
          throw new Error('Missing required argument: text');
        }
        return await extractClauses(text);
      }
      
      case 'risk_assessment': {
        const { text } = args as { text: string };
        if (!text) {
          throw new Error('Missing required argument: text');
        }
        return await assessRisk(text);
      }
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

async function analyzeDocument(text: string, type: string) {
  const response = await cerebras.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: `You are a ${type} document analyzer. Provide detailed analysis in JSON format.`,
      },
      {
        role: 'user',
        content: `Analyze this document:\n\n${text.slice(0, 10000)}`,
      },
    ],
    temperature: 0.1,
    max_tokens: 2048,
    response_format: { type: 'json_object' },
  });

  const content = (response.choices as any)?.[0]?.message?.content || '{}';
  
  return {
    content: [
      {
        type: 'text',
        text: content,
      },
    ],
  };
}

async function extractClauses(text: string) {
  const response = await cerebras.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: 'Extract all important clauses from the legal document. Return as JSON array.',
      },
      {
        role: 'user',
        content: text.slice(0, 10000),
      },
    ],
    temperature: 0.1,
    max_tokens: 1024,
    response_format: { type: 'json_object' },
  });

  const content = (response.choices as any)?.[0]?.message?.content || '{}';
  
  return {
    content: [
      {
        type: 'text',
        text: content,
      },
    ],
  };
}

async function assessRisk(text: string) {
  const response = await cerebras.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: 'Assess risk level (1-100) and identify risk factors. Return as JSON.',
      },
      {
        role: 'user',
        content: text.slice(0, 10000),
      },
    ],
    temperature: 0.1,
    max_tokens: 512,
    response_format: { type: 'json_object' },
  });

  const content = (response.choices as any)?.[0]?.message?.content || '{}';
  
  return {
    content: [
      {
        type: 'text',
        text: content,
      },
    ],
  };
}

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Document Analyzer MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});