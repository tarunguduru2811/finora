"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select"
import { useState } from "react"

interface Props {
    open: boolean,
    onClose: () => void,
    onSave: (form: any) => void,
    categories: any[]
}

export default function AddBudgetModal({ open, onClose, onSave, categories }: Props) {
    const [form, setForm] = useState({
        name: "",
        categoryId: "",
        amount: "",
        period: "MONTHLY",
        startDate: "",
        endDate: ""
    })




    const handleChange = (key: string, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }))
    }

    const handleSubmit = () => {
        console.log("Name of Budget...", form.name);
        onSave({
            ...form,
            amount: parseFloat(form.amount),
            categoryId: form.categoryId ? parseInt(form.categoryId) : null,
        })
    }
    return (
        <div >
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Add Budget
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-5">
                        <Input placeholder="Name" value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
                        <Input type="Number" placeholder="Amount" value={form.amount} onChange={(e) => handleChange("amount", e.target.value)} />

                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Period" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="DAILY">Daily</SelectItem>
                                <SelectItem value="WEEKLY">Weekly</SelectItem>
                                <SelectItem value="MONTHLY">Monthly</SelectItem>
                                <SelectItem value="YEARLY">Yearly</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Category..." />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    categories.map((category) => (
                                        <SelectItem value={String(category.id)} key={category.id}>{category.name}</SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>

                        <Input type="date" value={form.startDate} onChange={(e) => handleChange("startDate", e.target.value)} />
                        <Input type="date" value={form.endDate} onChange={(e) => handleChange("endDate", e.target.value)} />

                        <div>
                            <Button variant="outline" onClick={onClose}>Cancel</Button>
                            <Button onClick={handleSubmit}>Save</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}