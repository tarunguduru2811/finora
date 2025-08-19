"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Wallet, ListChecks, BarChart3, Repeat, ArrowRight, LogIn, UserPlus, ShieldCheck, Zap, LineChart } from "lucide-react";
import { useRouter } from "next/navigation";


export default function HomePage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <section className="text-center py-20 px-6">
        <motion.h1
          className="text-5xl font-extrabold tracking-tight"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Smart Finance Dashboard
        </motion.h1>
        <motion.p
          className="mt-4 text-lg text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Track your money, manage budgets, and automate recurring expenses — all in one clean dashboard.
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="mt-8 flex justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button size="lg" className="bg-black text-white font-bold px-6 py-5 rounded-xl hover:bg-gray-800" onClick={() => router.push("/login")}>
            Get Started <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button size="lg" variant="outline" className="px-6 py-5 rounded-xl border-black text-black hover:bg-gray-100" onClick={() => { router.push("/login") }}>
            <LogIn className="mr-2 w-5 h-5" /> Login
          </Button>
          <Button size="lg" variant="outline" className="px-6 py-5 rounded-xl border-black text-black hover:bg-gray-100" onClick={() => router.push("/register")}>
            <UserPlus className="mr-2 w-5 h-5" /> Register
          </Button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-10 mb-20">
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Wallet /> Accounts</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">Manage all your bank accounts in one place.</CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ListChecks /> Transactions</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">Track your income and expenses seamlessly.</CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart3 /> Budgets</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">Create and monitor budgets effortlessly.</CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Repeat /> Recurring Rules</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">Automate recurring expenses & savings.</CardContent>
        </Card>
      </section>

      {/* Why Choose Us Section */}
      <section className="px-10 text-center mb-20">
        <h2 className="text-3xl font-bold mb-10">Why Choose Smart Finance?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShieldCheck /> Secure</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600">Your financial data is fully encrypted and safe.</CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Zap /> Fast</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600">Track expenses & budgets instantly, without hassle.</CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><LineChart /> Insightful</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600">AI-powered insights help you save more and spend smart.</CardContent>
          </Card>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="px-10 mb-20">
        <h2 className="text-2xl font-bold mb-6">Quick Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <CardHeader><CardTitle>Total Balance</CardTitle></CardHeader>
            <CardContent className="text-3xl font-bold">$12,450</CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <CardHeader><CardTitle>Monthly Budget</CardTitle></CardHeader>
            <CardContent>
              <p className="text-xl">$3,200 / $4,000</p>
              <Progress value={80} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <CardHeader><CardTitle>Recent Transaction</CardTitle></CardHeader>
            <CardContent className="text-gray-600">- $120 • Grocery</CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-10 text-center mb-20">
        <h2 className="text-3xl font-bold mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-xl font-semibold">1. Create Account</h3>
            <p className="text-gray-600 mt-2">Sign up in less than 2 minutes and connect your accounts.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">2. Track & Plan</h3>
            <p className="text-gray-600 mt-2">Track spending, set budgets, and add recurring rules.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">3. Automate & Save</h3>
            <p className="text-gray-600 mt-2">Let automation handle your recurring transactions & budgets.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <footer className="text-center py-16 border-t border-gray-200">
        <h3 className="text-2xl font-semibold">Take control of your finances today 🚀</h3>
        <div className="mt-6 flex justify-center gap-4">
          <Button size="lg" className="bg-black text-white font-bold rounded-xl hover:bg-gray-800" onClick={() => router.push("/login")}>
            Start Free
          </Button>
          <Button size="lg" variant="outline" className="px-6 py-5 rounded-xl border-black text-black hover:bg-gray-100" onClick={() => { router.push("/login") }}>
            <LogIn className="mr-2 w-5 h-5" /> Login
          </Button>
          <Button size="lg" variant="outline" className="px-6 py-5 rounded-xl border-black text-black hover:bg-gray-100" onClick={() => router.push("/register")}>
            <UserPlus className="mr-2 w-5 h-5" /> Register
          </Button>
        </div>
      </footer>
    </div>
  );
}
