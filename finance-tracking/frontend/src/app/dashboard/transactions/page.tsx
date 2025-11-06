"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api"
import { useEffect, useState } from "react"
import TransactionFilters from "./TransactionFilters";
import AddTransactionModal from "./AddTransactionModal";
import TransactionTable from "./TransactionTable";


export default function TransactionPage() {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        fetchAccounts();
        fetchTransactions();
        fetchCategories();
    }, [])

    const fetchTransactions = async (filters?: {
        accountId?: number;
        start?: string;
        end?: string;
        type?: string;   // ✅ match backend param
    }) => {
        try {
            const { accountId, start, end, type } = filters || {};
            console.log("Apply Button Clicked");
            console.log("Printing the params and query",)
            const res = await api.get("/transactions", {
                params: {
                    accountId: accountId || undefined,
                    start: start || undefined,
                    end: end || undefined,
                    type: type || undefined
                }
            });
            console.log("Result Data for transactions...", res.data);
            setTransactions(res.data);
        } catch (err) {
            console.error("Error in Fetching Transactions", err);
        }
    }


    const fetchAccounts = async () => {
        try {
            const res = await api.get("/accounts")
            setAccounts(res.data)
        } catch (error) {
            console.log("Error in Fetching Accounts", error);
        }
    }

    const fetchCategories = async () => {
        try {
            const res = await api.get("/categories");
            setCategories(res.data);
        } catch (err) {
            console.error("Error in Fetching Categories", err);
        }
    }

    const handleTransaction = async (form: any) => {
        await api.post("/transactions", {
            ...form,
            accountId: parseInt(form.accountId),
            amount: parseFloat(form.amount)
        });
        fetchTransactions();
    }


    return (
        <div className="p-6 space-y-6 mt-7">
            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <TransactionFilters
                        accounts={accounts}
                        selectedAccount={selectedAccount}
                        typeFilter={typeFilter}
                        startDate={startDate}
                        endDate={endDate}
                        onAccountChange={setSelectedAccount}
                        onTypeChange={setTypeFilter}
                        onStartDateChange={setStartDate}
                        onEndDateChange={setEndDate}
                        onApply={fetchTransactions}
                    />
                </CardContent>
            </Card>

            <AddTransactionModal accounts={accounts} onSave={handleTransaction} categories={categories} />

            <Card>
                <CardHeader>
                    <CardTitle>Transactions</CardTitle>
                    <CardContent className="overflow-x-auto">
                        <TransactionTable transactions={transactions}
                        categories={categories} fetchTransactions={fetchTransactions}
                        />
                    </CardContent>
                </CardHeader>
            </Card>
        </div>
    )
}