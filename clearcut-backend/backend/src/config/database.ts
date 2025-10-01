import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

export async function connectDatabase(): Promise<void> {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/clearcut';
    
    await mongoose.connect(uri, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info('✅ MongoDB connected successfully');

    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️  MongoDB disconnected');
    });

  } catch (error) {
    logger.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed');
}