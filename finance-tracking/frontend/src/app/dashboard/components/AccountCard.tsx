"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AccountCard({ name, currency, balance }: { name: string; currency: string; balance: number }) {
    return (
        <Card className="shadow-sm hover:shadow-md transition">
            <CardHeader>
                <CardTitle>{name}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-500">{currency}</p>
                <p className={`font-bold text-lg ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {balance.toLocaleString(undefined, { style: "currency", currency })}
                </p>
            </CardContent>
        </Card>
    )
}