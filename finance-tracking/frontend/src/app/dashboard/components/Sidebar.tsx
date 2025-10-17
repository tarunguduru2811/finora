"use client"

import Link from "next/link";
import { CreditCard, Home, PieChart, Settings, LogOut, List, HandCoins, Repeat2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUserStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
    },
    {
        name: "Budgets", href: "/dashboard/budgets", icon: HandCoins
    },
    {
        name: "Recurring Rules", href: "/dashboard/recurring-rule", icon: Repeat2
    }
]
export function Sidebar() {
    const router = useRouter()
    const { setUser } = useUserStore();
    return (
        <div className="h-screen w-64 bg-white border-r flex flex-col">
            {/* Logo */}
            <div className="h-16 flex items-center justify-center font-bold text-xl border-b">
                <Image width={180} height={50} alt="Logo"
                    src="/assets/Finora.png"
                />
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
                <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 w-full" onClick={() => {
                    localStorage.removeItem("token")
                    setUser(null)
                    router.push("/")
                }}>
                    <LogOut className="w-5 h-5" /> Logout
                </button>
            </div>
        </div >
    )
}