"use client"

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table"
import { useState } from "react"
import EditTransactionModal from "./EditTransactionModal";
import { api } from "@/lib/api";

interface Props {
    transactions: any[],
    categories: any[],
    fetchTransactions: () => void
}

export default function TransactionTable({ transactions, categories, fetchTransactions }: Props) {
    const [editOpen, setEditOpen] = useState(false);
    const [transactionEditing, setTransactionEditing] = useState<any>(null);

    const handleDeleteTransactions = async (id: number) => {
        try {
            await api.delete(`/transactions/${id}`)
            fetchTransactions();
        } catch (err) {
            console.error("Error in Deleting Transactions", err);
        }
    }

    return (
        <>
            {/* Scrollable container */}
            <div className="w-full overflow-x-auto">
                <Table className="min-w-[900px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Account</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Merchant</TableHead>
                            <TableHead>Notes</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((tx) => (
                            <TableRow key={tx.id}>
                                <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                                <TableCell>{tx.account?.name}</TableCell>
                                <TableCell>{tx.type}</TableCell>
                                <TableCell>{tx.amount}</TableCell>
                                <TableCell>{tx.category?.name || "-"}</TableCell>
                                <TableCell>{tx.merchant}</TableCell>
                                <TableCell>{tx.notes}</TableCell>
                                <TableCell className="flex gap-2 flex-wrap">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setTransactionEditing(tx);
                                            setEditOpen(true);
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDeleteTransactions(tx.id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Edit Transaction Modal */}
            {transactionEditing && (
                <EditTransactionModal
                    transaction={transactionEditing}
                    categories={categories}
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    onSave={() => {
                        setEditOpen(false)
                        setTransactionEditing(null)
                    }}
                />
            )}
        </>
    )
}
