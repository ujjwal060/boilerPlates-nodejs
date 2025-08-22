import express from 'express';
import logger from './utils/logger';
import { errorHandler } from './middlewares/error.handler';
import authRoutes from './features/auth/auth.routes';

// Feature routes
// import userRoutes from './features/users/user.routes'; 
// import authRoutes from './features/auth/auth.routes';

const app = express();

app.use(express.json()); 

// You might add other middlewares here, such as:
// app.use(express.urlencoded({ extended: true })); // For URL-encoded bodies
// app.use(cookieParser()); // If using cookies
// app.use(compression()); // For response compression
// app.use(cors()); // For Cross-Origin Resource Sharing

// Health Check Route (Basic)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Application is healthy' });
  logger.info('Health check endpoint accessed.');
});

// Register Feature Routes
app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);

app.use(errorHandler);

export default app;
