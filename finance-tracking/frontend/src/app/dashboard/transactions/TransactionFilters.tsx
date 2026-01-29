"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


interface Props {
    accounts: any[],
    selectedAccount: string,
    typeFilter: string,
    startDate: string,
    endDate: string,
    onAccountChange: (val: string) => (void)
    onTypeChange: (val: string) => (void)
    onStartDateChange: (val: string) => (void)
    onEndDateChange: (val: string) => (void)
    onApply: (filters: {
        accountId?: number;
        start?: string;
        end?: string;
        type?: string;
    }) => void
}

export default function TransactionFilters({ accounts, selectedAccount, typeFilter, startDate, endDate, onAccountChange, onTypeChange, onStartDateChange
    , onEndDateChange, onApply
}: Props) {
    return (
        <div className="flex flex-wrap gap-4">
            <Select value={selectedAccount} onValueChange={onAccountChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Select Account.." />
                </SelectTrigger>
                <SelectContent>
                    {
                        accounts.map((acc) => (
                            <SelectItem value={String(acc.id)} key={acc.id}>{acc.name}</SelectItem>
                        ))
                    }
                </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={onTypeChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Select Trans Type...." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="INCOME">Income</SelectItem>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
                    <SelectItem value="TRANSFER">Transfer</SelectItem>
                </SelectContent>
            </Select>

            <Input type="Date" value={startDate} onChange={(e) => onStartDateChange(e.target.value)} />
            <Input type="Date" value={endDate} onChange={(e) => onEndDateChange(e.target.value)} />

            <Button onClick={() =>
                onApply({
                    accountId: selectedAccount ? Number(selectedAccount) : undefined,
                    start: startDate || undefined,
                    end: endDate || undefined,
                    type: typeFilter || undefined,
                })}>
                Apply
            </Button>
        </div>
    )
}