import prisma from "../db";
import { handleError } from "../utils/errors";
import { Request, Response } from "express";



export async function createBudget(req:Request,res:Response){
    try{
       const userId = (req as any).user.userId;
       const {name,categoryId,amount,period,startDate,endDate} = req.body;

       const category = await prisma.category.findUnique({
        where:{id:Number(categoryId)}
       })

       if(!category || category.userId !== userId){
        return res.status(401).json({error:"Invalid Category"})
       }

       const budget = await prisma.budget.create({
            data:{
                userId,
                categoryId:Number(categoryId),
                name:String(name),
                amount:Number(amount),
                period:period || "MONTHLY",
                startDate:startDate?new Date(startDate) : new Date(),
                endDate : endDate ? new Date(endDate) : new Date() //TODO Replace the condition properly
            }
       })

       return res.status(201).json(budget)
    }catch(err){
        return handleError(res,err)
    }
}

//get budgets with progress
export async function getBudgets(req:Request,res:Response) {
        try{
            const userId = (req as any).user.userId;

            const budgets  = await prisma.budget.findMany({
                where:{
                    userId 
                },
                include:{category:true}
            })

            const budgetSummaries = await Promise.all(
                budgets.map(async (b)=>{
                    const spentAgg = await prisma.transaction.aggregate({
                        where:{
                            account:{userId},
                            categoryId:b.categoryId,
                            type:"EXPENSE",
                            date:{
                                gte:b.startDate,
                                lte:b.endDate || new Date()
                            }
                        },
                        _sum:{amount:true}
                    })

                    const spent = spentAgg._sum.amount || 0;
                    const remaining = b.amount - spent;
                    const progress = spent > 0 ? Number(((spent)/b.amount)*100).toFixed(2) : "0"

                    //Alerts
                    let alerts:string = "safe";
                    if(spent>b.amount){
                        alerts = "over";
                    }else if(parseFloat(progress) >= 80){
                        alerts="warning"
                    }

                    //Forecasting
                    let forecast:string="N/A";

                    const today = new Date();
                    if(today > b.startDate && b.endDate){
                        const elapsedDays = (today.getTime() - b.startDate.getTime())/(1000*60*60*24);
                        const totalDays = (b.endDate.getDate() - b.startDate.getTime())/(1000*60*60*24);

                        if(elapsedDays > 0){
                            const dailySpentRate = spent / elapsedDays;
                            const expectedSpent = totalDays * dailySpentRate;

                            forecast = expectedSpent > b.amount ? "Overspending Likely" : "On Track"
                        }
                    }
                    
                    return{
                        id:b.id,
                        name:b.name,
                        category:b.category?.name,
                        amount:b.amount,
                        spent,
                        remaining,
                        period : b.period,
                        startDate : b.startDate,
                        endDate : b.endDate,
                        progress ,
                        alerts,
                        forecast
                    }
                })
            )

          

            return res.status(200).json(budgetSummaries);
        }catch(err){
            return handleError(res,err)
        }
}

export async function getBudgetById(req:Request,res:Response){
    try{
        const userId = (req as any).user.userId;
        const id = Number(req.params.id);

        const budget = await prisma.budget.findUnique({
            where:{id},
            include:{category:true}
        })

        if(!budget || budget.userId !== userId){
            return res.status(401).json({error:"Invalid Budget"})
        }

        return res.status(201).json(budget)
    }catch(err){
        return handleError(res,err)
    }
}

export async function updateBudget(req:Request,res:Response){
        try{
            const userId = (req as any).user.userId;
            const id = Number(req.params.id);

            const existing  = await prisma.budget.findUnique({
                where:{id}
            })

            if(!existing || existing.userId !== userId){
                return res.status(401).json({error:"Not Found"})
            }
            const data = req.body;

            if(data.startDate){
                data.startDate = new Date(data.startDate);
            }
            if(data.endDate){
                data.endDate = new Date(data.endDate)
            }
            const updated = await prisma.budget.update({
                where:{id},
                data:req.body
            })
        }catch(err){
            return handleError(res,err)
        }
}

export async function deleteBudget(req:Request,res:Response){
    try{
        const userId = (req as any).user.userId;
        const id = Number(req.params.id);

        const existing = await prisma.budget.findUnique({
            where:{id}
        })

        if(!existing || existing.userId !== userId){
            return res.status(401).json({error:"Not Found"})
        }

        await prisma.budget.delete({where:{id}})

        return res.status(204).send();
    }catch(err){
        return handleError(res,err)
    }
}

export async function getBudgetSummary(req:Request,res:Response){
    try{
        const userId = (req as any).user.userId;

        const budgets =  await prisma.budget.findMany({
            where:{userId}
        })

        let totalSpent = 0;
        let budgetedAmount  = 0;

        for(const b of budgets){
            budgetedAmount += b.amount;

            const spentAgg = await prisma.transaction.aggregate({
                where:{
                    account:{userId},
                    categoryId:b.categoryId,
                    type:"EXPENSE",
                    date:{
                        gte:b.startDate,
                        lte:b.endDate || new Date()
                    }
                },
                _sum:{amount:true}
            })

            totalSpent += spentAgg._sum.amount || 0;
        }

        return res.json({
            budgetedAmount,
            totalSpent,
            overallProgress : Number((totalSpent/budgetedAmount)*100).toFixed(2)
        })
    }catch(err){
        return handleError(resizeBy,err);
    }
}