import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { useTransactions, useTheme } from '../../context'
import './Charts.css'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

function MonthlyBarChart() {
  const { transactions } = useTransactions()
  const { isDarkMode } = useTheme()

  // Colors based on theme
  const textColor = isDarkMode ? '#ffffff' : '#0f172a'
  const textMutedColor = isDarkMode ? '#a0a0a0' : '#475569'
  const bgColor = isDarkMode ? '#1a1a1a' : '#ffffff'
  const borderColor = isDarkMode ? '#2a2a2a' : '#e2e8f0'
  const gridColor = isDarkMode ? '#2a2a2a' : '#e2e8f0'

  // Group transactions by month
  const monthlyData = transactions.reduce((acc, t) => {
    const date = new Date(t.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const monthLabel = date.toLocaleString('default', { month: 'short', year: '2-digit' })

    if (!acc[monthKey]) {
      acc[monthKey] = { label: monthLabel, income: 0, expenses: 0 }
    }

    if (t.type === 'income') {
      acc[monthKey].income += t.amount
    } else {
      acc[monthKey].expenses += t.amount
    }

    return acc
  }, {} as Record<string, { label: string; income: number; expenses: number }>)

  // Sort by month and get last 6 months
  const sortedMonths = Object.keys(monthlyData)
    .sort()
    .slice(-6)

  const labels = sortedMonths.map(key => monthlyData[key].label)
  const incomeData = sortedMonths.map(key => monthlyData[key].income)
  const expenseData = sortedMonths.map(key => monthlyData[key].expenses)

  const data = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 0,
        borderRadius: 6,
        barThickness: 20,
      },
      {
        label: 'Expenses',
        data: expenseData,
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 0,
        borderRadius: 6,
        barThickness: 20,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: textMutedColor,
        },
      },
      y: {
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textMutedColor,
        },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
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
      },
    },
  }

  // Show message if no data
  if (sortedMonths.length === 0) {
    return (
      <div className="chart-empty">
        <p>No data to display</p>
        <span>Add transactions to see monthly trends</span>
      </div>
    )
  }

  return (
    <div className="chart-container bar-chart">
      <Bar data={data} options={options} />
    </div>
  )
}

export default MonthlyBarChart