"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

interface BudgetOverviewChartProps {
    budgets: any[]
}

const COLORS = ['#4F46E5', '#22C55E', '#F97316', '#EF4444', '#0EA5E9', '#9333EA']

export default function BudgetOverviewChart({ budgets }: BudgetOverviewChartProps) {
    const data = budgets.map((b) => (
        {
            name: b.name,
            spent: b.spent,
            remaining: b.remaining
        }
    ))

    const chartData = budgets.map((b) => (
        {
            name: b.name,
            value: b.spent
        }
    ))
    return (
        <Card>
            <CardHeader>
                <CardTitle>Budget Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            label
                        >
                            {
                                chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))
                            }
                        </Pie>
                        <Tooltip formatter={(value) => `$${value}`} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}