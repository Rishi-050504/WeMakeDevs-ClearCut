import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database.js';
import { initializeQdrant } from './config/qdrant.js';
import { initializeEmbeddings } from './services/embedding.service.js';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/error-handler.js';
import { apiLimiter, authLimiter } from './middleware/rate-limit.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import documentRoutes from './routes/document.routes.js';
import chatRoutes from './routes/chat.routes.js';
import analysisRoutes from './routes/analysis.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/documents', apiLimiter, documentRoutes);
app.use('/api/chat', apiLimiter, chatRoutes);
app.use('/api/analysis', apiLimiter, analysisRoutes);

// Error handler
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Startup
async function startServer() {
  try {
    // Connect to databases
    await connectDatabase();
    await initializeQdrant();
    
    // Initialize embedding model
    logger.info('Initializing embedding model...');
    await initializeEmbeddings();
    
    // Start server
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  const { disconnectDatabase } = await import('./config/database.js');
  const { disconnectAllMCPServers } = await import('./config/mcp-client.js');
  
  await disconnectAllMCPServers();
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully...');
  const { disconnectDatabase } = await import('./config/database.js');
  const { disconnectAllMCPServers } = await import('./config/mcp-client.js');
  
  await disconnectAllMCPServers();
  await disconnectDatabase();
  process.exit(0);
});

startServer();