"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";

import { useState } from "react"


interface Props {
    accounts: any[],
    onSave: (data: any) => void,
    categories: any[]
}

export default function AddTransactionModal({ accounts, onSave, categories }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState(
        {
            accountId: "",
            amount: "",
            type: "EXPENSE",
            date: "",
            merchant: "",
            notes: "",
            categoryId: ""
        }
    )

    const handleSave = () => {
        onSave(form)
        setForm({
            accountId: "",
            amount: "",
            type: "EXPENSE",
            date: "",
            merchant: "",
            notes: "",
            categoryId: ""
        })
        setIsOpen(false)
    }


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>Add Transaction</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    New Transaction
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="space-y-5">Account</Label>
                        <Select value={form.accountId} onValueChange={(v) => setForm({ ...form, accountId: v })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Account" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    accounts.map((acc) => (
                                        <SelectItem key={acc.id} value={String(acc.id)}>{acc.name}</SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>
                            Category
                        </Label>
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
                    </div>
                    <div className="space-y-2">
                        <Label>Amount</Label>
                        <Input value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label>Type</Label>
                        <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                            <SelectTrigger><SelectValue placeholder="Select Type..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="INCOME">Income</SelectItem>
                                <SelectItem value="EXPENSE">Expense</SelectItem>
                                <SelectItem value="TRANSFER">Transfer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Date</Label>
                        <Input type="Date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                    </div>

                    <div className="space-y-2">
                        <Label>Merchant</Label>
                        <Input value={form.merchant} onChange={(e) => setForm({ ...form, merchant: e.target.value })} />
                    </div>

                    <div className="space-y-2">
                        <Label>Notes</Label>
                        <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSave}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}