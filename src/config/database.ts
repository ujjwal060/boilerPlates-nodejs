import mongoose from 'mongoose';
import logger from '../utils/logger'; 
import config from './index';

async function connectMongoDB(): Promise<void> {
  if (!config.databaseUrl) {
    logger.warn('DATABASE_URL not configured. Skipping MongoDB connection.');
    return;
  }
  try {
    await mongoose.connect(config.databaseUrl, {});
    logger.info('MongoDB connected successfully!');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    // Do not crash in development if DB is unavailable
    if (config.nodeEnv === 'production') {
      process.exit(1);
    } else {
      logger.warn('Continuing without database connection in non-production environment.');
    }
  }
}

async function disconnectMongoDB(): Promise<void> {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected.');
  } catch (error) {
    logger.error('Error disconnecting MongoDB:', error);
  }
}

mongoose.connection.on('connected', () => {
  logger.debug('Mongoose default connection open');
});

mongoose.connection.on('error', (err) => {
  logger.error('Mongoose default connection error: ' + err);
});

mongoose.connection.on('disconnected', () => {
  logger.debug('Mongoose default connection disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('Mongoose default connection disconnected through app termination');
  process.exit(0);
});

export { 
  connectMongoDB, 
  disconnectMongoDB 
}; 
