import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profiles.js';
import jobRoutes from './routes/jobs.js';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // for parsing application/json

// Connect to Database
connectDB();

// API Routes
app.get('/', (req, res) => res.send('Freelance MVP API is running...'));
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/jobs', jobRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));