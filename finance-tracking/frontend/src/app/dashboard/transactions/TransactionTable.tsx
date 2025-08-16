"use client"

import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table"

interface Props {
    transactions: any[]
}

export default function TransactionTable({ transactions }: Props) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Merchant</TableHead>
                    <TableHead>Notes</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    transactions.map((tx) => (
                        <TableRow>
                            <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                            <TableCell>{tx.account?.name}</TableCell>
                            <TableCell>{tx.type}</TableCell>
                            <TableCell>{tx.amount}</TableCell>
                            <TableCell>{tx.category?.name || "-"}</TableCell>
                            <TableCell>{tx.merchant}</TableCell>
                            <TableCell>{tx.notes}</TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}