import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import connectDB from './config/db'; // Import MongoDB connection
import userRoutes from './routes/userRoutes';
import playlistRoutes from './routes/playlistRoutes';

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

// Basic Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Express Server!');
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'Healthy', uptime: process.uptime() });
});

app.use('/api/user', userRoutes);
app.use('/api/playlist', playlistRoutes);

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: 'Something went wrong!', error: err.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
