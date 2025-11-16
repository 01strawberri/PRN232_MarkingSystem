import React from "react";
import Table from "@/components/ui/Table";
import { students } from "@/lib/mockData";

export default function StudentsPage() {
  const columns = [
    { key: "id", label: "Mã" },
    { key: "name", label: "Tên" },
    { key: "class", label: "Lớp" },
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
    <div className="min-h-screen p-6 lg:ml-64">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Học sinh</h1>
          <p className="text-gray-500 mt-1">
            Quản lý hồ sơ học sinh, lớp, và điểm.
          </p>
        </header>

        <Table columns={columns} data={students} initialPageSize={8} />
      </div>
    </div>
  );
}
