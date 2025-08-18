"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/lib/api"
import { useEffect, useState } from "react"


interface EditBudgetModalProps {
    budget: any,
    categories: any[],
    onSave: () => void,
    onClose: () => void,
    open: boolean
}

export default function EditBudgetModal({ budget, categories, onSave, onClose, open }: EditBudgetModalProps) {
    const [form, setForm] = useState({
        name: "",
        amount: "",
        period: "MONTHLY",
        startDate: "",
        endDate: "",
        categoryId: ""
    })

    useEffect(() => {
        if (budget) {
            setForm({
                name: budget.name || "",
                amount: budget.amount?.toString() || "",
                period: budget.period || "MONTHLY",
                startDate: budget.startDate ? budget.startDate.substring(0, 10) : "",
                endDate: budget.endDate ? budget.endDate.substring(0, 10) : "",
                categoryId: budget.categoryId ? String(budget.categoryId) : "",
            });


        }
    }, [budget])

    const handleChange = (key: string, value: any) => {
        setForm((prev) => ({ ...prev, [key]: value }))
    }
    const handleSubmit = async () => {
        try {
            console.log("Updating the Budget....", form);
            await api.put(`/budgets/${budget.id}`, {
                ...form,
                amount: parseFloat(form.amount),
                categoryId: form.categoryId ? parseInt(form.categoryId) : null
            });
            onSave();
            onClose();
        } catch (err) {
            console.error("Error in updating the budget", err)
        }
    }
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader >
                    <DialogTitle>Edit Budget</DialogTitle>
                </DialogHeader>
                <div>
                    <Input placeholder="Budget Name" value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
                    <Input placeholder="Amount" value={form.amount} onChange={(e) => handleChange("amount", e.target.value)} />

                    <Select value={form.period} onValueChange={(v) => handleChange("period", "v")}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Period" />
                            <SelectContent>
                                <SelectItem value="DAILY">Daily</SelectItem>
                                <SelectItem value="WEEKLY">Weekly</SelectItem>
                                <SelectItem value="MONTHLY">Monthly</SelectItem>
                                <SelectItem value="YEARLY">Yearly</SelectItem>
                            </SelectContent>
                        </SelectTrigger>
                    </Select>

                    <Input type="date" value={form.startDate} onChange={(e) => handleChange("startDate", e.target.value)} />
                    <Input type="date" value={form.endDate} onChange={(e) => handleChange("endDate", e.target.value)} />

                    <Select value={form.categoryId} onValueChange={(v) => { handleChange("categoryId", v) }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Category..." />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                categories.map((cat) => (
                                    <SelectItem value={String(cat.id)} key={cat.id}>
                                        {cat.name}
                                    </SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}