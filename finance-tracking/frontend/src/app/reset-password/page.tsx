"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api";
import { useSearchParams } from "next/navigation";
import { useState } from "react"
import { toast } from "sonner";


export default function resetPassword() {
    const searchParams = useSearchParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const handleSubmit = async () => {
        try {
            const token = searchParams.get("token")
            if (password !== confirmPassword) {
                toast("Password and Confirm Password Must be Same")
                return;
            }
            const res = await api.post("/auth/reset-password", { token, password })
            toast(res.data.message)
        } catch (err) {
            console.log("Error in resetting password", err);
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className=" w-full max-w-md bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl">
                <CardHeader className="text-3xl font-extrabold text-center text-black">
                    <CardTitle>Reset Password</CardTitle>
                </CardHeader>

                <CardContent className="space-y-2">
                    <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
                        className="border-gray-300 focus-visible:ring-black" />
                    <Input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password"
                        className="border-gray-300 focus-visible:ring-black" />

                    <Button onClick={handleSubmit} className="w-full bg-black text-white hover:bg-gray-800">Reset</Button>
                </CardContent>
            </Card>
        </div>
    )
}