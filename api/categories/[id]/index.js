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

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false });
  isConnected = true;
}

export default async (req, res) => {
  try {
    await connectDB();

    const { id } = req.query;

    if (req.method === 'PUT') {
      const { label, icon, color, budget } = req.body;

     // Try to find by custom id first, then by MongoDB _id
const category = await Category.findOne({ 
  $or: [{ id }, { _id: id }] 
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