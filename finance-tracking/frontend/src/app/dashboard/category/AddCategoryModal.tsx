"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import { useState } from "react"

interface AddCategoryModalProps {
    onCategoryAdded: () => void
}
export default function AddCategoryModal({ onCategoryAdded }: AddCategoryModalProps) {
    const [name, setName] = useState("");
    const [open, setOpen] = useState(false);

    const handleClick = async () => {
        if (!name.trim()) return;
        await api.post("/categories", { name });
        setName("")
        setOpen(false)
        onCategoryAdded();
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add Category</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    Add Category
                </DialogHeader>
                <Input
                    placeholder="Category Name..."
                    value={name} onChange={(e) => setName(e.target.value)} />
                <Button onClick={handleClick} className="mt-2">Save</Button>
            </DialogContent>
        </Dialog>
    )
}