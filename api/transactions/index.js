import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const TransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  amount: { type: Number, required: true, min: 0.01 },
  category: { type: String, required: true, lowercase: true },
  description: { type: String, required: true, maxlength: 200 },
  date: { type: Date, required: true, default: Date.now },
}, { timestamps: true });

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);

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

    // GET - Fetch all transactions
    if (req.method === 'GET') {
      const { type, category, startDate, endDate, search } = req.query;
      
      const query = { user: decoded.id };
      if (type && type !== 'all') query.type = type;
      if (category && category !== 'all') query.category = category;
      if (startDate) query.date = { ...query.date, $gte: new Date(startDate) };
      if (endDate) query.date = { ...query.date, $lte: new Date(endDate) };
      if (search) query.description = { $regex: search, $options: 'i' };

      const transactions = await Transaction.find(query).sort({ date: -1 });

      return res.status(200).json({
        success: true,
        count: transactions.length,
        data: transactions,
      });
    }

    // POST - Create transaction
    if (req.method === 'POST') {
      const { type, amount, category, description, date } = req.body;

      if (!type || !amount || !category || !description) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }

      const transaction = await Transaction.create({
        user: decoded.id,
        type,
        amount,
        category,
        description,
        date: date || new Date(),
      });

      return res.status(201).json({ success: true, data: transaction });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });

  } catch (error) {
    console.error('Transaction error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};