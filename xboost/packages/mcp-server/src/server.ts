import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';
import { XboostService } from './services/xboost-service.js';
import { registerTools } from './tools/index.js';
import { registerResources } from './resources/index.js';

export interface XboostMcpServerOptions {
  transport?: StreamableHTTPServerTransport;
  port?: number;
  databaseUrl?: string;
}

export async function createXboostMcpServer(options: XboostMcpServerOptions = {}) {
  const {
    port = 3001,
    databaseUrl,
  } = options;

  // Initialize Xboost service
  const xboostService = new XboostService({ databaseUrl });

  // Create MCP server
  const server = new Server(
    {
      name: 'xboost-mcp-server',
      version: '0.1.0',
    },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
    }
  );

  // Register tools
  registerTools(server, xboostService);

  // Register resources
  registerResources(server, xboostService);

  // Create transport if not provided
  const transport = options.transport || new StreamableHTTPServerTransport({
    path: '/mcp',
    port,
  });

  // Connect server to transport
  await server.connect(transport);

  console.error(`Xboost MCP Server running on port ${port}`);
  console.error(`MCP endpoint: http://localhost:${port}/mcp`);

  return { server, transport, xboostService };
}

// Standalone server entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  const PORT = parseInt(process.env.PORT || '3001', 10);
  createXboostMcpServer({ port: PORT }).catch((error) => {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  });
}
