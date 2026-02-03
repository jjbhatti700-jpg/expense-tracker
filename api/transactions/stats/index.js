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

    if (req.method === 'GET') {
      const userId = new mongoose.Types.ObjectId(decoded.id);

      // Total income
      const incomeResult = await Transaction.aggregate([
        { $match: { user: userId, type: 'income' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]);

      // Total expenses
      const expenseResult = await Transaction.aggregate([
        { $match: { user: userId, type: 'expense' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]);

      // Expenses by category
      const categoryBreakdown = await Transaction.aggregate([
        { $match: { user: userId, type: 'expense' } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } },
        { $sort: { total: -1 } },
      ]);

      const totalIncome = incomeResult[0]?.total || 0;
      const totalExpenses = expenseResult[0]?.total || 0;

      return res.status(200).json({
        success: true,
        data: {
          totalIncome,
          totalExpenses,
          balance: totalIncome - totalExpenses,
          categoryBreakdown,
        },
      });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};