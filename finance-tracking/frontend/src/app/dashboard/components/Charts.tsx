"use client"

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"


export function Charts({ transactions }: { transactions: any[] }) {
    const data = transactions.map((t) => ({
        date: new Date(t.date).toLocaleDateString(),
        amount: t.amount * (t.type === "EXPENSE" ? -1 : 1),
    }));
    return (
        <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-lg font-bold mb-4">Income Vs Expense</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid stroke="#eee" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="amount" stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}