"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner";


export default function RegisterPage() {
    const [form, setForm] = useState({ name: "", email: "", password: "" })
    const [loading, setLoading] = useState(false)
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/auth/register", form)
            toast("Account Created Successfully");
            router.push("/login")
        }
        catch (err: any) {
            const message = err.response?.data?.message || "Registration Failed"
            toast.error("Error", { description: message });
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Create an Account</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                        </div>

                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
                        </div>

                        <Button>
                            {loading ? "Creating Account..." : "SignUP"}
                        </Button>
                    </form>
                    <p className="text-sm text-center mt-4">
                        Already have an account? {" "}
                        <a href="/login" className="text-blue-500 hover:underline">
                            Login
                        </a>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}