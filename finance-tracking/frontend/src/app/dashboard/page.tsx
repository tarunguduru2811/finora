"use client"

import { useUserStore } from "@/lib/store"
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function DashboardPage() {
    const user = useUserStore((state) => state.user);
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push("/login")
        }
    }, [user, router])
    return (
        <div>
            <p>Welcome to the dashboard</p>
        </div>
    )
}