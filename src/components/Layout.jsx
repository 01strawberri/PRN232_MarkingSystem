import React from "react";
import Sidebar from "@/components/sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-gray-800">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-6 lg:p-10 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
