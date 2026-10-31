import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then(async (mongooseInstance) => {
      console.log(`✅ MongoDB Connected`);
      
      // Automatic Admin Seeder
      const adminUsername = process.env.ADMIN_USERNAME || 'admin';
      const adminPassword = process.env.ADMIN_PASSWORD || 'WALID0099';

      const existingAdmin = await User.findOne({ username: adminUsername });
      if (!existingAdmin) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);
        await User.create({ username: adminUsername, password: hashedPassword });
        console.log(`🚀 Admin user created automatically.`);
      }

      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

export default connectDB;