import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import workerRoutes from './routes/workerRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true
}));

// Database Connection
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/workers', workerRoutes);

// Health Check API
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  if (dbState === 1) {
    res.status(200).json({ status: 'success', message: 'Database is connected successfully! ✅' });
  } else {
    res.status(500).json({ status: 'error', message: 'Database is NOT connected! ❌', dbState });
  }
});

app.get('/', (req, res) => {
  res.send('API is running successfully...');
});

// Local development ke liye listen karein, Vercel ke liye app export hoga
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
}

export default app;