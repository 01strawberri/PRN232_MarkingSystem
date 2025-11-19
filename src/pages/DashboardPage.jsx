import React from "react";

export default function DashboardPage() {
  const stats = {
    totalExams: 5,
    totalRounds: 12,
    totalSubmissions: 320,
    autoZero: 18,
    buildErrors: 7,
    done: 240,
  };

  const recentRounds = [
    {
      id: 1,
      examCode: "PE_PRN222_SU25",
      roundName: "Round 1 - 09/03",
      totalSubmissions: 120,
      completed: 90,
      status: "Đang chấm",
    },
    {
      id: 2,
      examCode: "PE_PRN222_SU25",
      roundName: "Round 2 - 10/03",
      totalSubmissions: 80,
      completed: 80,
      status: "Hoàn thành",
    },
  ];

  return (
    <div className="min-h-screen p-6 ">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
        </header>

        {/* Cards tổng quan */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-500">Kỳ thi</h3>
              <p className="text-2xl font-bold mt-2">{stats.totalExams}</p>
              <p className="text-xs text-gray-400 mt-1">
                Số lượng kỳ thi được cấu hình.
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <span className="font-bold text-lg">E</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-500">Exam Rounds</h3>
              <p className="text-2xl font-bold mt-2">{stats.totalRounds}</p>
              <p className="text-xs text-gray-400 mt-1">
                Số đợt nộp/chấm được tạo.
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <span className="font-bold text-lg">R</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-500">Bài nộp</h3>
              <p className="text-2xl font-bold mt-2">
                {stats.totalSubmissions}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Tổng số bài nộp đã import vào hệ thống.
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <span className="font-bold text-lg">S</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-500">Auto-0</h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {stats.autoZero}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Bài nộp bị 0 điểm do vi phạm rule.
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-red-500 flex items-center justify-center text-white">
              <span className="font-bold text-lg">0</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-500">Build Error</h3>
              <p className="text-2xl font-bold mt-2 text-amber-600">
                {stats.buildErrors}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Bài nộp lỗi build / restore.
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-amber-500 flex items-center justify-center text-white">
              <span className="font-bold text-lg">!</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-500">Đã chấm xong</h3>
              <p className="text-2xl font-bold mt-2 text-emerald-600">
                {stats.done}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Bài nộp đã có điểm đầy đủ Q1–Q6.
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
              <span className="font-bold text-lg">✓</span>
            </div>
          </div>
        </section>

        {/* Exam rounds gần đây */}
        <section className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-gray-700 font-semibold mb-4">
              Exam rounds gần đây
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="py-2 pr-4">Kỳ thi</th>
                    <th className="py-2 pr-4">Round</th>
                    <th className="py-2 pr-4">Bài nộp</th>
                    <th className="py-2 pr-4">% hoàn thành</th>
                    <th className="py-2 pr-4">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRounds.map((r) => (
                    <tr key={r.id} className="border-b last:border-0">
                      <td className="py-2 pr-4 text-gray-800">{r.examCode}</td>
                      <td className="py-2 pr-4 text-gray-800">{r.roundName}</td>
                      <td className="py-2 pr-4 text-gray-600">
                        {r.completed}/{r.totalSubmissions}
                      </td>
                      <td className="py-2 pr-4 text-gray-600">
                        {Math.round((r.completed / r.totalSubmissions) * 100)}%
                      </td>
                      <td className="py-2 pr-4">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            r.status === "Hoàn thành"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-indigo-100 text-indigo-700"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-gray-700 font-semibold mb-4">Quick actions</h2>
            <div className="space-y-3 text-sm">
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg">
                Tạo kỳ thi mới
              </button>
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg">
                Tạo exam round mới
              </button>
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg">
                Xem tiến độ chấm
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
