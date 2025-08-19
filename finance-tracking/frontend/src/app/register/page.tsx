"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card"

export default function RegisterPage() {
    const [form, setForm] = useState({ name: "", email: "", password: "" })
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await api.post("/auth/register", form)
            toast("Account Created Successfully")
            router.push("/login")
        } catch (err: any) {
            const message = err.response?.data?.message || "Registration Failed"
            toast.error("Error", { description: message })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center">
            {/* 🔥 Background with overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1350&q=80')",
                }}
            />
            <div className="absolute inset-0 bg-black/50" />

            {/* Card */}
            <Card className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-3xl font-extrabold text-center text-black">
                        Create an Account ✨
                    </CardTitle>
                    <CardDescription className="text-center text-gray-600">
                        Join us and start managing your money smartly
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Your Name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="border-gray-300 focus-visible:ring-black"
                            />
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="border-gray-300 focus-visible:ring-black"
                            />
                        </div>

                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="********"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className="border-gray-300 focus-visible:ring-black"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-black text-white hover:bg-gray-800"
                            disabled={loading}
                        >
                            {loading ? "Creating Account..." : "Sign Up"}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-700 text-center">
                        Already have an account?{" "}
                        <a href="/login" className="font-semibold underline">
                            Login
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
