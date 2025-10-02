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
    name: 'legal-analyzer',
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
        name: 'check_compliance',
        description: 'Check compliance with legal standards (GDPR, HIPAA, etc.)',
        inputSchema: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: 'Document text',
            },
            standards: {
              type: 'array',
              items: { type: 'string' },
              description: 'Standards to check',
            },
          },
          required: ['text', 'standards'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'check_compliance') {
      return await checkCompliance(args.text, args.standards);
    }
    throw new Error(`Unknown tool: ${name}`);
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

async function checkCompliance(text: string, standards: string[]) {
  const results: any = {};
  
  for (const standard of standards) {
    const response = await cerebras.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `Check compliance with ${standard}. Return JSON with: compliant (boolean), score (1-100), issues (array), recommendations (array).`,
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

    const content = response.choices[0]?.message?.content || '{}';
    results[standard] = JSON.parse(content);
  }
  
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({ compliance: results }),
      },
    ],
  };
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Legal Analyzer MCP Server running');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});