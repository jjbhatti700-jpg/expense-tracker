import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

import transactionRoutes from '../server/src/routes/transactionRoutes'
import categoryRoutes from '../server/src/routes/categoryRoutes'
import authRoutes from '../server/src/routes/authRoutes'
import emailRoutes from '../server/src/routes/emailRoutes'
import { seedCategories } from '../server/src/controllers/categoryController'

const app: Express = express()

app.use(helmet())

app.use(cors({
  origin: process.env.CLIENT_URL || true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

let isConnected = false

const connectDB = async (): Promise<void> => {
  if (isConnected) return

  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-tracker'
    
    await mongoose.connect(mongoURI, {
      bufferCommands: false,
    })

    isConnected = true
    console.log('✅ MongoDB Connected Successfully')

    await seedCategories()
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error)
    throw error
  }
}

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'ExpenseFlow API is running',
    timestamp: new Date().toISOString(),
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/transactions', transactionRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/email', emailRoutes)

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

export default async function handler(req: any, res: any) {
  await connectDB()
  app(req, res)
}