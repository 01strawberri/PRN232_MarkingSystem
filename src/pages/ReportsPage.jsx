import React from "react";

export default function ReportsPage() {
  return (
    <div className="min-h-screen p-6 lg:ml-64">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Báo cáo</h1>
          <p className="text-gray-500 mt-1">
            Xuất báo cáo tổng hợp điểm, thống kê theo kỳ thi / exam round.
          </p>
        </header>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <label className="block text-gray-600 mb-1">Kỳ thi</label>
              <select className="w-full border rounded px-3 py-2 text-gray-800">
                <option>PE_PRN222_SU25</option>
                <option>PE_PRN221_FA24</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Exam round</label>
              <select className="w-full border rounded px-3 py-2 text-gray-800">
                <option>Round 1</option>
                <option>Round 2</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Kiểu báo cáo</label>
              <select className="w-full border rounded px-3 py-2 text-gray-800">
                <option>Tổng hợp điểm (Excel)</option>
                <option>Thống kê phân bố điểm</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex space-x-3">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm">
              Export Excel
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm">
              Xem preview
            </button>
          </div>

          <p className="text-gray-400 text-xs mt-4">
            Lưu ý: file Excel sẽ sinh giống format StudentCode_ExamRound.xlsx để
            upload lên hệ thống trường.
          </p>
        </div>
      </div>
    </div>
  );
}
