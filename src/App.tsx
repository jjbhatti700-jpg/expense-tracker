import { useState, useMemo } from 'react'
import { 
  Sun, 
  Moon, 
  Plus, 
  Trash2, 
  Wallet,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  BarChart3,
  Edit3,
  Loader2,
  AlertCircle,
  RefreshCw,
  Download,
  FileText,
  FileSpreadsheet,
  Tag,
  Target,
  LogOut,
  Mail,
  Send
} from 'lucide-react'
import { useTransactions, useTheme, useCurrency, useCategories, useAuth } from './context'
import { 
  Button, 
  Input, 
  Select, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  Modal, 
  Icon,
  CategoryPieChart,
  MonthlyBarChart,
  TransactionFilters
} from './components'
import CategoryManager from './components/categories/CategoryManager'
import BudgetProgress from './components/budget/BudgetProgress'
import AuthForm from './components/auth/AuthForm'
import { getCurrencyOptions } from './utils/constants'
import { formatDate, formatDateForInput, filterTransactions } from './utils/helpers'
import { exportToCSV, exportToPDF } from './utils/export'
import { emailApi } from './services'
import { 
  NewTransaction, 
  Transaction,
  Category, 
  TransactionType, 
  CurrencyCode,
  TransactionFilters as FilterType
} from './types'
import './App.css'

// Initial filter state
const INITIAL_FILTERS: FilterType = {
  type: 'all',
  category: 'all',
  searchTerm: '',
  startDate: null,
  endDate: null,
}

