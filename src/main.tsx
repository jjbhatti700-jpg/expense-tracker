import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { TransactionProvider, ThemeProvider, CurrencyProvider, CategoryProvider, AuthProvider } from './context'
import './index.css'

// Find the root div in index.html
const rootElement = document.getElementById('root')!

// Create React root and render App
// Providers wrap the app so all components can access the data
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <CurrencyProvider>
          <CategoryProvider>
            <TransactionProvider>
              <App />
            </TransactionProvider>
          </CategoryProvider>
        </CurrencyProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
)