import React from "react";
import Table from "@/components/ui/Table";

export default function ProgressPage() {
  const submissions = [
    {
      id: 1,
      studentCode: "SE150001",
      studentName: "Nguyen Van A",
      status: "Done",
      message: "All tests passed",
      updatedAt: "09/03 10:21",
    },
    {
      id: 2,
      studentCode: "SE150002",
      studentName: "Tran Thi B",
      status: "Running",
      message: "Executing Q3...",
      updatedAt: "09/03 10:22",
    },
    {
      id: 3,
      studentCode: "SE150003",
      studentName: "Le Van C",
      status: "Auto-0",
      message: "Hardcode connection string",
      updatedAt: "09/03 10:19",
    },
    {
      id: 4,
      studentCode: "SE150004",
      studentName: "Pham Thi D",
      status: "Build error",
      message: "Cannot restore SU25PantherDB",
      updatedAt: "09/03 10:15",
    },
  ];

  const statusBadge = (status) => {
    const base = "px-2 py-1 rounded text-xs";
    switch (status) {
      case "Done":
        return `${base} bg-emerald-100 text-emerald-700`;
      case "Auto-0":
        return `${base} bg-red-100 text-red-700`;
      case "Build error":
        return `${base} bg-amber-100 text-amber-700`;
      case "Running":
        return `${base} bg-indigo-100 text-indigo-700`;
      default:
        return `${base} bg-gray-100 text-gray-700`;
    }
  };

  const columns = [
    { key: "studentCode", label: "Mã SV" },
    { key: "studentName", label: "Tên SV" },
    {
      key: "status",
      label: "Trạng thái",
      render: (r) => <span className={statusBadge(r.status)}>{r.status}</span>,
    },
    { key: "message", label: "Thông tin" },
    { key: "updatedAt", label: "Cập nhật" },
    {
      key: "actions",
      label: "Hành động",
      render: () => (
        <button className="text-sm text-indigo-600 hover:underline">
          Xem log chi tiết
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-6 lg:ml-64">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Tiến độ chấm
            </h1>
            <p className="text-gray-500 mt-1">
              Theo dõi trạng thái chấm bài theo từng sinh viên (real-time với
              SignalR sau này).
            </p>
          </div>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm">
            Refresh
          </button>
        </header>

        <Table columns={columns} data={submissions} initialPageSize={10} />
      </div>
    </div>
  );
}
