import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  id: { type: String, required: true, lowercase: true },
  label: { type: String, required: true, maxlength: 50 },
  icon: { type: String, required: true, default: 'Tag' },
  color: { type: String, required: true, default: '#6366f1' },
  isDefault: { type: Boolean, default: false },
  budget: { type: Number, default: null, min: 0 },
}, { timestamps: true });

CategorySchema.index({ user: 1, id: 1 }, { unique: true });

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

const DEFAULT_CATEGORIES = [
  { id: 'food', label: 'Food & Dining', icon: 'Utensils', color: '#f97316', isDefault: true },
  { id: 'transport', label: 'Transport', icon: 'Car', color: '#3b82f6', isDefault: true },
  { id: 'shopping', label: 'Shopping', icon: 'ShoppingBag', color: '#ec4899', isDefault: true },
  { id: 'entertainment', label: 'Entertainment', icon: 'Clapperboard', color: '#8b5cf6', isDefault: true },
  { id: 'bills', label: 'Bills & Utilities', icon: 'Receipt', color: '#ef4444', isDefault: true },
  { id: 'health', label: 'Health', icon: 'Heart', color: '#22c55e', isDefault: true },
  { id: 'income', label: 'Income', icon: 'Wallet', color: '#22c55e', isDefault: true },
  { id: 'other', label: 'Other', icon: 'Package', color: '#64748b', isDefault: true },
];

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false });
  isConnected = true;
  
  const count = await Category.countDocuments();
  if (count === 0) {
    await Category.insertMany(DEFAULT_CATEGORIES);
    console.log('✅ Default categories seeded');
  }
}

export default async (req, res) => {
  try {
    await connectDB();
const categoryId = req.query.id || null;

// GET all categories
if (req.method === 'GET' && !categoryId) {
      const categories = await Category.find().sort({ isDefault: -1, label: 1 });
      return res.status(200).json({ success: true, count: categories.length, data: categories });
    }

    // GET single category
  // GET single category
if (req.method === 'GET' && categoryId) {
      const category = await Category.findOne({ 
        $or: [{ id: categoryId }, { _id: categoryId }] 
      });
      
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }

      return res.status(200).json({ success: true, data: category });
    }

    // PUT - Update category
    // PUT - Update category
if (req.method === 'PUT' && categoryId) {
      const { label, icon, color, budget } = req.body;

      const category = await Category.findOne({ 
        $or: [{ id: categoryId }, { _id: categoryId }] 
      });

      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }

      if (label) category.label = label;
      if (icon) category.icon = icon;
      if (color) category.color = color;
      if (budget !== undefined) category.budget = budget;

      await category.save();

      return res.status(200).json({ success: true, data: category });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });

  } catch (error) {
    console.error('Category error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};