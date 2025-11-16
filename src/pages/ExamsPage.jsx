import React from "react";
import Table from "@/components/ui/Table";

export default function ProductsPage() {
  const exams = [
    {
      id: 1,
      code: "PE_PRN222_SU25",
      title: "PE PRN222 – Summer 2025",
      semester: "SU25",
      rounds: 3,
      status: "Đang hoạt động",
    },
    {
      id: 2,
      code: "PE_PRN221_FA24",
      title: "PE PRN221 – Fall 2024",
      semester: "FA24",
      rounds: 2,
      status: "Đã kết thúc",
    },
  ];

  const columns = [
    { key: "code", label: "Mã kỳ thi" },
    { key: "title", label: "Tên kỳ thi" },
    { key: "semester", label: "Học kỳ" },
    { key: "rounds", label: "Số exam round" },
    { key: "status", label: "Trạng thái" },
    {
      key: "actions",
      label: "Hành động",
      render: (r) => (
        <div className="text-sm text-gray-600">
          <button className="text-indigo-600 hover:underline mr-3">
            Xem exam rounds
          </button>
          <button className="text-amber-600 hover:underline">Chỉnh sửa</button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-6 lg:ml-64">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Kỳ thi</h1>
            <p className="text-gray-500 mt-1">
              Quản lý các kỳ thi / môn học dùng cho hệ thống chấm bài tự động.
            </p>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm">
            + Tạo kỳ thi mới
          </button>
        </header>

        <Table columns={columns} data={exams} initialPageSize={6} />
      </div>
    </div>
  );
}
