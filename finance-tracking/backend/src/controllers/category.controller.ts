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
            data:{name,userId}
        })
        return res.json(category)
    }catch(err){
        return handleError(res,err)
    }
}