import { Sidebar } from "./components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-gray-50 p-6 overflow-x-hidden md:ml-64">
        {children}
      </main>
    </div>
  );
}
