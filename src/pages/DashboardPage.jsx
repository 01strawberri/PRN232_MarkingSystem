import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import API_URL from "@/config/api";
import { useNavigate } from "react-router-dom";
import { Calendar, FileText, Inbox } from "lucide-react";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [semCount, setSemCount] = useState(0);
  const [examCount, setExamCount] = useState(0);
  const [submCount, setSubmCount] = useState(0);
  const [recentExams, setRecentExams] = useState([]);

  const navigate = useNavigate();

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [semRes, examRes, subRes] = await Promise.all([
        fetch(`${API_URL}/odata/semesters`),
        fetch(`${API_URL}/odata/exams`),
        fetch(`${API_URL}/odata/submissions`),
      ]);
      const StatCard = ({ title, value, subtitle, Icon, bg, color }) => (
        <Card className="shadow-sm hover:shadow-md transition rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className={`text-3xl font-semibold mt-2 ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            </div>

            <div
              className={`h-12 w-12 rounded-xl flex items-center justify-center ${bg}`}
            >
              <Icon className={`h-6 w-6 ${color}`} />
            </div>
          </CardContent>
        </Card>
      );

      const semData = await semRes.json();
      const examData = await examRes.json();
      const subData = await subRes.json();

      setSemCount(semData.value.length);
      setExamCount(examData.value.length);
      setSubmCount(subData.value.length);

      // sort kỳ thi gần đây theo ngày tạo
      const examsSorted = examData.value
        .sort(
          (a, b) =>
            new Date(b.Createdat || b.Createat) -
            new Date(a.Createdat || a.Createat)
        )
        .slice(0, 5);

      setRecentExams(examsSorted);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const StatCard = ({ title, value, subtitle, Icon, bg, color }) => (
    <Card className="shadow-sm hover:shadow-md transition rounded-2xl">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className={`text-3xl font-semibold mt-2 ${color}`}>{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        </div>

        <div
          className={`h-12 w-12 rounded-xl flex items-center justify-center ${bg}`}
        >
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 tracking-tight">Dashboard</h1>

        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="Học kỳ"
                value={semCount}
                subtitle="Tổng số học kỳ."
                Icon={Calendar}
                bg="bg-purple-100"
                color="text-purple-700"
              />

              <StatCard
                title="Kỳ thi"
                value={examCount}
                subtitle="Số lượng kỳ thi đã tạo."
                Icon={FileText}
                bg="bg-blue-100"
                color="text-blue-700"
              />

              <StatCard
                title="Bài nộp"
                value={submCount}
                subtitle="Tổng số bài nộp trong hệ thống."
                Icon={Inbox}
                bg="bg-green-100"
                color="text-green-700"
              />
            </div>

            {/* Recent Exams */}
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 shadow-sm rounded-2xl">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Kỳ thi gần đây</h2>

                  <div className="overflow-x-auto rounded-lg border bg-white">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-50 text-gray-600">
                        <tr>
                          <th className="py-3 px-4 text-left">Mã kỳ thi</th>
                          <th className="py-3 px-4 text-left">Ngày thi</th>
                          <th className="py-3 px-4 text-left">Ngày tạo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentExams.map((e) => (
                          <tr
                            key={e.Examid}
                            className="border-t hover:bg-gray-50"
                          >
                            <td className="py-3 px-4 font-medium">
                              {e.Examname}
                            </td>
                            <td className="py-3 px-4">
                              {new Date(e.Examdate).toLocaleDateString("vi-VN")}
                            </td>
                            <td className="py-3 px-4">
                              {new Date(
                                e.Createdat || e.Createat
                              ).toLocaleDateString("vi-VN")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Quick actions */}
              <Card className="shadow-sm rounded-2xl">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-lg font-semibold">Quick actions</h2>

                  <Button
                    className="w-full"
                    variant="secondary"
                    onClick={() => navigate("/exams")}
                  >
                    Tạo kỳ thi mới
                  </Button>

                  <Button
                    className="w-full"
                    variant="secondary"
                    onClick={() => navigate("/grades")}
                  >
                    Xem kết quả bài thi
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
