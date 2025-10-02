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
    name: 'fact-verifier',
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
        name: 'verify_claim',
        description: 'Verify if a claim is supported by document',
        inputSchema: {
          type: 'object',
          properties: {
            text: { type: 'string', description: 'Document text' },
            claim: { type: 'string', description: 'Claim to verify' },
          },
          required: ['text', 'claim'],
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

    if (name === 'verify_claim') {
      const { text, claim } = args as { text: string; claim: string };
      if (!text || !claim) {
        throw new Error('Missing required arguments: text and claim');
      }
      return await verifyClaim(text, claim);
    }
    throw new Error(`Unknown tool: ${name}`);
  } catch (error: any) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

async function verifyClaim(text: string, claim: string) {
  const response = await cerebras.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: 'Verify the claim against the document. Return JSON with: verdict (SUPPORTED/NOT_SUPPORTED/PARTIAL), confidence (0-1), evidence (array of text excerpts).',
      },
      {
        role: 'user',
        content: `Document: ${text.slice(0, 8000)}\n\nClaim: ${claim}`,
      },
    ],
    temperature: 0.1,
    max_tokens: 1024,
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
  console.error('Fact Verifier MCP Server running');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});