import {Request,Response} from "express"
import { handleError } from "../utils/errors";
import prisma from "../db";
import { error } from "console";


export async function getTransactions(req:Request,res:Response) {
    try{
        const userId = (req as any).user.userId;
        const {start,end,accountId} = req.query;

        const where : any = {
            account:{userId}
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