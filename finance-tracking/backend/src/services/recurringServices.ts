import prisma from "../db";
import { getBudgetPeriodDates } from "../utils/recurringUtils";
import cron, { ScheduledTask } from "node-cron"

const ScheduledJobs : Record<number,ScheduledTask> = {}

export async function scheduleRule(ruleId:number){
    const rule = await prisma.recurringRule.findUnique({where:{id:ruleId}});
    if(!rule || !rule.active){
        return
    }

    if(ScheduledJobs[rule.id]){
        ScheduledJobs[rule.id].stop()
        delete ScheduledJobs[rule.id]
    }

    const template =rule.template as any;

    const task = cron.schedule(rule.cron,async ()=>{
        console.log(`⏰ Running recurring rule ${rule.id} at ${new Date().toISOString()}`);
        if(template.transaction){
            await prisma.transaction.create({
                data:{
                    accountId:template.transaction.accountId,
                    categoryId:template.transaction.categoryId,
                    type:template.transaction.type || "EXPENSE",
                    amount:template.transaction.amount,
                    date:new Date(),
                    notes:template.transaction.notes || null,
                    currency:template.transaction.currency || "USD"

                }
            })
        }

       if (template.budget) {
            const { startDate, endDate } = getBudgetPeriodDates(template.budget.period);

            const existingBudget = await prisma.budget.findFirst({
                where: {
                    categoryId: template.budget.categoryId,
                    period: template.budget.period,
                    startDate,
                    endDate
                }
            });

            if (!existingBudget) {
                await prisma.budget.create({
                    data: {
                        userId: rule.userId,
                        categoryId: template.budget.categoryId,
                        amount: template.budget.amount,
                        period: template.budget.period,
                        startDate,
                        endDate,
                        name: template.budget.name || null
                    }
                });
            }
        }
        ScheduledJobs[rule.id] = task;
    });
}
export async function processRecurringRules(){
    const rules = await prisma.recurringRule.findMany({where:{active:true}})
    for(const rule of rules){
        scheduleRule(rule.id);
    }
}
