import {Request,Response} from "express"
import { handleError } from "../utils/errors";
import prisma from "../db";
import PDFDocument from "pdfkit"

export async function getTransactions(req:Request,res:Response) {
    try{
        const userId = (req as any).user.userId;
        const {start,end,accountId,type} = req.query;

        const where : any = {
            account:{
                userId:userId
            },
            type:type
        };

        if(accountId) where.accountId = Number(accountId)
        
        if(start || end){
                where.date = {};
                if(start) where.date.gte = new Date(String(start))
                if(end) where.date.lte = new Date(String(end))
        }

        const transactions = await prisma.transaction.findMany({
            where,
            orderBy:{date:'desc'},
            include:{category:true,account:true}
        })

        return res.json(transactions);
    }catch(err){
        return handleError(res,err)
    }
}

export async function getTransactionsById(req:Request,res:Response){
    try{
        const userId = (req as any).user.userId;
        const id = Number(req.params.id);
        const tx = await prisma.transaction.findUnique({
            where:{id},
            include:{category:true,account:true}
        })

        if(!tx || tx.account.userId !== userId){
            return res.status(404).json({error:"Not Found"})
        }
        return res.json(tx);
    }catch(err){
        return handleError(res,err);
    }
}

export async function createTransaction(req:Request,res:Response) {
    try{
        const userId = (req as any).user.userId;
        const 
        {accountId,amount,currency,type,date,categoryId,merchant,notes,
            receiptUrl,splitItems
        } = req.body;
        const account = await prisma.account.findUnique({
            where:{id:Number(accountId)}
        })

        if(!account || account.userId !== userId){
            return res.status(404).json({error:"Invalid Account"})
        }

        const tx = await prisma.transaction.create({
            data:{
                accountId:account.id,
                amount:Number(amount),
                currency:currency || account.currency || 'USD',
                type,
                date:date?new Date(date) : new Date(),
                categoryId : categoryId ? Number(categoryId) : null,
                merchant,
                notes,
                receiptUrl,
                splitItems:splitItems?splitItems :null
            }
        }) 
        return res.status(201).json(tx);

    }catch(err){
        return handleError(res,err)
    }
}

export async function updateTransaction(req:Request,res:Response){
    try{
        const userId = (req as any).user.userId;
        const id = Number(req.params.id);
        const existing = await prisma.transaction.findUnique(
            {
                where:{id},
                include:{account:true}
            }
        )
        if(!existing || existing.account.userId !== userId) return res.status(401).json({error:"Not Found"})
        const data = req.body;
        if(data.date) {
            data.date = new Date(data.date)
        }
        const updated = await prisma.transaction.update({
            where:{id},
            data
        })
        return res.json(updated)
    }
    catch(error){
        return handleError(res,error);
    }
}

export async function deleteTransaction(req:Request,res:Response){
    try{
        const userId = (req as any).user.userId;
        const id = Number(req.params.id)
        const existing = await prisma.transaction.findUnique({where:{id},include:{account:true}});
        if(!existing || existing.account.userId !== userId) return res.status(401).json({error:"Not Found"})
        await prisma.transaction.delete({where:{id}})
        return res.status(204).send();
    }
    catch(err){
        return handleError(res,err)
    }
}

export async function transactionSummary(req:Request,res:Response){
    try{
        const userId = (req as any).user.userId;
        const whereIncome:any = {
            account:{
                userId:userId
            },
            type:"INCOME"
        }

        const whereExpense:any = {
            account:{
                userId:userId
            },
            type:"EXPENSE"
        }
        const income = await prisma.transaction.aggregate({
            where:whereIncome,
            _sum:{amount:true}
        })

        const expense = await prisma.transaction.aggregate({
            where:whereExpense,
            _sum:{amount:true}
        })

        const totalIncome = income._sum.amount || 0;
        const totalExpense = expense._sum.amount || 0;

        return res.json({
            balance:totalIncome-totalExpense,
            income:totalIncome,
            expense:totalExpense
        })
    }catch(err){
        return handleError(res,err);
    }
}

export async function monthlyExpense(req:Request,res:Response){
    try{
        const userId = (req as any).user.userId

        const grouped:Record<string,{income:number,expense:number}>={};

        const transactions = await prisma.transaction.findMany({
            select:{type:true,amount:true,date:true},
            where:{account:{
                userId:userId
            }}
        })

        transactions.forEach((tx)=>{
            const date = new Date(tx.date);
            const month = date.toLocaleString("default", { month: "short", year: "numeric" });
            if(!grouped[month]) grouped[month] = {income:0,expense:0};
            if(tx.type === "INCOME") grouped[month].income += tx.amount
            else grouped[month].expense += tx.amount
        })

        const result = Object.entries(grouped).map(([month,values])=>({
            month,
            ...values
        }))

        return res.json(result)
    }catch(err){
        return handleError(res,err)
    }
}

export async function getRecentTransactions(req:Request,res:Response){
    try{
        const userId = (req as any).user.userId;

        const transactions = await prisma.transaction.findMany({
            where:{
                account:{
                    id:userId
                }
            },
            take:10,
            select:{
                id:true,
                notes:true,
                amount:true,
                category:{
                   
                },
                date:true
            }
        })

        return res.json(transactions);
    }catch(err){
        return handleError(res,err)
    }
}



export async function getMonthlyReport(req: Request, res: Response) {
    try {
      const { userId, year, month } = req.params;
  
      const parsedUserId = parseInt(userId);
      const parsedYear = parseInt(year);
      const parsedMonth = parseInt(month);
  
      const transactions = await prisma.transaction.findMany({
        where: {
          account: {
            userId: parsedUserId,
          },
          date: {
            gte: new Date(parsedYear, parsedMonth - 1, 1),
            lt: new Date(parsedYear, parsedMonth, 1),
          },
        },
      });
  
      const totalIncome = transactions
        .filter((t) => t.type === "INCOME")
        .reduce((acc, t) => acc + t.amount, 0);
      const totalExpense = transactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((acc, t) => acc + t.amount, 0);
      const netSavings = totalIncome - totalExpense;
  
      const categories = await prisma.category.findMany({ where: { userId: parsedUserId } });
  
      const categoryTotals: Record<string, number> = {};
      transactions
        .filter((t) => t.type === "EXPENSE")
        .forEach((t) => {
          const category = categories.find((c) => c.id === t.categoryId);
          if (category) {
            categoryTotals[category.name] = (categoryTotals[category.name] || 0) + t.amount;
          }
        });
      
      return res.json({
        totalExpense,
        totalIncome,
        netSavings,
        categoryTotals
      })
      
    } catch (err) {
      console.error("Error generating report:", err);
    }
  }
  