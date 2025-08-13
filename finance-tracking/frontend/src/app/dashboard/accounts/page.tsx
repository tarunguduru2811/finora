"use client"

import { useAccountStore } from "@/lib/store"
import { useEffect } from "react";
import AddAccountModal from "../components/AddAccountModal";
import AccountCard from "../components/AccountCard";


export default function AccountsPage() {
    const { accounts, fetchAccounts } = useAccountStore();
    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts])
    return (
        <div>
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">Accounts</h1>
                <AddAccountModal />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {accounts.map((acc) => (
                    <AccountCard key={acc.id} name={acc.name} currency={acc.currency}
                        balance={acc.balance} />
                ))}
            </div>
        </div>
    )
}