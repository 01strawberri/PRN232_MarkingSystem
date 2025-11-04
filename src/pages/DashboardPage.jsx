import React from "react";
import Sidebar from "@/components/sidebar";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-slate-50 text-gray-800">
      {/* Sidebar cố định bên trái */}
      <Sidebar />

      {/* Nội dung chính */}
      <main className="flex-1 lg:ml-64 p-6 lg:p-10 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <header className="mb-6">
            <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Xin chào — đây là trang tổng quan của bạn.
            </p>
          </header>

          {/* Cards tổng quan */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-between">
              <div>
                <h3 className="text-sm text-gray-500">Total Marks</h3>
                <p className="text-2xl font-bold mt-2">9,842</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7h18M3 12h18M3 17h18"
                  />
                </svg>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-between">
              <div>
                <h3 className="text-sm text-gray-500">Exams Today</h3>
                <p className="text-2xl font-bold mt-2">12</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6"
                  />
                </svg>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-between">
              <div>
                <h3 className="text-sm text-gray-500">Active Students</h3>
                <p className="text-2xl font-bold mt-2">1,042</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-yellow-500 flex items-center justify-center text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </section>

          {/* Biểu đồ / thống kê khác */}
          <section className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-gray-700 font-semibold mb-4">
                Recent Activity
              </h2>
              <ul className="space-y-3 text-gray-600 text-sm">
                <li>
                  ✅ Student{" "}
                  <span className="font-medium text-gray-900">Nguyen A</span>{" "}
                  submitted exam —{" "}
                  <span className="text-gray-500">2 hours ago</span>
                </li>
                <li>
                  ✅ Grades updated for{" "}
                  <span className="font-medium text-gray-900">Class 10A</span> —{" "}
                  <span className="text-gray-500">yesterday</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-gray-700 font-semibold mb-4">Quick Stats</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Total Students</span>
                  <span className="font-medium">3,420</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Pending Reviews</span>
                  <span className="font-medium">14</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
