import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

  const StatCard = ({ title, value, subtitle, icon, color }) => (
    <Card className="shadow-sm hover:shadow-md transition rounded-2xl">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className={`text-3xl font-semibold mt-2 ${color}`}>{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        </div>
        <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-white text-xl font-bold">
          {icon}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 tracking-tight">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Kỳ thi"
            value={stats.totalExams}
            subtitle="Số lượng kỳ thi được cấu hình."
            icon="E"
            color="text-indigo-600"
          />

          <StatCard
            title="Exam Rounds"
            value={stats.totalRounds}
            subtitle="Số đợt nộp/chấm được tạo."
            icon="R"
            color="text-indigo-600"
          />

          <StatCard
            title="Bài nộp"
            value={stats.totalSubmissions}
            subtitle="Tổng số bài nộp đã import vào hệ thống."
            icon="S"
            color="text-indigo-600"
          />

          <StatCard
            title="Auto-0"
            value={stats.autoZero}
            subtitle="Bài nộp bị 0 điểm do vi phạm rule."
            icon="0"
            color="text-red-600"
          />

          <StatCard
            title="Build Error"
            value={stats.buildErrors}
            subtitle="Bài nộp lỗi build / restore."
            icon="!"
            color="text-amber-600"
          />

          <StatCard
            title="Đã chấm xong"
            value={stats.done}
            subtitle="Bài nộp đã có điểm đầy đủ Q1–Q6."
            icon="✓"
            color="text-emerald-600"
          />
        </div>

        {/* Recent Rounds + Quick actions */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">
                Exam rounds gần đây
              </h2>

              <div className="overflow-x-auto rounded-lg border bg-white">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="py-3 px-4 text-left">Kỳ thi</th>
                      <th className="py-3 px-4 text-left">Round</th>
                      <th className="py-3 px-4 text-left">Bài nộp</th>
                      <th className="py-3 px-4 text-left">% hoàn thành</th>
                      <th className="py-3 px-4 text-left">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRounds.map((r) => (
                      <tr
                        key={r.id}
                        className="border-t hover:bg-gray-50 transition"
                      >
                        <td className="py-3 px-4 font-medium text-gray-800">
                          {r.examCode}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {r.roundName}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {r.completed}/{r.totalSubmissions}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {Math.round((r.completed / r.totalSubmissions) * 100)}
                          %
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
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
            </CardContent>
          </Card>

          <Card className="shadow-sm rounded-2xl">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Quick actions</h2>

              <Button className="w-full" variant="secondary">
                Tạo kỳ thi mới
              </Button>

              <Button className="w-full" variant="secondary">
                Tạo exam round mới
              </Button>

              <Button className="w-full" variant="secondary">
                Xem tiến độ chấm
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
