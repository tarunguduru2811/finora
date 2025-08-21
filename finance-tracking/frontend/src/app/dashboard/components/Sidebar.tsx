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
                <Image width={150} height={50} alt="Logo"
                    src="https://sdmntprcentralus.oaiusercontent.com/files/00000000-a154-61f5-bd5f-978473d4b4c7/raw?se=2025-08-21T07%3A19%3A50Z&sp=r&sv=2024-08-04&sr=b&scid=ef1958c5-70fd-5317-980f-6addbbd99235&skoid=0da8417a-a4c3-4a19-9b05-b82cee9d8868&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-08-20T20%3A54%3A23Z&ske=2025-08-21T20%3A54%3A23Z&sks=b&skv=2024-08-04&sig=9SoAli%2BgeT16iEwNJRPjWMtSREoH88Z9t2SZJDMhmXI%3D"
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