import {Request,Response} from "express"
import { handleError } from "../utils/errors"
import prisma from "../db";


export async function listCategories(req:Request,res:Response) {
    try{
        const userId = (req as any).user.userId;
        const categories = await prisma.category.findMany({
            where:{userId}
        })   
        return res.json(categories)
    }
    catch(err){
        return handleError(res,err)
    }
}

export async function createCategory(req:Request,res:Response) {
    try{
        const userId = (req as any).user.userId;
        const {name} = req.body;
        const category = await prisma.category.create({
            data:{name,userId:userId}
        })
        return res.json(category)
    }catch(err){
        return handleError(res,err)
    }
}


export async function getCategorySpendSummary(req:Request,res:Response){
    try{
        const userId = (req as any).user.userId;
        const {start,end} = req.params;
        const where :any = {
            account : {userId},
            type:"EXPENSE"
        }

        if(start || end ){
            where.date = {};
            if(start) where.date.gte = new Date(String(start))
            if(end) where.date.lte = new Date(String(end))
        }

        const result = await prisma.transaction.groupBy({
            by:["categoryId"],
            where,
            _sum:{amount:true},
            _count:{id:true}
        })

        const categories = await prisma.category.findMany({
            where:{userId}
        })

        const formatted = result.map((item)=>{
            const category = categories.find((c)=>c.id === item.categoryId)
            return{
                categoryId:item.categoryId,
                categoryName:category?.name || "Unrecognized",
                totalSpent : item._sum.amount || 0,
                transactionCount : item._count.id
            }
        })
        return res.json(formatted)
    }catch(err){
        return handleError(res,err);
    }
}

export async function getTransactionByCategoryId(req:Request,res:Response){
    try{
        const userId = (req as any).user.userId;
        const {categoryId} = req.params;
        const {start,end} =req.query;

        const where:any = {
            categoryId:Number(categoryId),
            account:{
                userId:userId
            }
        }
        
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
        return res.json(transactions)
    }catch(error){
        return handleError(res,error)
    }
}