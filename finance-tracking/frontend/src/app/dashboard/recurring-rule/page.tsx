"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { accountsApi, categoriesApi, recurringRuleApis } from "@/lib/api";
import { useEffect, useState } from "react"
import RecurringForm from "./RecurringForm";
import RecurringRulesTable from "./RecurringRulesTable";
import { Button } from "@/components/ui/button";


export default function RecurringRulePage() {
    const [rules, setRules] = useState<any[]>([])
    const [accounts, setAccounts] = useState<any[]>([])
    const [openForm, setOpenForm] = useState(false);
    const [categories, setCategories] = useState<any[]>([])

    const fetchAll = async () => {
        const [r, a, c] = await Promise.all(
            [
                recurringRuleApis.list(),
                accountsApi.list(),
                categoriesApi.list()
            ]
        );
        setRules(r.data || [])
        setAccounts(a.data || []);
        setCategories(c.data || [])
    }

    useEffect(() => {
        fetchAll()
    }, [])

    const handleCreate = async (payload: any) => {
        await recurringRuleApis.create(payload);
        await fetchAll();
        setOpenForm(false)
    }
    const onRefresh = () => fetchAll()
    return (
        <div className="p-6 space-y-6">
            <Card>
                <CardHeader className="flex items-center justify-between">
                    <CardTitle>Recurring Rules</CardTitle>
                    <Button onClick={() => setOpenForm(true)}>+ Add Rule</Button>
                </CardHeader>
                <CardContent>
                    <RecurringRulesTable
                        rules={rules}
                        refresh={onRefresh}
                    />
                </CardContent>
            </Card>
            <RecurringForm
                open={openForm}
                onClose={() => setOpenForm(false)}
                onSave={handleCreate}
                accounts={accounts}
                categories={categories}
            />
        </div>
    )
}