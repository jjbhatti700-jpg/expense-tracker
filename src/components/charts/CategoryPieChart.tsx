import { Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Category } from '../../types'
import { useTransactions, useTheme, useCategories } from '../../context'
// Remove the CATEGORIES import
import './Charts.css'

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend)

function CategoryPieChart() {
  const { transactions } = useTransactions()
  const { isDarkMode } = useTheme()
const { getCategoriesMap } = useCategories()
const CATEGORIES = getCategoriesMap()
  // Colors based on theme
  const textColor = isDarkMode ? '#ffffff' : '#0f172a'
  const textMutedColor = isDarkMode ? '#a0a0a0' : '#475569'
  const bgColor = isDarkMode ? '#1a1a1a' : '#ffffff'
  const borderColor = isDarkMode ? '#2a2a2a' : '#e2e8f0'

  // Calculate spending by category
  const categoryTotals = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {} as Record<Category, number>)

  // Prepare chart data
  const categories = Object.keys(categoryTotals) as Category[]
  
  const data = {
    labels: categories.map(cat => CATEGORIES[cat]?.label || cat),
    datasets: [
      {
        data: categories.map(cat => categoryTotals[cat]),
        backgroundColor: categories.map(cat => CATEGORIES[cat]?.color || '#888'),
        borderColor: 'transparent',
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: textColor,
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: bgColor,
        titleColor: textColor,
        bodyColor: textMutedColor,
        borderColor: borderColor,
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
            const percentage = ((context.raw / total) * 100).toFixed(1)
            return ` ${context.label}: ${percentage}%`
          },
        },
      },
    },
  }

  // Show message if no expenses
  if (categories.length === 0) {
    return (
      <div className="chart-empty">
        <p>No expense data to display</p>
        <span>Add some expenses to see the breakdown</span>
      </div>
    )
  }

  return (
    <div className="chart-container pie-chart">
      <Pie data={data} options={options} />
    </div>
  )
}

export default CategoryPieChart