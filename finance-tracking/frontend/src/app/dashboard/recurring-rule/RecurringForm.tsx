"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectTrigger, Select, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useEffect, useMemo, useState } from "react";

type Props = {
    open: boolean;
    onClose: () => void;
    onSave: (payload: any) => Promise<void> | void;
    accounts: any[],
    categories: any[]
}

export default function RecurringForm({ open, onClose, onSave, accounts, categories }: Props) {
    const [ruleType, setRuleType] = useState<"transaction" | "budget">("transaction");
    const [active, setActive] = useState(true);
    const [cron, setCron] = useState("*/1 * * * *");

    //Transaction Form
    const [tAccountId, setTAccountId] = useState<string>("");
    const [tCategoryId, setTCategoryId] = useState<string>("");
    const [tType, setTType] = useState<"INCOME" | "EXPENSE" | "TRANSFER">("EXPENSE");
    const [tAmount, setTAmount] = useState<string>("");
    const [tCurrency, setTCurrency] = useState<string>("USD");
    const [tNotes, setTNotes] = useState<string>("");
    const [tMerchant, setTMerchant] = useState<string>("");

    //Budget Form
    const [bName, setBName] = useState<string>("");
    const [bCategoryId, setBCategoryId] = useState<string>("");
    const [bAmount, setBAmount] = useState<string>("");
    const [bPeriod, setBPeriod] = useState<"WEEKLY" | "MONTHLY" | "YEARLY">("MONTHLY");

    useEffect(() => {
        // reset when opening
        if (!open) return;
        setRuleType("transaction");
        setActive(true);
        setCron("0 9 * * 1");
        setTAccountId("");
        setTCategoryId("");
        setTType("EXPENSE");
        setTAmount("");
        setTCurrency("USD");
        setTNotes("");
        setBName("");
        setBCategoryId("");
        setBAmount("");
        setBPeriod("MONTHLY");
    }, [open]);

    const cronPreset = useMemo(
        () => [
            { label: "Every Minute", value: "*/1 * * * *" },
            { label: "Every Day at 9am", value: "0 9 * * *" },
            { label: "Every Monday at 9am", value: "0 9 * * 1" },
            { label: "First day of month at 9am", value: "0 9 1 * *" }
        ],
        []
    )

    const submit = async () => {
        let template: any = {};
        if (ruleType === "transaction") {
            if (!tAccountId || !tAmount) return;
            template.transaction = {
                accountId: Number(tAccountId),
                categoryId: Number(tCategoryId),
                type: tType,
                amount: Number(tAmount),
                currency: tCurrency || "USD",
                notes: tNotes || undefined,
                merchant: tMerchant || undefined,
            }
        } else {
            if (!bCategoryId || !bAmount) return

            template.budget = {
                name: bName || undefined,
                categoryId: Number(bCategoryId),
                amount: Number(bAmount),
                period: bPeriod
            }
        }

        const payload = { cron, template, active }
        await onSave(payload)
    }


    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Recurring Rule</DialogTitle>
                </DialogHeader>
                {/* Type */}
                <div className="space-y-1">
                    <Label>Rule Type</Label>
                    <Select value={ruleType} onValueChange={(v: "transaction" | "budget") => setRuleType(v)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select rule" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="transaction">Transaction</SelectItem>
                            <SelectItem value="budget">Budget</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Cron */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <Label>Cron</Label>
                        <Input value={cron} onChange={(e) => setCron(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                        <Label>Quick Preset</Label>
                        <Select onValueChange={setCron}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose Preset" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    cronPreset.map((p) => (
                                        <SelectItem value={p.value} key={p.value}>{p.label}</SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Dynamic Form */}
                {
                    ruleType === "transaction" ?
                        (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label>Account</Label>
                                    <Select value={tAccountId} onValueChange={setTAccountId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Account" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                accounts.map((acc) => (
                                                    <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1">
                                    <Label>Category</Label>
                                    <Select value={tCategoryId} onValueChange={setTCategoryId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                categories.map((cat) => (
                                                    <SelectItem value={cat.id} key={cat.id}>{cat.name}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1">
                                    <Label>Type</Label>
                                    <Select value={tType} onValueChange={(v: any) => setTType(v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectContent>
                                                <SelectItem value="INCOME">Income</SelectItem>
                                                <SelectItem value="EXPENSE">Expense</SelectItem>
                                                <SelectItem value="TRANSFER">Transfer</SelectItem>
                                            </SelectContent>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label>Amount</Label>
                                    <Input value={tAmount} onChange={(e) => setTAmount(e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label>Merchant</Label>
                                    <Input value={tMerchant} onChange={(e) => setTMerchant(e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label>Currency</Label>
                                    <Input value={tCurrency} onChange={(e) => setTCurrency(e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label>Notes</Label>
                                    <Input value={tNotes} onChange={(e) => setTNotes(e.target.value)} />
                                </div>
                            </div>
                        )
                        : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label>Budget Name</Label>
                                    <Input value={bName} onChange={(e) => setBName(e.target.value)} />
                                </div>

                                <div className="space-y-1">
                                    <Label>Category</Label>
                                    <Select value={bCategoryId} onValueChange={setBCategoryId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                categories.map((cat) => (
                                                    <SelectItem value={cat.id} key={cat.id}>{cat.name}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1">
                                    <Label>Amount</Label>
                                    <Input value={bAmount} onChange={(e) => setBAmount(e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label>Period</Label>
                                    <Select value={bPeriod} onValueChange={(v: any) => setBPeriod(v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Period" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="WEEKLY">Weekly</SelectItem>
                                            <SelectItem value="MONTHLY">Monthly</SelectItem>
                                            <SelectItem value="YEARLY">Yearly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )
                }

                {/* Active */}

                <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                        <p className="text-sm font-medium leading-none">Active</p>
                        <p className="text-xs text-muted-foreground">Enable or Diable this rule</p>
                        <Switch checked={active} onCheckedChange={setActive} />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={submit}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}