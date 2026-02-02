import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false });
  isConnected = true;
}

function verifyToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return null;
  
  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

export default async (req, res) => {
  try {
    await connectDB();

    const decoded = verifyToken(req);
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    // For now, just return success
    // Email functionality can be added later
    return res.status(200).json({ 
      success: true, 
      message: 'Email report feature coming soon' 
    });

  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};