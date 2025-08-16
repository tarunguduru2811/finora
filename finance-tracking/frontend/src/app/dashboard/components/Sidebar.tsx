"use client"

import Link from "next/link";
import { CreditCard, Home, PieChart, Settings, LogOut, List } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUserStore } from "@/lib/store";

const navItems = [
    {
        name: "Dashboard", href: "/dashboard", icon: Home
    },
    {
        name: "Accounts", href: "/dashboard/accounts", icon: CreditCard
    },
    {
        name: "Transactions", href: "/dashboard/transactions", icon: PieChart
    },
    {
        name: "Categories", href: "/dashboard/category", icon: List
    }
]
export function Sidebar() {
    return (
        <div className="h-screen w-64 bg-white border-r flex flex-col">
            {/* Logo */}
            <div className="h-16 flex items-center justify-center font-bold text-xl border-b">
                Finalytics
            </div>
            {/* navigations */}
            <nav className="flex-1 p-4 space-y-2">
                {
                    navItems.map((item) => {
                        const Icon = item.icon
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        )
                    })
                }
            </nav>

            {/* Logout */}
            <div className="p-4 border-t">
                <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 w-full">
                    <LogOut className="w-5 h-5" /> Logout
                </button>
            </div>
        </div>
    )
}