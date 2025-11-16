import React from "react";
import Table from "@/components/ui/Table";

export default function StudentsPage() {
  const students = [
    { id: 1, studentCode: "SE150001", name: "Nguyen Van A", class: "SE1501" },
    { id: 2, studentCode: "SE150002", name: "Tran Thi B", class: "SE1501" },
    { id: 3, studentCode: "SE150003", name: "Le Van C", class: "SE1502" },
  ];

  const columns = [
    { key: "studentCode", label: "Mã SV" },
    { key: "name", label: "Tên" },
    { key: "class", label: "Lớp" },
    {
      key: "actions",
      label: "Hành động",
      render: () => (
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
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Học sinh</h1>
            <p className="text-gray-500 mt-1">
              Quản lý danh sách sinh viên tham gia kỳ thi.
            </p>
          </div>
          <div className="space-x-3">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm">
              Import từ Excel
            </button>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm">
              + Thêm sinh viên
            </button>
          </div>
        </header>

        <Table columns={columns} data={students} initialPageSize={8} />
      </div>
    </div>
  );
}
