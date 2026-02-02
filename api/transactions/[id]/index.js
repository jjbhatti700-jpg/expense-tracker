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

    const { id } = req.query;

    // PUT - Update transaction
    if (req.method === 'PUT') {
      const { type, amount, category, description, date } = req.body;

      const transaction = await Transaction.findOneAndUpdate(
        { _id: id, user: decoded.id },
        { type, amount, category, description, date },
        { new: true, runValidators: true }
      );

      if (!transaction) {
        return res.status(404).json({ success: false, message: 'Transaction not found' });
      }

      return res.status(200).json({ success: true, data: transaction });
    }

    // DELETE - Delete transaction
    if (req.method === 'DELETE') {
      const transaction = await Transaction.findOneAndDelete({ _id: id, user: decoded.id });

      if (!transaction) {
        return res.status(404).json({ success: false, message: 'Transaction not found' });
      }

      return res.status(200).json({ success: true, message: 'Transaction deleted' });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });

  } catch (error) {
    console.error('Transaction error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};