"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogHeader } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useAccountStore } from "@/lib/store"
import { DialogContent, DialogTrigger } from "@radix-ui/react-dialog"
import { useState } from "react"




export default function AddAccountModal() {
    const [name, setName] = useState("");
    const [currency, setCurrency] = useState("USD");
    const { addAccount } = useAccountStore();
    const handleSubmit = async () => {
        await addAccount(name, currency)
        setName("");
        setCurrency("USD")
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Add Account</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>New Account</DialogHeader>
                <Input placeholder="Account Name" value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Input placeholder="Currency" value={currency}
                    onChange={(e) => setCurrency(e.target.value)} />
                <Button onClick={handleSubmit}>Save</Button>
            </DialogContent>
        </Dialog>
    )
}