"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6 max-w-3xl"
        >
          <Image
            src="https://sdmntprcentralus.oaiusercontent.com/files/00000000-a154-61f5-bd5f-978473d4b4c7/raw?se=2025-08-21T07%3A19%3A50Z&sp=r&sv=2024-08-04&sr=b&scid=ef1958c5-70fd-5317-980f-6addbbd99235&skoid=0da8417a-a4c3-4a19-9b05-b82cee9d8868&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-08-20T20%3A54%3A23Z&ske=2025-08-21T20%3A54%3A23Z&sks=b&skv=2024-08-04&sig=9SoAli%2BgeT16iEwNJRPjWMtSREoH88Z9t2SZJDMhmXI%3D"
            alt="Finora Logo"
            width={250}
            height={250}
            className="mx-auto"
          />

          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Smarter <span className="underline decoration-4">Financial</span> Management
          </h1>
          <p className="text-lg md:text-xl text-gray-700">
            Finora helps you track your spending, analyze expenses, set budgets, and grow
            your savings — all in one stylish dashboard.
          </p>

          <div className="flex justify-center gap-4">
            <Button className="bg-black text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-gray-800" onClick={() => router.push("/register")}>
              Get Started
            </Button>
            <Button
              variant="outline"
              className="border-black text-black hover:bg-black hover:text-white px-6 py-3 rounded-xl text-lg"
            >
              Learn More
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">
            Everything you need to manage your <span className="underline">money</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Track Every Expense",
                desc: "Stay on top of your daily spending with clear and categorized reports.",
              },
              {
                title: "Smart Budgets",
                desc: "Set monthly budgets and get notified before overspending.",
              },
              {
                title: "Analytics That Matter",
                desc: "Visualize your income, expenses, and savings trends with powerful charts.",
              },
              {
                title: "Financial Goals",
                desc: "Plan ahead and achieve savings goals for trips, investments, or purchases.",
              },
              {
                title: "Multi-Device Access",
                desc: "Track and manage your finances anywhere — mobile, tablet, or desktop.",
              },
              {
                title: "Secure & Private",
                desc: "Your financial data is encrypted and securely stored in the cloud.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-white text-black rounded-2xl shadow-lg hover:scale-105 transition"
              >
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-700">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12">What our users say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Ravi Sharma",
                feedback:
                  "Finora completely changed how I manage my money. The budget alerts saved me from overspending multiple times!",
              },
              {
                name: "Ananya Gupta",
                feedback:
                  "Beautiful design, simple to use, and powerful analytics. It's the finance app I always wanted.",
              },
              {
                name: "Arjun Mehta",
                feedback:
                  "I love the charts and insights. It feels like my personal financial advisor is always with me.",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                viewport={{ once: true }}
                className="p-6 bg-gray-50 rounded-2xl shadow"
              >
                <p className="italic text-gray-800 mb-4">"{t.feedback}"</p>
                <h4 className="font-semibold text-black">- {t.name}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gray-100 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto px-6"
        >
          <h2 className="text-4xl font-bold mb-6">
            Ready to simplify your <span className="underline">financial life</span>?
          </h2>
          <p className="text-gray-600 mb-8">
            Join thousands of users who trust Finora for their daily money management.
          </p>
          <Button className="bg-black text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-800"
            onClick={() => router.push("/register")}
          >
            Start Free Trial
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
