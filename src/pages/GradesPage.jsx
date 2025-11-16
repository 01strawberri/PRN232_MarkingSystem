import React from "react";
import Table from "@/components/ui/Table";
import { grades } from "@/lib/mockData";

export default function GradesPage() {
  const columns = [
    { key: "id", label: "#" },
    { key: "studentId", label: "Mã học sinh" },
    { key: "studentName", label: "Tên" },
    { key: "exam", label: "Kỳ thi" },
    { key: "score", label: "Điểm" },
    {
      key: "status",
      label: "Trạng thái",
      render: (r) => {
        const cls =
          r.status === "Approved"
            ? "bg-indigo-100 text-indigo-700"
            : r.status === "Pending"
            ? "bg-indigo-50 text-indigo-700"
            : "bg-gray-100 text-gray-700";
        return (
          <span className={`px-2 py-1 rounded text-xs ${cls}`}>{r.status}</span>
        );
      },
    },
    {
      key: "actions",
      label: "Hành động",
      render: (r) => (
        <div className="text-sm text-gray-600">
          {r.status !== "Approved" && (
            <button className="text-indigo-600 hover:underline mr-3">
              Phê duyệt
            </button>
          )}
          <button className="text-indigo-600 hover:underline">Chỉnh sửa</button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-6 lg:ml-64">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Điểm số</h1>
          <p className="text-gray-500 mt-1">
            Xem, chỉnh sửa và phê duyệt điểm của học sinh.
          </p>
        </header>

        <Table columns={columns} data={grades} initialPageSize={8} />
      </div>
    </div>
  );
}
