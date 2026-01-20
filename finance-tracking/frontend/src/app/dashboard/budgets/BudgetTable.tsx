"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"
import EditBudgetModal from "./EditBudgetModal";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";



export default function BudgetTable({ budgets, onDelete, categories }: any) {
    const [editOpen, setEditOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState<any>(null);
    const getAlertBadge = (alerts: string | null) => {
        if (alerts === "safe") return <Badge variant="outline">Safe</Badge>
        if (alerts === "over") return <Badge variant="destructive">Over Budget</Badge>
        if (alerts === "warning") return <Badge variant="secondary">Almost There</Badge>
    }
    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Start</TableHead>
                        <TableHead>End</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Alert</TableHead>
                        <TableHead>Forecast</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {
                        budgets.map((budget: any) => (
                            <TableRow key={budget.id}>
                                <TableCell>{budget.name}</TableCell>
                                <TableCell>{budget.category}</TableCell>
                                <TableCell>${budget.amount}</TableCell>
                                <TableCell>{budget.period}</TableCell>
                                <TableCell>{new Date(budget.startDate).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(budget.endDate).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <Progress
                                            value={Number(budget.progress)}
                                            className="w-[120px]"
                                        />
                                        <span className="text-xs text-muted-foreground">
                                            {budget.progress}% used
                                        </span>
                                    </div>
                                </TableCell>

                                <TableCell>{getAlertBadge(budget.alerts)}</TableCell>

                                <TableCell>
                                    <span>{budget.forecast || "-"}</span>
                                </TableCell>
                                <TableCell className="flex gap-2">
                                    <Button variant="outline" onClick={() => {
                                        setEditingBudget(budget)
                                        setEditOpen(true);
                                    }}>Edit</Button>
                                    <Button variant="destructive" onClick={() => onDelete(budget.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>

            {
                editingBudget && (
                    <EditBudgetModal
                        budget={editingBudget}
                        categories={categories}
                        onSave={() => {
                            setEditOpen(false);
                            setEditingBudget(null);
                        }}
                        onClose={() => setEditOpen(false)}
                        open={editOpen}
                    />
                )
            }

        </>


    )
}