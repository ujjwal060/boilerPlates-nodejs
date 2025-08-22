import app from './app';
import { loadConfig } from './config';
import { connectMongoDB, disconnectMongoDB } from './config/database';
import logger from './utils/logger';

async function startServer() {
    try {
        const config = await loadConfig(); 
        await connectMongoDB();
        const PORT = config.port;

        app.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT} in ${config.nodeEnv} environment`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1); 
    }
}

startServer();
