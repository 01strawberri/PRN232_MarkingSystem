import React from "react";

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:ml-64">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Báo cáo</h1>
          <p className="text-gray-500 mt-1">
            Báo cáo tổng hợp điểm, thống kê và xuất file.
          </p>
        </header>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-gray-600">
            Tùy chọn xuất báo cáo theo lớp, kỳ thi hoặc học sinh.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Export CSV / PDF (placeholder).
          </div>
        </div>
      </div>
    </div>
  );
}
