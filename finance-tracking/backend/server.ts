import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import {Request,Response } from "express"
import authRoutes from './src/routes/auth.routes';
import accountRoutes from './src/routes/account.routes'
import transactionRoutes from './src/routes/transaction.routes'
import categoryRoutes from './src/routes/category.routes'

dotenv.config();

const app = express();
// Enable CORS with credentials
app.use(cors({
    origin: 'http://localhost:3000',  // Your exact frontend origin
    credentials: true,                // Allow credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  
//   // Handle preflight requests
//   app.options('*', cors({
//     origin: 'http://localhost:3001',
//     credentials: true
//   }));

app.use(express.json());

//health
app.get("/health",(req:Request,res:Response)=>{
    res.json({ok:true})
})

app.use('/api/auth',authRoutes)
app.use('/api/accounts',accountRoutes)
app.use('/api/categories',categoryRoutes)
app.use('/api/transactions',transactionRoutes)

const port = process.env.PORT || 5000 
app.listen(port,()=>{
    console.log(`Server is listening at ${port}`)
})