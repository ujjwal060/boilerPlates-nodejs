import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import logger from "./logger"; 

const client = new SecretsManagerClient({ 
  region: process.env.AWS_REGION 
});

async function getSecret(secretName: string): Promise<string> {
    try {
        logger.info(`Attempting to retrieve secret: ${secretName}`);
        const data = await client.send(
            new GetSecretValueCommand({ SecretId: secretName })
        );

        if (data.SecretString) {
            logger.info(`Successfully retrieved secret: ${secretName}`);
            return data.SecretString;
        }

        throw new Error(`SecretString not found for secret: ${secretName}`);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        logger.error(`Error retrieving secret "${secretName}": ${errorMessage}`, err);
        throw err; 
    }
}

export { 
  getSecret 
};
