import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import passport from "passport"
import session from "express-session"
import {Request,Response } from "express"
import authRoutes from './src/routes/auth.routes';
import cookieParser from "cookie-parser";
import accountRoutes from './src/routes/account.routes'
import transactionRoutes from './src/routes/transaction.routes'
import categoryRoutes from './src/routes/category.routes'
import budgetRoutes from "./src/routes/budget.routes"
import recurringRuleRoutes from "./src/routes/recurringRule.routes"
import {processRecurringRules} from "./src/services/recurringServices"
dotenv.config();

const app = express();
// Enable CORS with credentials
app.use(cors({
    origin: 'https://finora-pied.vercel.app',  // Your exact frontend origin
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
app.use(cookieParser());
app.use(session({
  secret:process.env.SESSION_SECRET!,
  resave:false,
  saveUninitialized:false
}))

app.use(passport.initialize())
app.use(passport.session())

//health
app.get("/health",(req:Request,res:Response)=>{
    res.json({ok:true})
})

app.use('/api/auth',authRoutes)
app.use('/api/accounts',accountRoutes)
app.use('/api/categories',categoryRoutes)
app.use('/api/transactions',transactionRoutes)
app.use("/api/budgets",budgetRoutes)
app.use("/api/recurring-rules",recurringRuleRoutes)

const port = process.env.PORT || 5000 
app.listen(port,()=>{
    console.log(`Server is listening at ${port}`)
      // 🔥 Start recurring job processor when server starts
      processRecurringRules()
})
