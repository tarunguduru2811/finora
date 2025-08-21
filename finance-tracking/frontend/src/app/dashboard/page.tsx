"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { useUserStore } from "@/lib/store"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


interface SummaryData {
    balance: number,
    income: number,
    expense: number
}

interface CategoryExpenses {
    name: string,
    expenses: number
}

interface MonthlyExpense {
    month: string,
    expense: number,
}

// interface Transaction {
//     notes: string,
//     amount: number,
//     category: string,
//     date: string,
// }

export default function DashboardPage() {
    const { user } = useUserStore();
    const router = useRouter();

    const [summary, setSummary] = useState<SummaryData | null>(null);
    const [expensesByCategory, setExpensesByCategory] = useState<CategoryExpenses[]>([]);
    const [monthlyExpense, setMonthlyExpenses] = useState<MonthlyExpense[]>([])
    const [recentTransactions, setRecentTransactions] = useState<any>([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            router.push("/login")
        }

        async function fetchDashboard() {
            try {
                const [summaryRes, categoryRes, monthlyRes, recentRes] = await Promise.all([
                    api.get("/transactions/summary"),
                    api.get("/categories/expenses-by-category"),
                    api.get("/transactions/monthly-expense"),
                    api.get("/transactions/recent-transactions")
                ])
                const dashboardData = {
                    summary: summaryRes.data,
                    category: categoryRes.data,
                    monthly: monthlyRes.data,
                    recentTransaction: recentRes.data
                }
                console.log("Dashboard Data", dashboardData)
                setSummary(summaryRes.data)
                setExpensesByCategory(categoryRes.data)
                setMonthlyExpenses(monthlyRes.data)
                setRecentTransactions(recentRes.data)

            } catch (err) {
                console.error("Error in fetching Dashboard Data")
            } finally {
                setLoading(false)
            }
        }

        fetchDashboard();
    }, [user, router])

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <Skeleton className="h-8 w-64" />
                <div className="grid grid-cols-3 gap-4">
                    <Skeleton className="h-24 rounded-xl" />
                    <Skeleton className="h-24 rounded-xl" />
                    <Skeleton className="h-24 rounded-xl" />
                </div>
                <Skeleton className="h-48 rounded-xl" />
            </div>
        );
    }
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Welcome Back !</h1>

            {/* summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-green-50">
                    <CardHeader>
                        <CardTitle>Total Income</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xl font-bold text-green-700">${summary?.income}</p>
                    </CardContent>
                </Card>
                <Card className="bg-blue-50">
                    <CardHeader>
                        <CardTitle>Total Expense</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xl font-bold text-red-700">${summary?.expense}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Net Savings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xl font-bold text-blue-700">${summary?.balance}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Expense cards */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        Expenses by Category
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {expensesByCategory.map((c, i) => (
                                <TableRow key={i}>
                                    <TableCell>{c.name}</TableCell>
                                    <TableCell className="text-right">${c.expenses}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Monthly Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Month</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {monthlyExpense.map((m, i) => (
                                <TableRow key={i}>
                                    <TableCell>{m.month}</TableCell>
                                    <TableCell className="text-right">₹{m.expense}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Description</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                recentTransactions.map((tx: any, i: number) => (
                                    <TableRow key={i}>
                                        <TableCell>{tx?.notes}</TableCell>
                                        <TableCell >{tx.category.name}</TableCell>
                                        <TableCell>${tx.amount}</TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}