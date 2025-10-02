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
    name: 'timeline-builder',
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
        name: 'construct_timeline',
        description: 'Build chronological timeline from document',
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
        name: 'identify_deadlines',
        description: 'Identify critical deadlines and dates',
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

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'construct_timeline':
        return await constructTimeline(args.text);
      
      case 'identify_deadlines':
        return await identifyDeadlines(args.text);
      
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

async function constructTimeline(text: string) {
  const response = await cerebras.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: 'Extract all dates and events. Build chronological timeline. Return as JSON array sorted by date.',
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

  const content = response.choices[0]?.message?.content || '{"timeline": []}';
  
  return {
    content: [
      {
        type: 'text',
        text: content,
      },
    ],
  };
}

async function identifyDeadlines(text: string) {
  const response = await cerebras.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: 'Identify critical deadlines, due dates, and time-sensitive obligations. Return as JSON.',
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

  const content = response.choices[0]?.message?.content || '{"deadlines": []}';
  
  return {
    content: [
      {
        type: 'text',
        text: content,
      },
    ],
  };
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Timeline Builder MCP Server running');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});