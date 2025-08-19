"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { recurringRuleApis } from "@/lib/api";


function getRuleType(rule: any) {
    if (rule?.template?.budget) return "Budget";
    if (rule?.template?.transaction) return "Transaction"
    return "Unknown"
}

function getRuleName(rule: any) {
    return (
        rule?.template?.budget?.name ||
        rule?.template?.transaction?.notes ||
        "Unnamed Rule"
    )
}

type Props = {
    rules: any[],
    refresh: () => void
}

export default function RecurringRulesTable({ rules, refresh }: Props) {
    const handleDelete = async (id: number) => {
        await recurringRuleApis.delete(id);
        refresh();
    }

    const handleToggle = async (id: number, active: boolean) => {
        const data = { active: !active }
        await recurringRuleApis.update(id, data);
        refresh();
    }
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Cron</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    rules.map((rule) => (
                        <TableRow>
                            <TableCell>{getRuleName(rule)}</TableCell>
                            <TableCell>{getRuleType(rule)}</TableCell>
                            <TableCell>{rule.cron}</TableCell>
                            <TableCell>{JSON.stringify(rule.template, null, 2)}</TableCell>
                            <TableCell>
                                {
                                    rule.active ? <Badge variant="default">Active</Badge> : <Badge variant="secondary">Inactive</Badge>
                                }
                            </TableCell>
                            <TableCell className="flex gap-2">
                                <Button size="sm" variant={rule.active ? "default" : "secondary"} onClick={() => handleToggle(rule.id, rule.active)}>
                                    {rule.active ? "Deactivate" : "Activate"}
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleDelete(rule.id)}>
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))
                }
                {
                    rules.length === 0 && (
                        <TableRow>
                            <TableCell>No Recurring Rules Yet</TableCell>
                        </TableRow>
                    )
                }
            </TableBody>
        </Table>
    )
}