import { scheduleRule } from "../services/recurringServices";
import prisma from "../db";
import { handleError } from "../utils/errors";
import { Request, Response } from "express";



export async function createRecurring(req:Request,res:Response){
    try{
        const userId = (req as any).user.userId;
        const {template,cron,active} = req.body;

        const rule = await prisma.recurringRule.create({
            data:{
                userId,
                template,
                cron,
                active:active ?? true
            }
        })
        await scheduleRule(rule.id);
        return res.status(201).json(rule);
    }catch(err){
        return handleError(res,err);
    }
}

export async function getRecurringRules(req:Request,res:Response) {
    try{
        const userId = (req as any).user.userId;
        const rules = await prisma.recurringRule.findMany({
            where:{userId}
        })

        return res.status(200).json(rules)
    }catch(err){
        return handleError(res,err);
    }
}

export async function updateRecurringRule(req:Request,res:Response){
    try{
        const userId = (req as any).user.userId;
        const id = Number(req.params.id);

        const existing = await prisma.recurringRule.findUnique({
            where:{id}
        })

        if(!existing || existing.userId !== userId){
            return res.status(401).json({error:"Invalid Recurring Rule"})
        }

        const data = req.body;

        const updated = await prisma.recurringRule.update({
            where:{id},
            data
        })
        await scheduleRule(updated.id)
        return res.status(201).json(updated)
    }catch(err){
        return handleError(res,err)
    }
}

export async function deleteRecurringRule(req:Request,res:Response){
    try{
        const userId = (req as any).user.userId;
        const id = Number(req.params.id);
        const existing = await prisma.recurringRule.findUnique({
            where:{id}
        })

        if(!existing || existing.userId !== userId){
            return res.status(401).json({error:"Invalid Recurring Rule"})
        }

        await prisma.recurringRule.delete({
            where:{id}
        })
        return res.status(204).send();

    }catch(err){
        return handleError(res,err);
    }
}