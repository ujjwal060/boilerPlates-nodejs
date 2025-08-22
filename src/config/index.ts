import dotenv from 'dotenv';
import { getSecret } from '../utils/secretManager';
import logger from '../utils/logger';

dotenv.config();

interface AppConfig {
    port: number;
    databaseUrl: string;
    jwtSecret: string;
    awsRegion: string;
    nodeEnv: string;
}

const config: AppConfig = {
    port: Number.parseInt(process.env.PORT || '3000', 10),
    databaseUrl: process.env.DATABASE_URL || process.env.MONGODB_URI || '',
    jwtSecret: process.env.JWT_SECRET || '',
    awsRegion: process.env.AWS_REGION || 'us-east-1',
    nodeEnv: process.env.NODE_ENV || 'development',
};

export async function loadConfig(): Promise<AppConfig> {
    logger.info(`Loading configuration for env: ${config.nodeEnv}`);

    if (config.nodeEnv === 'production') {
        const dbSecretName = process.env.DB_SECRET_NAME;
        const jwtSecretName = process.env.JWT_SECRET_NAME;

        if (!dbSecretName || !jwtSecretName) {
            logger.error('DB_SECRET_NAME and JWT_SECRET_NAME must be set in production.');
            process.exit(1);
        }

        try {
            const dbSecretString = await getSecret(dbSecretName);
            const dbCredentials = JSON.parse(dbSecretString);
            const { username, password, host, port, dbname, connectionString } = dbCredentials;
            config.databaseUrl = connectionString || `mongodb://${username}:${password}@${host}:${port}/${dbname}`;
        } catch (err) {
            logger.error('Failed to load database secret from AWS Secrets Manager in production.', err);
            process.exit(1);
        }

        try {
            const jwtSecretString = await getSecret(jwtSecretName);
            const jwtSecrets = JSON.parse(jwtSecretString);
            config.jwtSecret = jwtSecrets.JWT_SECRET_KEY || jwtSecrets.secret;
            if (!config.jwtSecret) throw new Error('JWT secret key missing in secret payload');
        } catch (err) {
            logger.error('Failed to load JWT secret from AWS Secrets Manager in production.', err);
            process.exit(1);
        }
    } else {
        if (!config.jwtSecret) {
            config.jwtSecret = 'dev-only-secret-change-me';
        }
        if (!config.databaseUrl) {
            logger.warn('DATABASE_URL not set for non-production. DB connection will be skipped.');
        }
    }

    logger.info('Application configuration loaded');
    return config;
}

export default config;
