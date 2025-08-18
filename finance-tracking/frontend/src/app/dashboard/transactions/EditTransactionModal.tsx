"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/lib/api"
import { useEffect, useState } from "react"

interface EditTransactionModalProps {
    transaction: any,
    categories: any[],
    open: boolean,
    onClose: () => void,
    onSave: () => void
}

export default function EditTransactionModal({ transaction, categories, open, onClose, onSave }: EditTransactionModalProps) {
    const [form, setForm] = useState({
        date: "",
        amount: "",
        type: "EXPENSE",
        categoryId: "",
        merchant: "",
        notes: ""
    })

    useEffect(() => {
        if (transaction) {
            setForm({
                date: transaction.date || "",
                amount: transaction.amount || "",
                type: transaction.type || "",
                categoryId: transaction.categoryId,
                merchant: transaction.merchant,
                notes: transaction.notes
            })
        }
    }, [transaction])

    const handleChange = (key: string, value: any) => {
        setForm((prev) => ({ ...prev, [key]: value }))
    }

    const handleSubmit = async () => {
        try {
            console.log("Updating the transaction....", form.date)
            await api.put(`/transactions/${transaction.id}`, {
                ...form,
                amount: parseFloat(form.amount),
                categoryId: form.categoryId ? parseInt(form.categoryId) : null
            })
            onSave();
            onClose();
        } catch (err) {
            console.error("Error in Updating the Transaction")
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Transaction</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Date</Label>
                        <Input type="date" value={form.date} onChange={(e) => handleChange("date", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Amount</Label>
                        <Input type="number" value={form.amount} onChange={(e) => handleChange("amount", e.target.value)} />
                    </div>

                    <Select value={form.type} onValueChange={(v) => handleChange("type", v)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="INCOME">Income</SelectItem>
                            <SelectItem value="EXPENSE">Expense</SelectItem>
                            <SelectItem value="TRANSFER">Transfer</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={form.categoryId} onValueChange={(v) => handleChange("categoryId", v)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                categories.map((cat) => (
                                    <SelectItem value={String(cat.id)} key={cat.id}>{cat.name}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>

                    <div className="space-y-2">
                        <Label>Merchant</Label>
                        <Input value={form.merchant} onChange={(e) => handleChange("merchant", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Notes</Label>
                        <Input value={form.notes} onChange={(e) => handleChange("notes", e.target.value)} />
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={onClose}>Close</Button>
                        <Button onClick={handleSubmit}>Save</Button>
                    </DialogFooter>
                </div>
            </DialogContent>


        </Dialog>
    )
}