function App(): JSX.Element {
  // ====================================
  // AUTH CONTEXT
  // ====================================
  const { isAuthenticated, isLoading: authLoading, user, logout } = useAuth()

  // ====================================
  // CONTEXT
  // ====================================
  const { 
    transactions, 
    isLoading,
    error,
    addTransaction, 
    updateTransaction,
    deleteTransaction,
    refreshTransactions,
    totalIncome,
    totalExpenses,
    balance 
  } = useTransactions()
  
  const { isDarkMode, toggleTheme } = useTheme()
  const { currency, setCurrency, formatAmount, currencySymbol } = useCurrency()
  const { categories, getCategoriesMap } = useCategories()

  // Get categories as a map for easy lookup
  const CATEGORIES = getCategoriesMap()

  // ====================================
  // LOCAL STATE
  // ====================================
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [settingsTab, setSettingsTab] = useState<'general' | 'categories' | 'email'>('general')
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [filters, setFilters] = useState<FilterType>(INITIAL_FILTERS)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [emailStatus, setEmailStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  
  const [formData, setFormData] = useState<NewTransaction>({
    type: 'expense',
    amount: 0,
    category: 'food',
    description: '',
    date: formatDateForInput(),
  })

  // ====================================
  // FILTERED TRANSACTIONS
  // ====================================
  const filteredTransactions = useMemo(() => {
    const filtered = filterTransactions(transactions, filters)
    return filtered.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }, [transactions, filters])

  // ====================================
  // HANDLERS
  // ====================================
  
  const handleOpenModal = () => {
    setEditingTransaction(null)
    setFormData({
      type: 'expense',
      amount: 0,
      category: 'food',
      description: '',
      date: formatDateForInput(),
    })
    setIsModalOpen(true)
  }

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setFormData({
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description,
      date: transaction.date.split('T')[0], // Handle ISO date format
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async () => {
    if (!formData.description || formData.amount <= 0) {
      alert('Please fill in all fields correctly')
      return
    }

    setIsSubmitting(true)
    
    try {
      if (editingTransaction) {
        const id = editingTransaction.id || (editingTransaction as any)._id
        await updateTransaction(id, formData)
      } else {
        await addTransaction(formData)
      }
      
      setIsModalOpen(false)
      setEditingTransaction(null)
    } catch (err) {
      alert('Failed to save transaction. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id)
      } catch (err) {
        alert('Failed to delete transaction. Please try again.')
      }
    }
  }

  const handleClearFilters = () => {
    setFilters(INITIAL_FILTERS)
  }

  // ====================================
  // EMAIL HANDLERS
  // ====================================
  const handleSendReport = async (period: 'week' | 'month' | 'year') => {
    setIsSendingEmail(true)
    setEmailStatus(null)
    
    try {
      await emailApi.sendReport(period, currencySymbol)
      setEmailStatus({ type: 'success', message: 'Report sent to your email!' })
    } catch (err: any) {
      setEmailStatus({ type: 'error', message: err.message || 'Failed to send report' })
    } finally {
      setIsSendingEmail(false)
    }
  }

  const handleTestEmail = async () => {
    setIsSendingEmail(true)
    setEmailStatus(null)
    
    try {
      await emailApi.testEmail()
      setEmailStatus({ type: 'success', message: 'Test email sent!' })
    } catch (err: any) {
      setEmailStatus({ type: 'error', message: err.message || 'Failed to send test email. Check server configuration.' })
    } finally {
      setIsSendingEmail(false)
    }
  }

  // ====================================
  // OPTIONS
  // ====================================
  const categoryOptions = categories
    .filter(cat => formData.type === 'income' ? cat.id === 'income' : cat.id !== 'income')
    .map(cat => ({
      value: cat.id,
      label: cat.label,
    }))

  const typeOptions = [
    { value: 'expense', label: 'Expense' },
    { value: 'income', label: 'Income' },
  ]

  // ====================================
  // AUTH LOADING STATE
  // ====================================
  if (authLoading) {
    return (
      <div className="loading-container">
        <Loader2 size={48} className="spinner" />
        <p>Loading...</p>
      </div>
    )
  }

  // ====================================
  // NOT AUTHENTICATED - SHOW LOGIN
  // ====================================
  if (!isAuthenticated) {
    return <AuthForm />
  }

  // ====================================
  // LOADING STATE
  // ====================================
  if (isLoading) {
    return (
      <div className="loading-container">
        <Loader2 size={48} className="spinner" />
        <p>Loading your transactions...</p>
      </div>
    )
  }

  // ====================================
  // ERROR STATE
  // ====================================
  if (error) {
    return (
      <div className="error-container">
        <AlertCircle size={48} />
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <Button variant="primary" onClick={refreshTransactions}>
          <RefreshCw size={16} />
          Try Again
        </Button>
      </div>
    )
  }

  // ====================================
  // RENDER
  // ====================================
  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="app-header">
        <div className="header-left">
          <div className="logo">
            <Wallet size={28} strokeWidth={2} />
            <h1>ExpenseFlow</h1>
          </div>
          <p className="tagline">Personal Finance Tracker</p>
        </div>
        <div className="header-right">
          <span className="user-greeting">Hi, {user?.name?.split(' ')[0] || 'User'}</span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={refreshTransactions}
            title="Refresh"
          >
            <RefreshCw size={18} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings size={18} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={logout}
            title="Logout"
            className="logout-btn"
          >
            <LogOut size={18} />
          </Button>
        </div>
      </header>

      {/* SUMMARY CARDS */}
      <section className="summary-section">
        <Card className="summary-card balance-card">
          <CardContent>
            <div className="summary-icon">
              <Wallet size={24} />
            </div>
            <div className="summary-info">
              <span className="summary-label">Total Balance</span>
              <span className={`summary-value ${balance >= 0 ? 'positive' : 'negative'}`}>
                {formatAmount(balance)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="summary-card income-card">
          <CardContent>
            <div className="summary-icon income">
              <ArrowUpRight size={24} />
            </div>
            <div className="summary-info">
              <span className="summary-label">Total Income</span>
              <span className="summary-value positive">
                {formatAmount(totalIncome)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="summary-card expense-card">
          <CardContent>
            <div className="summary-icon expense">
              <ArrowDownRight size={24} />
            </div>
            <div className="summary-info">
              <span className="summary-label">Total Expenses</span>
              <span className="summary-value negative">
                {formatAmount(totalExpenses)}
              </span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CHARTS SECTION */}
      <section className="charts-section">
        <Card className="chart-card">
          <CardHeader>
            <CardTitle>
              <PieChart size={18} />
              Spending by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryPieChart />
          </CardContent>
        </Card>

        <Card className="chart-card">
          <CardHeader>
            <CardTitle>
              <BarChart3 size={18} />
              Monthly Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyBarChart />
          </CardContent>
        </Card>
      </section>

      {/* BUDGET PROGRESS */}
      <section className="budget-section">
        <Card>
          <CardHeader>
            <CardTitle>
              <Target size={18} />
              Budget Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BudgetProgress />
          </CardContent>
        </Card>
      </section>

      {/* TRANSACTIONS */}
      <section className="transactions-section">
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <div className="header-actions">
              <div className="export-buttons">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => exportToCSV(filteredTransactions)}
                  disabled={filteredTransactions.length === 0}
                  title="Export to CSV"
                >
                  <FileSpreadsheet size={16} />
                  CSV
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => exportToPDF(
                    filteredTransactions,
                    { totalIncome, totalExpenses, balance },
                    currencySymbol
                  )}
                  disabled={filteredTransactions.length === 0}
                  title="Export to PDF"
                >
                  <FileText size={16} />
                  PDF
                </Button>
              </div>
              <Button variant="primary" size="sm" onClick={handleOpenModal}>
                <Plus size={16} />
                Add Transaction
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* FILTERS */}
            <TransactionFilters
              filters={filters}
              onFilterChange={setFilters}
              onClearFilters={handleClearFilters}
            />

            {/* RESULTS COUNT */}
            <div className="results-info">
              <span>
                Showing {filteredTransactions.length} of {transactions.length} transactions
              </span>
            </div>

            {/* TRANSACTION LIST */}
            {filteredTransactions.length === 0 ? (
              <div className="empty-state">
                <Wallet size={48} strokeWidth={1} />
                <p>No transactions found</p>
                <span>
                  {transactions.length === 0 
                    ? 'Add your first transaction to get started'
                    : 'Try adjusting your filters'
                  }
                </span>
              </div>
            ) : (
              <div className="transaction-list">
                {filteredTransactions.map(transaction => {
                  const transactionId = transaction.id || (transaction as any)._id
                  return (
                    <div key={transactionId} className="transaction-item">
                      <div className="transaction-left">
                        <div 
                          className="transaction-icon"
                          style={{ backgroundColor: CATEGORIES[transaction.category]?.color + '20' }}
                        >
                          <Icon 
                            name={CATEGORIES[transaction.category]?.icon || 'Package'} 
                            size={20}
                            color={CATEGORIES[transaction.category]?.color}
                          />
                        </div>
                        <div className="transaction-details">
                          <span className="transaction-description">
                            {transaction.description}
                          </span>
                          <span className="transaction-meta">
                            {CATEGORIES[transaction.category]?.label} • {formatDate(transaction.date)}
                          </span>
                        </div>
                      </div>
                      <div className="transaction-right">
                        <span className={`transaction-amount ${transaction.type}`}>
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatAmount(transaction.amount)}
                        </span>
                        <div className="transaction-actions">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEdit(transaction)}
                            className="edit-btn"
                          >
                            <Edit3 size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(transactionId)}
                            className="delete-btn"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* ADD/EDIT TRANSACTION MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingTransaction(null)
        }}
        title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
        size="sm"
      >
        <div className="form-container">
          <Select
  label="Transaction Type"
  options={typeOptions}
  value={formData.type}
  onChange={(e) => {
    const newType = e.target.value as TransactionType
    setFormData(prev => ({
      ...prev,
      type: newType,
      // Only reset category when switching TO income
      category: newType === 'income' 
        ? 'income' 
        : (prev.type === 'income' ? (categories.find(c => c.id !== 'income')?.id || 'food') : prev.category),
    }))
  }}
/>

          <Input
            label="Amount"
            type="number"
            placeholder="0.00"
            value={formData.amount || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              amount: parseFloat(e.target.value) || 0
            }))}
          />

          <Input
            label="Description"
            placeholder="What was this transaction for?"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              description: e.target.value
            }))}
          />

          <Select
            label="Category"
            options={categoryOptions}
            value={formData.category}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              category: e.target.value as Category
            }))}
          />

          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              date: e.target.value
            }))}
          />

          <div className="form-actions">
            <Button 
              variant="secondary" 
              fullWidth
              onClick={() => {
                setIsModalOpen(false)
                setEditingTransaction(null)
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
              {editingTransaction ? 'Save Changes' : 'Add Transaction'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* SETTINGS MODAL */}
      <Modal
        isOpen={isSettingsOpen}
        onClose={() => {
          setIsSettingsOpen(false)
          setSettingsTab('general')
        }}
        title="Settings"
        size="md"
      >
        <div className="settings-container">
          {/* Settings Tabs */}
          <div className="settings-tabs">
            <button
              className={`settings-tab ${settingsTab === 'general' ? 'active' : ''}`}
              onClick={() => setSettingsTab('general')}
            >
              <Settings size={16} />
              General
            </button>
            <button
              className={`settings-tab ${settingsTab === 'categories' ? 'active' : ''}`}
              onClick={() => setSettingsTab('categories')}
            >
              <Tag size={16} />
              Categories
            </button>
            <button
              className={`settings-tab ${settingsTab === 'email' ? 'active' : ''}`}
              onClick={() => {
                setSettingsTab('email')
                setEmailStatus(null)
              }}
            >
              <Mail size={16} />
              Email
            </button>
          </div>

          {/* General Tab */}
          {settingsTab === 'general' && (
            <div className="form-container">
              {/* Theme Setting */}
              <div className="settings-group">
                <label className="settings-label">Theme</label>
                <div className="theme-toggle-buttons">
                  <button
                    className={`theme-btn ${isDarkMode ? 'active' : ''}`}
                    onClick={() => !isDarkMode && toggleTheme()}
                  >
                    <Moon size={16} />
                    Dark
                  </button>
                  <button
                    className={`theme-btn ${!isDarkMode ? 'active' : ''}`}
                    onClick={() => isDarkMode && toggleTheme()}
                  >
                    <Sun size={16} />
                    Light
                  </button>
                </div>
              </div>

              {/* Currency Setting */}
              <Select
                label="Currency"
                options={getCurrencyOptions()}
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              />

              {/* Divider */}
              <hr className="settings-divider" />

              {/* Data Management */}
              <div className="settings-group">
                <label className="settings-label">Data Management</label>
                <p className="settings-description">
                  Total transactions: {transactions.length}
                </p>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={refreshTransactions}
                >
                  <RefreshCw size={14} />
                  Refresh Data
                </Button>
              </div>

              <p className="settings-note">
                All settings are saved automatically.
              </p>
            </div>
          )}

          {/* Categories Tab */}
          {settingsTab === 'categories' && (
            <CategoryManager />
          )}

          {/* Email Tab */}
          {settingsTab === 'email' && (
            <div className="form-container">
              {/* Status Message */}
              {emailStatus && (
                <div className={`email-status ${emailStatus.type}`}>
                  {emailStatus.message}
                </div>
              )}

              {/* Send Report */}
              <div className="settings-group">
                <label className="settings-label">Send Expense Report</label>
                <p className="settings-description">
                  Get a detailed report of your expenses sent to your email.
                </p>
                <div className="email-buttons">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleSendReport('week')}
                    disabled={isSendingEmail}
                  >
                    <Send size={14} />
                    Weekly
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleSendReport('month')}
                    disabled={isSendingEmail}
                  >
                    <Send size={14} />
                    Monthly
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleSendReport('year')}
                    disabled={isSendingEmail}
                  >
                    <Send size={14} />
                    Yearly
                  </Button>
                </div>
              </div>

              <hr className="settings-divider" />

              {/* Test Email */}
              <div className="settings-group">
                <label className="settings-label">Test Email Configuration</label>
                <p className="settings-description">
                  Send a test email to verify your email setup is working.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleTestEmail}
                  disabled={isSendingEmail}
                  isLoading={isSendingEmail}
                >
                  <Mail size={14} />
                  Send Test Email
                </Button>
              </div>

              <p className="settings-note">
                Emails are sent to your registered email address.
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default App