"use client";

import Link from "next/link";
import { CreditCard, Home, PieChart, LogOut, List, HandCoins, Repeat2, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Accounts", href: "/dashboard/accounts", icon: CreditCard },
  { name: "Transactions", href: "/dashboard/transactions", icon: PieChart },
  { name: "Categories", href: "/dashboard/category", icon: List },
  { name: "Budgets", href: "/dashboard/budgets", icon: HandCoins },
  { name: "Recurring Rules", href: "/dashboard/recurring-rule", icon: Repeat2 },
];

export function Sidebar() {
  const router = useRouter();
  const { setUser } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
  };

  return (
    <>
      {/* Mobile Header (Hamburger) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b flex items-center justify-between px-4 h-16">
        <Image src="/assets/Finora.png" alt="Logo" width={120} height={40} />
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-screen w-64 bg-white border-r flex flex-col transition-transform duration-300 z-50",
          "md:translate-x-0", // always visible on desktop
          isOpen ? "translate-x-0" : "-translate-x-full" // toggle on mobile
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b">
          <Image
            width={180}
            height={50}
            alt="Logo"
            src="/assets/Finora.png"
            className="hidden md:block"
          />
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition text-gray-700"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t">
          <button
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 w-full text-gray-700"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
