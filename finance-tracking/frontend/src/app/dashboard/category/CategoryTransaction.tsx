"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { api } from "@/lib/api"
import { useEffect, useState } from "react"

interface Transaction {
    id: number,
    amount: number,
    date: string,
    merchant?: string,
    notes?: string
}
export default function CategoryTransaction({ categoryId }: { categoryId: number }) {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    useEffect(() => {
        if (!categoryId) return;

        api.get(`/categories/${categoryId}/transactions`).then((res) => setTransactions(res.data))
    }, [categoryId])
    return (
        <div className="mt-6">
            <h1 className="text-lg font-bold mb-2">Transactions</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Merchant</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        transactions.map((tx) => (
                            <TableRow key={tx.id}>
                                <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                                <TableCell>{tx.merchant || "-"}</TableCell>
                                <TableCell>{tx.notes || "-"}</TableCell>
                                <TableCell className="text-right">${tx.amount.toFixed(2)}</TableCell>
                            </TableRow>

                        ))
                    }
                </TableBody>
            </Table>
        </div>

    )
}