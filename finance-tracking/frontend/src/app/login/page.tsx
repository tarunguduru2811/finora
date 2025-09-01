"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FaGoogle } from 'react-icons/fa';
import { FaGitlab } from 'react-icons/fa6';
import { FaXTwitter } from 'react-icons/fa6';

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import { api, handleOAuth } from "@/lib/api"
import { toast } from "sonner"
import { KeyRound } from "lucide-react"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const [gitlabLoading, setGitlabLoading] = useState(false);
    const [twitterLoading, setTwitterLoading] = useState(false);
    const [password, setPassword] = useState("")
    const { setUser } = useUserStore()
    const user = useUserStore((state) => state.user)
    const router = useRouter()

    const handleLogin = async () => {
        try {
            const res = await api.post("/auth/login", { email, password })
            localStorage.setItem("token", res.data.token)
            // console.log("User Details", res.data.user)
            const userData = {
                id: res.data.user.id,
                name: res.data.user.name,
                email: res.data.user.email
            }
            setUser(userData)
            console.log("User Details...", useUserStore.getState().user);
            router.push("/dashboard")
        } catch (error) {
            console.error(error)
            toast("Invalid Credentials")
        }
    }

    const handleGoogleLogin = async () => {
        setGoogleLoading(true)
        // Redirect to Google OAuth endpoint
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/auth/google`
        // setUser({res.data.userDetails})
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleLogin()
        }
    }
    return (
        <div className="relative min-h-screen flex items-center justify-center">
            {/* Background image with overlay */}
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

                <CardContent className="space-y-4" onKeyPress={handleKeyPress}>
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

                <CardFooter className="flex flex-col space-y-4">
                    <Button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full bg-black text-white hover:bg-gray-800 disabled:opacity-50"
                    >
                        {loading ? "Signing in..." : "Login"}
                    </Button>

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
                        disabled={gitlabLoading}
                        variant={"outline"}
                        className="w-full flex items-center gap-3 border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                    >
                        {
                            gitlabLoading ? (
                                <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
                            ) :
                                (
                                    <FaGitlab className="w-5 h-5" />
                                )
                        }
                        {gitlabLoading ? "Redirecting to Gitlab.." : "Continue with Gitlab"}
                    </Button>

                    <Button
                        onClick={() => {
                            setTwitterLoading(true)
                            handleOAuth.twitterAuth();
                        }}
                        className="w-full flex items-center gap-3 border-gray-300 hover:bg-gray-50 disabled:opacity-50"
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

                    {/* Links */}
                    <div className="text-sm text-gray-700 text-center space-y-2">
                        <p>
                            Don't have an account?{" "}
                            <a
                                href="/register"
                                className="font-semibold underline hover:text-black transition-colors"
                            >
                                Register
                            </a>
                        </p>
                        <p>
                            <a
                                href="/forgot-password"
                                className="font-semibold underline hover:text-black transition-colors"
                            >
                                Forgot Password?
                            </a>
                        </p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
