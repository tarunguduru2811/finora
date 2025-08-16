"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface CategoryProps {
    name: string,
    totalSpent: number,
    transactionsCount: number,
    onClick: () => void;
}


export default function CategoryCard({ name, totalSpent, transactionsCount, onClick }: CategoryProps) {
    return (
        <Card onClick={onClick} className="cursor-pointer hover:shadow-lg transition">
            <CardHeader>
                {name}
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Transactions Count : {transactionsCount}</p>
                <p className="text-lg font-bold text-red-600">${totalSpent.toFixed(2)}</p>
            </CardContent>
        </Card>
    )
}