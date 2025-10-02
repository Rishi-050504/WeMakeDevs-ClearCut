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
    switch (name) {
      case 'analyze_document':
        return await analyzeDocument(args.text, args.type);
      
      case 'extract_clauses':
        return await extractClauses(args.text);
      
      case 'risk_assessment':
        return await assessRisk(args.text);
      
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

  const content = response.choices[0]?.message?.content || '{}';
  
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

  const content = response.choices[0]?.message?.content || '{"clauses": []}';
  
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

  const content = response.choices[0]?.message?.content || '{"riskScore": 0}';
  
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