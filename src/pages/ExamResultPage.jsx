import React from "react";

export default function ExamResultPage() {
  const result = {
    studentCode: "SE150001",
    studentName: "Nguyen Van A",
    exam: "PE_PRN222_SU25",
    round: "Round 1",
    scores: [
      { question: "Q1", score: 1.5, max: 1.5 },
      { question: "Q2", score: 1.5, max: 1.5 },
      { question: "Q3", score: 1.5, max: 1.5 },
      { question: "Q4", score: 2, max: 2 },
      { question: "Q5", score: 2, max: 2 },
      { question: "Q6", score: 1.5, max: 1.5 },
    ],
    total: 10,
    autoZeroReason: "",
    logs: [
      "[INFO] Extracting submission...",
      "[INFO] Restoring SU25PantherDB...",
      "[INFO] Running tests Q1-Q6...",
      "[PASS] Q1: Search Panther by Type",
      "[PASS] Q2: Create Panther profile",
    ],
  };

  return (
    <div className="min-h-screen p-6 lg:ml-64">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Chi tiet ket qua
            </h1>
            <p className="text-gray-500 mt-1">
              {result.exam} - {result.round}
            </p>
          </div>

          <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm">
            Download log
          </button>
        </header>

        {/* Student info */}
        <section className="bg-white p-6 rounded-xl shadow-md mb-6">
          <h2 className="text-gray-800 font-semibold mb-4">
            Thong tin sinh vien
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <div className="text-gray-500">Ma sinh vien</div>
              <div className="font-medium">{result.studentCode}</div>
            </div>

            <div>
              <div className="text-gray-500">Ho ten</div>
              <div className="font-medium">{result.studentName}</div>
            </div>

            <div>
              <div className="text-gray-500">Tong diem</div>
              <div className="font-semibold text-lg text-emerald-600">
                {result.total}/10
              </div>
            </div>

            <div>
              <div className="text-gray-500">Auto-0</div>
              <div className="text-sm">
                {result.autoZeroReason ? (
                  <span className="text-red-600">{result.autoZeroReason}</span>
                ) : (
                  <span className="text-gray-400">Khong</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Scores */}
        <section className="bg-white p-6 rounded-xl shadow-md mb-6">
          <h2 className="text-gray-800 font-semibold mb-4">
            Diem chi tiet (Q1-Q6)
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="py-2 pr-4">Cau hoi</th>
                  <th className="py-2 pr-4">Diem</th>
                  <th className="py-2 pr-4">Diem toi da</th>
                </tr>
              </thead>

              <tbody>
                {result.scores.map((s) => (
                  <tr key={s.question} className="border-b last:border-0">
                    <td className="py-2 pr-4 text-gray-800">{s.question}</td>
                    <td className="py-2 pr-4 text-gray-800">{s.score}</td>
                    <td className="py-2 pr-4 text-gray-600">{s.max}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Execution log */}
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-gray-800 font-semibold mb-4">Execution log</h2>

          <div className="bg-gray-900 text-gray-100 text-xs rounded-lg p-4 font-mono space-y-1 max-h-64 overflow-auto">
            {result.logs.map((line, idx) => (
              <div key={idx}>{line}</div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
