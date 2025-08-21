"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import { api } from "@/lib/api"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { setUser } = useUserStore()
    const router = useRouter()

    const handleLogin = async () => {
        try {
            const res = await api.post("/auth/login", { email, password })
            localStorage.setItem("token", res.data.token)
            setUser(res.data)
            router.push("/dashboard")
        } catch (error) {
            console.error(error)
            alert("Login Failed")
        }
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center">
            {/* 🔥 Background image with overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1350&q=80')",
                }}
            />
            <div className="absolute inset-0 bg-black/50" />

            {/* Login card */}
            <Card className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-3xl font-extrabold text-center text-black">
                        Welcome Back 👋
                    </CardTitle>
                    <CardDescription className="text-center text-gray-600">
                        Sign in to continue managing your finances
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <Input
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-gray-300 focus-visible:ring-black"
                    />
                    <Input
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border-gray-300 focus-visible:ring-black"
                    />
                </CardContent>

                <CardFooter className="flex flex-col space-y-3">
                    <Button
                        onClick={handleLogin}
                        className="w-full bg-black text-white hover:bg-gray-800"
                    >
                        Login
                    </Button>
                    <p className="text-sm text-gray-700 text-center">
                        Don’t have an account?{" "}
                        <a href="/register" className="font-semibold underline">
                            Register
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
