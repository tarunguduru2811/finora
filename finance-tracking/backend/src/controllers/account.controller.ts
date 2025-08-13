import {Request,Response} from "express"
import { handleError } from "../utils/errors"
import prisma from "../db";


export async function listAccounts(req:Request,res:Response) {
  try{
    const userId = (req as any).user?.userId;
    const accounts = await prisma.account.findMany({
      where:{userId},
      include:{transactions:true}
    })

    const accountsWithBalance = accounts.map((acc=>{
      let balance = 0;
      acc.transactions.forEach((t)=>{
        if(t.type === "INCOME") balance += t.amount
        if(t.type === "EXPENSE") balance -= t.amount
      })
      return {...acc,balance}
    }))

    return res.json(accountsWithBalance)
  } catch(err){
    return handleError(res,err)
  }  
    
}

export async function createAccount(req:Request,res:Response) {
    try{
        const userId = (req as any).user?.userId;
        const {name,currency} = req.body;
        const account = await prisma.account.create({
            data:{name,currency:currency || 'USD',userId}
        });
        return res.status(201).json(account)
    }catch(err){
        return handleError(res,err)
    }
}