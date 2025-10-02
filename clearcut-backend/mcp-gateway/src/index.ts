import express from 'express';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 8811;

// Load the MCP configuration
const configPath = '/app/config.json';
const mcpConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

app.get('/sse/:serverName', (req, res) => {
  const { serverName } = req.params;
  const serverConfig = mcpConfig.mcpServers[serverName];

  if (!serverConfig) {
    return res.status(404).json({ error: `Server config for ${serverName} not found` });
  }

  console.log(`[Gateway] Received request for MCP server: ${serverName}`);

  // Set headers for Server-Sent Events (SSE)
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Spawn the docker command as a child process
  const child = spawn(serverConfig.command, serverConfig.args, {
    env: { ...process.env, ...serverConfig.env }
  });

  // The MCP SDK communicates over stdin/stdout
  // Pipe stdout from the MCP microservice directly to the HTTP response
  child.stdout.pipe(res);

  // Forward stdin from the HTTP request to the child process
  req.pipe(child.stdin);

  child.stderr.on('data', (data) => {
    console.error(`[${serverName} stderr] ${data.toString()}`);
  });

  child.on('close', (code) => {
    console.log(`[Gateway] MCP server ${serverName} process exited with code ${code}`);
    res.end();
  });

  req.on('close', () => {
    console.log(`[Gateway] Client disconnected, killing ${serverName} process.`);
    child.kill();
  });
});

app.listen(PORT, () => {
  console.log(`MCP Gateway listening on port ${PORT}`);
});