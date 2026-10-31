import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Automatically check and create admin from .env
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'WALID0099';

    const existingAdmin = await User.findOne({ username: adminUsername });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      
      await User.create({
        username: adminUsername,
        password: hashedPassword
      });
      console.log(`🚀 Admin user created automatically from .env (Username: ${adminUsername})`);
    } else {
      console.log(`✅ Admin user already exists (${adminUsername})`);
    }

  } catch (error) {
    console.error(`❌ DB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;