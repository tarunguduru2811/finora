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
    };
  
    const handleToggle = async (id: number, active: boolean) => {
      await recurringRuleApis.update(id, { active: !active });
      refresh();
    };
  
    // 👉 Mobile view
    const MobileView = () => (
      <div className="space-y-4 md:hidden">
        {rules.map((rule) => (
          <div key={rule.id} className="rounded-lg border p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-medium">{getRuleName(rule)}</p>
              {rule.active ? (
                <Badge>Active</Badge>
              ) : (
                <Badge variant="secondary">Inactive</Badge>
              )}
            </div>
  
            <p className="text-sm text-muted-foreground">
              {getRuleType(rule)} • {rule.cron}
            </p>
  
            <pre className="text-xs bg-muted p-2 rounded max-h-32 overflow-auto">
              {JSON.stringify(rule.template, null, 2)}
            </pre>
  
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1"
                variant={rule.active ? "default" : "secondary"}
                onClick={() => handleToggle(rule.id, rule.active)}
              >
                {rule.active ? "Deactivate" : "Activate"}
              </Button>
              <Button
                size="sm"
                className="flex-1"
                variant="destructive"
                onClick={() => handleDelete(rule.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
  
        {rules.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            No Recurring Rules Yet
          </p>
        )}
      </div>
    );
  
    // 👉 Desktop table
    const DesktopView = () => (
      <div className="hidden md:block overflow-x-auto">
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
            {rules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell>{getRuleName(rule)}</TableCell>
                <TableCell>{getRuleType(rule)}</TableCell>
                <TableCell className="max-w-[160px] truncate">
                  {rule.cron}
                </TableCell>
                <TableCell className="max-w-[240px] truncate">
                  {JSON.stringify(rule.template)}
                </TableCell>
                <TableCell>
                  {rule.active ? (
                    <Badge>Active</Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    size="sm"
                    variant={rule.active ? "default" : "secondary"}
                    onClick={() => handleToggle(rule.id, rule.active)}
                  >
                    {rule.active ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(rule.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
  
            {rules.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No Recurring Rules Yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  
    return (
      <>
        <MobileView />
        <DesktopView />
      </>
    );
  }
  