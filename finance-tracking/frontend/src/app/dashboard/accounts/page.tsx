"use client"

import { useAccountStore } from "@/lib/store"
import { useEffect } from "react";
import AddAccountModal from "../components/AddAccountModal";
import AccountCard from "../components/AccountCard";

export default function AccountsPage() {
    const { accounts, fetchAccounts } = useAccountStore();
    
    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    return (
        <div className="p-4 mt-10 lg:mt-0 md:mt-0 ">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 w-full">
                <h1 className="text-2xl font-bold flex-shrink-0 ">Accounts</h1>
                <div className="flex-shrink-0">
                    <AddAccountModal />
                </div>
            </div>

            {/* Account Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {accounts.map((acc) => (
                    <AccountCard 
                        key={acc.id} 
                        name={acc.name} 
                        currency={acc.currency}
                        balance={acc.balance} 
                    />
                ))}
            </div>
        </div>
    )
}
