"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useUserStore } from "@/lib/store"
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";


export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setUser } = useUserStore();
    const router = useRouter();
    const handleLogin = async () => {
        try {
            const res = await api.post("/auth/login", { email, password }, {
                withCredentials: true  // This is crucial for sending/receiving cookies
            });
            localStorage.setItem("token", res.data.token)
            setUser(res.data.user)
            router.push("/dashboard")
        } catch (error) {
            console.error(error);
            alert("Login Failed")
        }
    }
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md space-y-4 p-6 border rounded-lg shadow">
                <h1 className="text-2xl font-bold">Login</h1>
                <Input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button onClick={handleLogin} className="w-full">Login</Button>
            </div>
        </div>
    )
}