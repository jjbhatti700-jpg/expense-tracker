import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

import connectDB from './config/database'
import transactionRoutes from './routes/transactionRoutes'
import categoryRoutes from './routes/categoryRoutes'
import authRoutes from './routes/authRoutes'
import emailRoutes from './routes/emailRoutes'
import { seedCategories } from './controllers/categoryController'

// ====================================
// CREATE EXPRESS APP
// ====================================

const app: Express = express()
const PORT = Number(process.env.PORT) || 5000

// ====================================
// MIDDLEWARE
// ====================================

// Security headers
app.use(helmet())

// CORS - Allow frontend to access API
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// Parse JSON bodies
app.use(express.json())

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }))

// ====================================
// DATABASE CONNECTION (LAZY)
// ====================================

let isConnected = false

const ensureConnection = async () => {
  if (isConnected) return
  
  try {
    await connectDB()
    await seedCategories()
    isConnected = true
    console.log('✅ Database connected')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
  }
}

// Middleware to ensure DB connection before each request
app.use(async (req: Request, res: Response, next) => {
  await ensureConnection()
  next()
})

// ====================================
// ROUTES
// ====================================

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'ExpenseFlow API is running',
    timestamp: new Date().toISOString(),
  })
})

// Auth routes (public)
app.use('/api/auth', authRoutes)

// Transaction routes (protected)
app.use('/api/transactions', transactionRoutes)

// Category routes
app.use('/api/categories', categoryRoutes)

// Email routes (protected)
app.use('/api/email', emailRoutes)

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  })
})

// ====================================
// EXPORT FOR VERCEL SERVERLESS
// ====================================

// For Vercel serverless deployment
export default app

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔════════════════════════════════════════════╗
║                                            ║
║   🚀 ExpenseFlow API Server                ║
║                                            ║
║   Server:  http://0.0.0.0:${PORT}            ║
║   Status:  Running                         ║
║   Mode:    ${process.env.NODE_ENV || 'development'}                    ║
║                                            ║
╚════════════════════════════════════════════╝
    `)
  })
}