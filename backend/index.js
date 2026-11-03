import dns from 'dns';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import workerRoutes from './routes/workerRoutes.js';

dotenv.config();

// Local fix: force Google and Cloudflare DNS so the MongoDB Atlas SRV lookup works.
// Not needed on Vercel, so it only runs outside production.
// connectDB() runs per request (after this line), so the DNS servers are set in time.
if (process.env.NODE_ENV !== 'production') {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
}

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true
}));

// Database Middleware for Serverless
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database Connection Middleware Error:', error);
    res.status(500).json({ message: 'Database connection failed', error: error.message });
  }
});

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

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
}

export default app;