"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { api, handleOAuth } from "@/lib/api"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaGoogle } from 'react-icons/fa';
import { FaGitlab, FaXTwitter } from 'react-icons/fa6';

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
    const [gitlabLoading, setGitlabLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [twitterLoading, setTwitterLoading] = useState(false)
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

                    {/* Divider */}
                    <div className="relative my-2">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    {/* Google Sign In Button */}
                    <Button
                        onClick={() => {
                            setGoogleLoading(true);
                            handleOAuth.googleAuth();
                        }}
                        disabled={googleLoading}
                        variant="outline"
                        className="w-full flex items-center gap-3 border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                    >
                        {googleLoading ? (
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
                        ) : (
                            <FaGoogle className="w-5 h-5" />
                        )}
                        {googleLoading ? "Redirecting to Google..." : "Continue with Google"}
                    </Button>

                    <Button
                        onClick={() => {
                            setGitlabLoading(true);
                            handleOAuth.gitlabAuth();
                        }}
                        className="w-full flex items-center gap-3 border-gray-300 hover:bg-gray-50 disabled:opacity-50 mt-2"
                        disabled={gitlabLoading}
                        variant={"outline"}
                    >
                        {
                            gitlabLoading ?
                                (
                                    <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
                                ) :
                                (
                                    <FaGitlab className="w-5 h-5" />
                                )
                        }
                        {gitlabLoading ? "Redirecting to Gitlab..." : "Continue with Gitlab"}
                    </Button>

                    <Button
                        onClick={() => {
                            setTwitterLoading(true)
                            handleOAuth.twitterAuth();
                        }}
                        className="w-full flex items-center gap-3 border-gray-300 hover:bg-gray-50 disabled:opacity-50 mt-2"
                        disabled={twitterLoading}
                        variant={"outline"}
                    >
                        {
                            twitterLoading ?
                                (
                                    <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
                                )
                                : (
                                    <FaXTwitter className="w-5 h-5" />
                                )
                        }
                        {twitterLoading ? "Redirecting to Twitter..." : "Continue with Twitter"}
                    </Button>
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
