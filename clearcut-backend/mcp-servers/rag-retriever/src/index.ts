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
    name: 'rag-retriever',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'rerank_results',
        description: 'Rerank search results for better relevance',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string' },
            results: { type: 'array' },
          },
          required: ['query', 'results'],
        },
      },
      {
        name: 'suggest_questions',
        description: 'Suggest follow-up questions based on document',
        inputSchema: {
          type: 'object',
          properties: {
            text: { type: 'string' },
          },
          required: ['text'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (!args || typeof args !== 'object') {
      throw new Error('Invalid arguments');
    }

    if (name === 'suggest_questions') {
      const { text } = args as { text: string };
      if (!text) {
        throw new Error('Missing required argument: text');
      }
      return await suggestQuestions(text);
    }
    throw new Error(`Unknown tool: ${name}`);
  } catch (error: any) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

async function suggestQuestions(text: string) {
  const response = await cerebras.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: 'Generate 5 insightful questions about this document. Return as JSON array.',
      },
      {
        role: 'user',
        content: text.slice(0, 5000),
      },
    ],
    temperature: 0.7,
    max_tokens: 512,
    response_format: { type: 'json_object' },
  });

  const content = (response.choices as any)?.[0]?.message?.content || '{}';
  
  return {
    content: [{ type: 'text', text: content }],
  };
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('RAG Retriever MCP Server running');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});