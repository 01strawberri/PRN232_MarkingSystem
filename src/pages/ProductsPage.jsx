import React from "react";
import Table from "@/components/ui/Table";
import { exams } from "@/lib/mockData";

export default function ProductsPage() {
  const columns = [
    { key: "id", label: "Mã" },
    { key: "title", label: "Tiêu đề" },
    { key: "date", label: "Ngày" },
    { key: "status", label: "Trạng thái" },
    {
      key: "actions",
      label: "Hành động",
      render: (r) => (
        <div className="text-sm text-gray-600">
          <button className="text-indigo-600 hover:underline mr-3">Xem</button>
          <button className="text-amber-600 hover:underline">Chỉnh sửa</button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:ml-64">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Kỳ thi / Bài kiểm tra
          </h1>
          <p className="text-gray-500 mt-1">
            Danh sách các kỳ thi, bài kiểm tra và lịch thi.
          </p>
        </header>

        <Table columns={columns} data={exams} initialPageSize={6} />
      </div>
    </div>
  );
}
