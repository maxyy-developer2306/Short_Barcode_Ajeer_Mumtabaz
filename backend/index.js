import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import workerRoutes from './routes/workerRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Database Connection
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/workers', workerRoutes);

app.get('/', (req, res) => {
  res.send('API is running successfully...');
});

// Database Status Check API
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  // mongoose.connection.readyState values: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  
  if (dbState === 1) {
    res.status(200).json({ 
      status: 'success', 
      message: 'Database is connected successfully! ✅',
      dbState: dbState 
    });
  } else {
    res.status(500).json({ 
      status: 'error', 
      message: 'Database is NOT connected! ❌', 
      dbState: dbState 
    });
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});