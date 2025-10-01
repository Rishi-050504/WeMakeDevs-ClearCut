import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import { logger } from '../utils/logger.js';

const MCP_GATEWAY_URL = process.env.MCP_GATEWAY_URL || 'http://localhost:8811';

interface MCPConnection {
  client: Client;
  transport: SSEClientTransport;
}

const connections = new Map<string, MCPConnection>();

export async function connectToMCPServer(serverName: string): Promise<Client> {
  if (connections.has(serverName)) {
    return connections.get(serverName)!.client;
  }

  try {
    const transport = new SSEClientTransport(
      new URL(`${MCP_GATEWAY_URL}/sse/${serverName}`)
    );

    const client = new Client({
      name: 'clearcut-backend',
      version: '1.0.0',
    }, {
      capabilities: {},
    });

    await client.connect(transport);
    
    connections.set(serverName, { client, transport });
    logger.info(`✅ Connected to MCP server: ${serverName}`);
    
    return client;
  } catch (error) {
    logger.error(`❌ Failed to connect to MCP server ${serverName}:`, error);
    throw error;
  }
}

export async function callMCPTool(
  serverName: string,
  toolName: string,
  args: Record<string, any>
): Promise<any> {
  try {
    const client = await connectToMCPServer(serverName);
    
    const result = await client.callTool({
      name: toolName,
      arguments: args,
    });

    return result;
  } catch (error) {
    logger.error(`MCP tool call failed: ${serverName}.${toolName}`, error);
    throw error;
  }
}

export async function disconnectAllMCPServers(): Promise<void> {
  for (const [name, { client, transport }] of connections) {
    try {
      await client.close();
      logger.info(`Disconnected from MCP server: ${name}`);
    } catch (error) {
      logger.error(`Error disconnecting from ${name}:`, error);
    }
  }
  connections.clear();
}