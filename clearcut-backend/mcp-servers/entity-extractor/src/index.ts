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
    name: 'entity-extractor',
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
        name: 'extract_all_entities',
        description: 'Extract all entities (people, organizations, dates, amounts)',
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
        name: 'build_relationships',
        description: 'Build relationships between entities',
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
      case 'extract_all_entities':
        return await extractEntities(args.text);
      
      case 'build_relationships':
        return await buildRelationships(args.text);
      
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

async function extractEntities(text: string) {
  const response = await cerebras.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: `Extract all entities from the text. Return JSON with categories: people, organizations, dates, amounts, locations.`,
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

  const content = response.choices[0]?.message?.content || '{"entities": {}}';
  
  return {
    content: [
      {
        type: 'text',
        text: content,
      },
    ],
  };
}

async function buildRelationships(text: string) {
  const response = await cerebras.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: 'Identify relationships between entities. Return as JSON array.',
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

  const content = response.choices[0]?.message?.content || '{"relationships": []}';
  
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
  console.error('Entity Extractor MCP Server running');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});