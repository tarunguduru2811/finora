"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api"
import { useEffect, useState } from "react";
import BudgetTable from "./BudgetTable";
import AddBudgetModal from "./AddBudgetModal";
import BudgetOverviewChart from "./BudgetOverviewChart";


export default function BudgetPage() {
    const [budgets, setBudgets] = useState([]);
    const [openAdd, setOpenAdd] = useState(false);
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        fetchBudgets();
        fetchBudgets();
        fetchCategories();
    }, [])

    const fetchBudgets = async () => {
        try {
            const res = await api.get("/budgets");
            setBudgets(res.data)
        } catch (err) {
            console.error("Error in Fetching Budgets", err)
        }
    }

    const fetchCategories = async () => {
        try {
            const res = await api.get("/categories");
            console.log("Fetched Categories for budgets", categories)
            setCategories(res.data)
        } catch (err) {
            console.error("Error in fetching Categories")
        }
    }

    const handleAddBudget = async (form: any) => {
        try {
            const res = await api.post("/budgets", form)
            setOpenAdd(false)
            fetchBudgets();
        } catch (err) {
            console.error("Error in Adding Budget", err)
        }
    }

    const handleDeleteBudget = async (id: number) => {
        try {
            const res = await api.delete(`/budgets/${id}`);
            fetchBudgets();
        } catch (err) {
            console.error("Error in deleting the budget", err)
        }
    }

    return (
        <div className="p-6 space-y-6 mt-7">
            <Card>
                <CardHeader className="flex justify-between items-center">
                    <CardTitle>Budgets</CardTitle>
                    <Button onClick={() => setOpenAdd(true)}>+ Add Budgets</Button>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        <BudgetOverviewChart budgets={budgets} />
                        <BudgetTable budgets={budgets} onDelete={handleDeleteBudget} categories={categories} />
                    </div>
                </CardContent>
                <AddBudgetModal open={openAdd} onClose={() => setOpenAdd(false)} onSave={handleAddBudget} categories={categories} />
            </Card>
        </div>
    )
}