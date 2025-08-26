"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import axios from "axios"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { useUserStore } from "@/lib/store"
import { api } from "@/lib/api"
import Chart from "chart.js/auto"


interface Props {
    open: boolean,
    onClose: () => void;
    openDialog: () => void
}
export default function MonthlyReportCard({ open, onClose, openDialog }: Props) {
    const user = useUserStore.getState().user;
    const [date, setDate] = useState<number>(new Date().getMonth() + 1);
    const [year, setYear] = useState<number>(new Date().getFullYear())

    const handleDownload = async () => {
        try {
            const res = await api.get(
                `/transactions/report/${useUserStore.getState().user?.id}/${date}/${year}`
            )
            const { totalExpense, totalIncome, netSavings, categoryTotals } = res.data

            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d");

            const chart = new Chart(ctx!, {
                type: "pie",
                data: {
                    labels: Object.keys(categoryTotals),
                    datasets: [
                        {
                            data: Object.values(categoryTotals),
                            backgroundColor: ["#f87171", "#34d399", "#fbbf24", "#a78bfa"]
                        }
                    ]
                },
                options: {
                    animation: false, //render instantly
                }
            })

            await new Promise((resolve) => requestAnimationFrame(resolve))

            //convert chart to image
            const chartImage = canvas.toDataURL("image/png")

            const doc = new jsPDF();

            //Title
            doc.setFontSize(18);
            doc.text(`Monthly Financial Report - ${date}/${year}`, 105, 20, { align: "center" });

            //Income / Expenses / Savings
            doc.setFontSize(12);
            doc.text(`Total Income:$${totalIncome.toFixed(2)}`, 20, 40);
            doc.text(`Total Expenses:$${totalExpense.toFixed(2)}`, 20, 50);
            doc.text(`Net Savings:$${netSavings.toFixed(2)}`, 20, 60);


            // doc.addImage(chartImage, "PNG", 20, 70, 160, 100)

            autoTable(doc, {
                startY: 110,
                head: [["Category", "Amount $"]],
                //body: Object.entries(categoryTotals).map(([cat, amt]) => [cat, amt]),

            })

            doc.save(`Financial_Report_${date}_${year}.pdf`)

        } catch (err) {
            console.error("Download error:", err)
            alert("Error downloading report. Check console for details.")
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogHeader>
                <DialogTitle>
                    <Button onClick={openDialog}>Generate Monthly Report</Button>
                </DialogTitle>
            </DialogHeader>
            <DialogContent>
                <div className="space-y-2">
                    <Label>Month</Label>
                    <select
                        value={date}
                        onChange={(e) => setDate(parseInt(e.target.value))}
                        className="border p-2 rounded-lg"
                    >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                            <option key={m} value={m}>
                                {new Date(0, m - 1).toLocaleString("default", { month: "long" })}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <Label>Year</Label>
                    <Input type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value))} />
                </div>
                <div className="flex justify-center items-center gap-2">
                    <Button onClick={handleDownload} >Submit</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}