import React from "react";
import Table from "@/components/ui/Table";

export default function ExamRoundsPage() {
  const rounds = [
    {
      id: 1,
      name: "Round 1 - 09/03",
      examCode: "PE_PRN222_SU25",
      totalSubmissions: 120,
      status: "Đã import",
      progress: "75%",
    },
    {
      id: 2,
      name: "Round 2 - 10/03",
      examCode: "PE_PRN222_SU25",
      totalSubmissions: 80,
      status: "Đang chấm",
      progress: "40%",
    },
  ];

  const columns = [
    { key: "name", label: "Tên exam round" },
    { key: "examCode", label: "Mã kỳ thi" },
    { key: "totalSubmissions", label: "Số bài nộp" },
    { key: "progress", label: "Tiến độ chấm" },
    { key: "status", label: "Trạng thái" },
    {
      key: "actions",
      label: "Hành động",
      render: (r) => (
        <div className="text-sm text-gray-600">
          <button className="text-indigo-600 hover:underline mr-3">
            Xem tiến độ chấm
          </button>
          <button className="text-indigo-600 hover:underline mr-3">
            Xem kết quả
          </button>
          <button className="text-amber-600 hover:underline">Cấu hình</button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-6 lg:ml-64">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Exam Rounds
            </h1>
            <p className="text-gray-500 mt-1">
              Quản lý các đợt nộp/chấm bài của một kỳ thi.
            </p>
          </div>
          <div className="space-x-3">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm">
              Upload submissions (.zip/.rar)
            </button>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm">
              Start grading
            </button>
          </div>
        </header>

        <Table columns={columns} data={rounds} initialPageSize={8} />
      </div>
    </div>
  );
}
