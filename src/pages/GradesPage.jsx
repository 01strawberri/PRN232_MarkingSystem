import React from "react";
import Table from "@/components/ui/Table";

export default function GradesPage() {
  const results = [
    {
      id: 1,
      studentCode: "SE150001",
      studentName: "Nguyen Van A",
      exam: "PE_PRN222_SU25",
      round: "Round 1",
      q1: 1.5,
      q2: 1.5,
      q3: 1.5,
      q4: 2,
      q5: 2,
      q6: 1.5,
      total: 10,
      autoZeroReason: "",
    },
    {
      id: 2,
      studentCode: "SE150002",
      studentName: "Tran Thi B",
      exam: "PE_PRN222_SU25",
      round: "Round 1",
      q1: 1,
      q2: 0,
      q3: 1,
      q4: 1.5,
      q5: 2,
      q6: 1,
      total: 6.5,
      autoZeroReason: "",
    },
    {
      id: 3,
      studentCode: "SE150003",
      studentName: "Le Van C",
      exam: "PE_PRN222_SU25",
      round: "Round 1",
      q1: 0,
      q2: 0,
      q3: 0,
      q4: 0,
      q5: 0,
      q6: 0,
      total: 0,
      autoZeroReason: "Hardcode connection string",
    },
  ];

  const columns = [
    { key: "studentCode", label: "Mã SV" },
    { key: "studentName", label: "Tên SV" },
    { key: "exam", label: "Kỳ thi" },
    { key: "round", label: "Exam round" },
    { key: "q1", label: "Q1" },
    { key: "q2", label: "Q2" },
    { key: "q3", label: "Q3" },
    { key: "q4", label: "Q4" },
    { key: "q5", label: "Q5" },
    { key: "q6", label: "Q6" },
    {
      key: "total",
      label: "Tổng",
      render: (r) => (
        <span className="font-semibold text-gray-900">{r.total}</span>
      ),
    },
    {
      key: "autoZeroReason",
      label: "Auto-0",
      render: (r) =>
        r.autoZeroReason ? (
          <span className="text-xs text-red-600">{r.autoZeroReason}</span>
        ) : (
          <span className="text-xs text-gray-400">N/A</span>
        ),
    },
    {
      key: "actions",
      label: "Hành động",
      render: () => (
        <button className="text-sm text-indigo-600 hover:underline">
          Xem chi tiết
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-6 lg:ml-64">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Kết quả</h1>
            <p className="text-gray-500 mt-1">
              Kết quả chấm bài (Q1–Q6) cho từng sinh viên trong một exam round.
            </p>
          </div>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm">
            Download Excel
          </button>
        </header>

        <Table columns={columns} data={results} initialPageSize={8} />
      </div>
    </div>
  );
}
