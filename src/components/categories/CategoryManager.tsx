import { useState } from 'react'
import { Plus, Edit3, Trash2, Tag, Check, X } from 'lucide-react'
import { useCategories } from '../../context'
import { Button, Input, Modal, Icon } from '../ui'
import { NewCategory, CategoryInfo } from '../../types'
import './CategoryManager.css'

// ====================================
// AVAILABLE ICONS
// ====================================

const AVAILABLE_ICONS = [
  'Tag', 'Utensils', 'Car', 'ShoppingBag', 'Clapperboard', 
  'Receipt', 'Heart', 'Wallet', 'Package', 'Home', 
  'Plane', 'Book', 'Gift', 'Coffee', 'Music',
  'Gamepad2', 'Dumbbell', 'Shirt', 'Baby', 'PawPrint',
  'Laptop', 'Phone', 'Tv', 'Camera', 'Scissors'
]

// ====================================
// AVAILABLE COLORS
// ====================================

const AVAILABLE_COLORS = [
  '#f97316', '#ef4444', '#ec4899', '#8b5cf6', '#6366f1',
  '#3b82f6', '#0ea5e9', '#14b8a6', '#22c55e', '#84cc16',
  '#eab308', '#f59e0b', '#78716c', '#64748b', '#71717a'
]

// ====================================
// COMPONENT
// ====================================

function CategoryManager() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryInfo | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState<NewCategory>({
    id: '',
    label: '',
    icon: 'Tag',
    color: '#6366f1',
    budget: null,
  })

  // ====================================
  // HANDLERS
  // ====================================

  const handleOpenModal = () => {
    setEditingCategory(null)
    setFormData({
      id: '',
      label: '',
      icon: 'Tag',
      color: '#6366f1',
      budget: null,
    })
    setIsModalOpen(true)
  }

  const handleEdit = (category: CategoryInfo) => {
    setEditingCategory(category)
    setFormData({
      id: category.id,
      label: category.label,
      icon: category.icon,
      color: category.color,
      budget: category.budget || null,
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (category: CategoryInfo) => {
    if (category.isDefault) {
      alert('Cannot delete default categories')
      return
    }

    if (confirm(`Delete category "${category.label}"?`)) {
      try {
        await deleteCategory(category.id)
      } catch (err) {
        alert('Failed to delete category')
      }
    }
  }

  const handleSubmit = async () => {
    if (!formData.label.trim()) {
      alert('Please enter a category name')
      return
    }

    setIsSubmitting(true)

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          label: formData.label,
          icon: formData.icon,
          color: formData.color,
          budget: formData.budget,
        })
      } else {
        // Generate ID from label
        const id = formData.label.toLowerCase().replace(/\s+/g, '-')
        await addCategory({
          ...formData,
          id,
        })
      }

      setIsModalOpen(false)
      setEditingCategory(null)
    } catch (err: any) {
      alert(err.message || 'Failed to save category')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ====================================
  // RENDER
  // ====================================

  return (
    <div className="category-manager">
      <div className="category-manager-header">
        <h3>Manage Categories</h3>
        <Button variant="primary" size="sm" onClick={handleOpenModal}>
          <Plus size={16} />
          Add Category
        </Button>
      </div>

      <div className="category-list">
        {categories.map(category => (
          <div key={category.id} className="category-item">
            <div className="category-item-left">
              <div 
                className="category-icon-preview"
                style={{ backgroundColor: category.color + '20' }}
              >
                <Icon name={category.icon} size={18} color={category.color} />
              </div>
              <div className="category-item-info">
                <span className="category-label">{category.label}</span>
                {category.isDefault && (
                  <span className="category-badge">Default</span>
                )}
              </div>
            </div>
            <div className="category-item-actions">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(category)}
              >
                <Edit3 size={16} />
              </Button>
              {!category.isDefault && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(category)}
                  className="delete-btn"
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ADD/EDIT CATEGORY MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingCategory(null)
        }}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        size="sm"
      >
        <div className="form-container">
          <Input
            label="Category Name"
            placeholder="e.g., Groceries"
            value={formData.label}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              label: e.target.value,
            }))}
          />

          {/* Icon Selector */}
          <div className="form-group">
            <label className="form-label">Icon</label>
            <div className="icon-grid">
              {AVAILABLE_ICONS.map(iconName => (
                <button
                  key={iconName}
                  type="button"
                  className={`icon-option ${formData.icon === iconName ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, icon: iconName }))}
                  style={{ 
                    borderColor: formData.icon === iconName ? formData.color : undefined,
                    backgroundColor: formData.icon === iconName ? formData.color + '20' : undefined,
                  }}
                >
                  <Icon name={iconName} size={20} color={formData.icon === iconName ? formData.color : undefined} />
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div className="form-group">
            <label className="form-label">Color</label>
            <div className="color-grid">
              {AVAILABLE_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`color-option ${formData.color === color ? 'active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                >
                  {formData.color === color && <Check size={16} color="white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Input */}
          <Input
            label="Monthly Budget (optional)"
            type="number"
            placeholder="0.00"
            value={formData.budget || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              budget: e.target.value ? parseFloat(e.target.value) : null,
            }))}
          />
          <p className="budget-hint">Leave empty for no budget limit</p>

          {/* Preview */}
          <div className="form-group">
            <label className="form-label">Preview</label>
            <div className="category-preview">
              <div 
                className="category-icon-preview"
                style={{ backgroundColor: formData.color + '20' }}
              >
                <Icon name={formData.icon} size={24} color={formData.color} />
              </div>
              <span>{formData.label || 'Category Name'}</span>
            </div>
          </div>

          <div className="form-actions">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                setIsModalOpen(false)
                setEditingCategory(null)
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handleSubmit}
              isLoading={isSubmitting}
            >
              {editingCategory ? 'Save Changes' : 'Add Category'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default CategoryManager