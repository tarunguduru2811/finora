"use client"

import { addYAxis } from "recharts/types/state/cartesianAxisSlice"
import AddCategoryModal from "./AddCategoryModal"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import CategoryCard from "./CategoryCard"
import CategoryTransaction from "./CategoryTransaction"

interface CategorySummary {
    categoryId: number,
    categoryName: string,
    totalSpent: number,
    transactionCount: number
}

export default function CategoryList() {
    const [categories, setCategories] = useState<CategorySummary[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    const fetchCategories = async () => {
        const res = await api.get("/categories/spend-summary");
        setCategories(res.data)
    }

    useEffect(() => {
        fetchCategories()
    }, [])
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">Categories</h1>
                <AddCategoryModal onCategoryAdded={fetchCategories} />
            </div>
            <div className="text-xl font-bold">
                {
                    categories.map((cat) => (
                        <CategoryCard
                            key={cat.categoryId}
                            name={cat.categoryName}
                            totalSpent={cat.totalSpent}
                            transactionsCount={cat.transactionCount}
                            onClick={() => { setSelectedCategory(cat.categoryId) }}
                        />
                    ))
                }
            </div>

            {
                selectedCategory && (
                    <CategoryTransaction categoryId={selectedCategory} />
                )
            }
        </div>
    )
}