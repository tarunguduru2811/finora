"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { useState } from "react"
import { toast } from "sonner";


export default function forgotPassword() {
    const [email, setEmail] = useState("");

    const handleSubmit = async () => {
        try {
            const res = await api.post("/auth/forgot-password", { email })
            toast(res.data.message)
        } catch (err) {
            console.log("Error in ResetPassword Link");
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className=" w-full max-w-md bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl">
                <CardHeader className="text-3xl font-extrabold text-center text-black">
                    <CardTitle>Forgot Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Label >Email</Label>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email..."
                        className="border-gray-300 focus-visible:ring-black" />
                    <Button onClick={handleSubmit} className="w-full bg-black text-white hover:bg-gray-800">Submit</Button>
                </CardContent>
            </Card>
        </div>
    )
}
