import React, { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import Table from "@/components/ui/Table";
import API_URL from "@/config/api";

export default function GradesPage() {
  const [grades, setGrades] = useState([]);
  const [users, setUsers] = useState({});
  const [submissions, setSubmissions] = useState({});
  const [students, setStudents] = useState({});
  const [exams, setExams] = useState({});

  const [loading, setLoading] = useState(true);
  const [nextLink, setNextLink] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [viewGrade, setViewGrade] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadedRef = useRef(false);
  const connectionRef = useRef(null);

  /* ======================================================
     LOAD USERS
  ====================================================== */
  const fetchUsers = async () => {
    const res = await fetch(`${API_URL}/odata/users`);
    const data = await res.json();

    const map = {};
    data.value.forEach((u) => (map[u.Userid] = u.Username));
    setUsers(map);
    return map;
  };

  const fetchExams = async () => {
    const res = await fetch(`${API_URL}/odata/exams`);
    const data = await res.json();

    const map = {};
    data.value.forEach((e) => {
      map[e.Examid] = { name: e.Examname };
    });

    setExams(map);
    return map;
  };

  const fetchStudents = async () => {
    const res = await fetch(`${API_URL}/odata/students`);
    const data = await res.json();

    const map = {};
    data.value.forEach((s) => {
      map[s.Studentid] = {
        fullname: s.Studentfullname,
        roll: s.Studentroll,
      };
    });

    setStudents(map);
    return map;
  };

  const fetchSubmissions = async () => {
    const res = await fetch(`${API_URL}/odata/submissions`);
    const data = await res.json();

    const map = {};
    data.value.forEach((s) => {
      map[s.Submissionid] = {
        studentId: s.Studentid,
        examId: s.Examid,
      };
    });

    setSubmissions(map);
    return map;
  };

  /* ======================================================
     LOAD GRADED DETAILS
  ====================================================== */
  const fetchDetails = async (grade) => {
    try {
      setDetailLoading(true);

      const res = await fetch(
        `${API_URL}/odata/gradedetails?$filter=Gradeid eq ${grade.id}`
      );
      const data = await res.json();

      const map = {};
      data.value.forEach((d) => {
        if (!map[d.Qcode]) map[d.Qcode] = [];
        map[d.Qcode].push({
          subcode: d.Subcode,
          point: d.Point,
          note: d.Note,
        });
      });

      setViewGrade({ ...grade, details: map });
    } finally {
      setDetailLoading(false);
    }
  };

  /* ======================================================
     APPROVE / REJECT — UPDATE STATUS
  ====================================================== */
  const updateGradeStatus = async (gradeId, newStatus) => {
    try {
      const res = await fetch(
        `${API_URL}/odata/grades?$filter=Gradeid eq ${gradeId}`
      );
      const data = await res.json();
      const g = data.value[0];

      if (!g) {
        alert("Không tìm thấy grade!");
        return;
      }

      const marker = Number(localStorage.getItem("userId")) || 0;

      const body = {
        submissionId: g.Submissionid,
        q1: g.Q1,
        q2: g.Q2,
        q3: g.Q3,
        q4: g.Q4,
        q5: g.Q5,
        q6: g.Q6,
        totalscore: g.Totalscore,
        status: newStatus,
        marker: marker,
      };

      const putRes = await fetch(`${API_URL}/api/Grade/${gradeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        body: JSON.stringify(body),
      });

      if (putRes.ok) {
        alert("Cập nhật trạng thái thành công!");
      } else {
        alert("Cập nhật thất bại!");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối!");
    }
  };

  const approveGrade = async (id) => {
    const role = localStorage.getItem("role");
    const newStatus = `${role} Approved`;
    await updateGradeStatus(id, newStatus);
  };

  const rejectGrade = async (id) => {
    const role = localStorage.getItem("role");
    const newStatus = `${role} Rejected`;
    await updateGradeStatus(id, newStatus);
  };

  /* ======================================================
      EXPORT EXCEL
  ====================================================== */
  const exportExcel = async () => {
    try {
      const res = await fetch(`${API_URL}/api/Grade/export-excel`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      });

      if (!res.ok) {
        alert("Xuất Excel thất bại!");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "Grades.xlsx";
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export Excel error:", err);
      alert("Không thể xuất Excel!");
    }
  };

  /* ======================================================
     FETCH GRADES
  ====================================================== */
  const fetchGrades = async (
    url = `${API_URL}/odata/grades`,
    userMap,
    submissionMap,
    studentMap,
    examMap
  ) => {
    try {
      setLoading(true);

      const res = await fetch(url);
      const data = await res.json();

      const formatted = data.value.map((g) => {
        const sub = submissionMap[g.Submissionid] || {};
        const stu = studentMap[sub.studentId] || {};
        const exam = examMap[sub.examId] || {};

        return {
          id: g.Gradeid,
          submissionId: g.Submissionid,
          studentRoll: stu.roll || "—",
          studentName: stu.fullname || "—",
          examName: exam.name || "—",
          q1: g.Q1,
          q2: g.Q2,
          q3: g.Q3,
          q4: g.Q4,
          q5: g.Q5,
          q6: g.Q6,
          total: g.Totalscore,
          status: g.Status || "N/A",
          createdAtText: g.Createat
            ? new Date(g.Createat).toLocaleString("vi-VN")
            : "—",
          marker: userMap[g.Marker] || "-",
        };
      });

      setGrades(formatted);
      setNextLink(data["@odata.nextLink"] || null);
    } catch {
      setError("Không thể tải danh sách điểm.");
    } finally {
      setLoading(false);
    }
  };

  /* ======================================================
     INITIAL LOAD
  ====================================================== */
  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    const load = async () => {
      const userMap = await fetchUsers();
      const [studentsMap, examsMap, submissionsMap] = await Promise.all([
        fetchStudents(),
        fetchExams(),
        fetchSubmissions(),
      ]);

      await fetchGrades(
        `${API_URL}/odata/grades`,
        userMap,
        submissionsMap,
        studentsMap,
        examsMap
      );
    };

    load();
  }, []);

  /* ======================================================
   SIGNALR REALTIME
====================================================== */
  useEffect(() => {
    if (connectionRef.current) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_URL}/gradingHub`)
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    connection
      .start()
      .then(() => {
        console.log("SignalR connected");

        // Lắng nghe backend gửi cập nhật
        connection.on("GradeUpdated", (updated) => {
          console.log("📡 Realtime update:", updated);

          setGrades((prev) =>
            prev.map((g) =>
              g.id === updated.gradeId
                ? {
                    ...g,
                    total: updated.totalscore,
                    status: updated.status,
                    marker: updated.markerName,
                    createdAtText: new Date(updated.createAt).toLocaleString(
                      "vi-VN"
                    ),
                  }
                : g
            )
          );
        });

        // 🔥 SUBSCRIBE NGAY SAU KHI CONNECT
        grades.forEach((g) => {
          if (g.submissionId)
            connection.invoke("SubscribeToSubmission", g.submissionId);
        });
      })
      .catch((err) => console.error("SignalR error:", err));

    // Khi reconnect
    connection.onreconnected(() => {
      console.log("🔄 Reconnected — resubscribing...");
      grades.forEach((g) => {
        if (g.submissionId)
          connection.invoke("SubscribeToSubmission", g.submissionId);
      });
    });

    return () => connection.stop();
  }, []);

  useEffect(() => {
    const conn = connectionRef.current;
    if (!conn) return;
    if (conn.state !== "Connected") return;

    grades.forEach((g) => {
      if (g.submissionId) conn.invoke("SubscribeToSubmission", g.submissionId);
    });
  }, [grades]);

  /* ======================================================
     SUBSCRIBE GROUPS WHEN GRADES CHANGED
  ====================================================== */
  useEffect(() => {
    if (!connectionRef.current) return;
    if (connectionRef.current.state !== "Connected") return;

    grades.forEach((g) => {
      if (g.submissionId)
        connectionRef.current.invoke("SubscribeToSubmission", g.submissionId);
    });
  }, [grades]);

  /* ======================================================
     ROLE FILTER
  ====================================================== */
  const role = localStorage.getItem("role") || "";

  const roleFiltered = grades.filter((g) => {
    switch (role) {
      case "Teacher":
        return ["Completed", "Moderator Rejected", "Admin Rejected"].includes(
          g.status
        );
      case "Moderator":
        return g.status === "Teacher Approved";
      default:
        return true;
    }
  });

  const filtered = roleFiltered.filter((g) =>
    (g.submissionId + "").includes(search)
  );

  /* ======================================================
     TABLE COLUMNS
  ====================================================== */
  const columns = [
    { key: "studentRoll", label: "MSSV" },
    { key: "studentName", label: "Họ tên", className: "min-w-[180px]" },
    { key: "examName", label: "Bài thi" },

    {
      key: "status",
      label: "Trạng thái",
      render: (row) => {
        const s = row.status || "";
        let color = "text-gray-600";

        if (s.toLowerCase() === "complete")
          color = "text-sky-600 font-semibold";
        if (s.includes("Approved")) color = "text-green-600 font-semibold";
        if (s.includes("Rejected")) color = "text-red-600 font-semibold";

        return <span className={color}>{s}</span>;
      },
    },

    { key: "q1", label: "Q1" },
    { key: "q2", label: "Q2" },
    { key: "q3", label: "Q3" },
    { key: "q4", label: "Q4" },
    { key: "q5", label: "Q5" },
    { key: "q6", label: "Q6" },

    { key: "total", label: "Tổng điểm" },
    { key: "marker", label: "Người chấm" },
    { key: "createdAtText", label: "Ngày chấm" },

    {
      key: "actions",
      label: "Hành động",
      render: (row) => (
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-8 px-3 text-sm text-indigo-600 border-indigo-200 hover:bg-indigo-50"
            onClick={() => fetchDetails(row)}
          >
            Chi tiết
          </Button>

          <Button
            className="h-8 px-4 text-sm bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => approveGrade(row.id)}
          >
            Approve
          </Button>

          <Button
            className="h-8 px-4 text-sm bg-red-600 hover:bg-red-700 text-white"
            onClick={() => rejectGrade(row.id)}
          >
            Reject
          </Button>
        </div>
      ),
    },
  ];

  /* ======================================================
     UI
  ====================================================== */
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="w-full mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-bold">Danh sách điểm</h1>
        </header>

        {error && <p className="text-red-600">{error}</p>}

        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="overflow-x-auto w-full">
              <div className="w-full">
                <div className="flex justify-end pr-4">
                  <Button
                    className="h-9 px-4 bg-black hover:bg-neutral-800 text-white mb-3"
                    onClick={exportExcel}
                  >
                    Xuất Excel
                  </Button>
                </div>

                {!loading && (
                  <Table
                    columns={columns}
                    data={filtered}
                    initialPageSize={10}
                  />
                )}
              </div>
            </div>

            {nextLink && (
              <div className="flex justify-center">
                <Button
                  variant="secondary"
                  onClick={() => fetchGrades(nextLink)}
                >
                  Tải thêm
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {viewGrade && (
        <Dialog open={viewGrade} onOpenChange={() => setViewGrade(null)}>
          <DialogContent className="max-w-[1300px] w-full">
            <DialogHeader>
              <DialogTitle>Chi tiết bài chấm</DialogTitle>
            </DialogHeader>

            {detailLoading ? (
              <p className="text-gray-600">Đang tải...</p>
            ) : (
              <GradeDetailContent viewGrade={viewGrade} />
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

/* ======================================================
   DETAIL CONTENT
====================================================== */
function GradeDetailContent({ viewGrade }) {
  return (
    <div className="text-sm space-y-4">
      <p>
        <b>Người chấm:</b> {viewGrade.marker}
      </p>
      <p>
        <b>Tổng điểm:</b>{" "}
        <span className="text-emerald-600 font-semibold">
          {viewGrade.total}
        </span>
      </p>
      <p>
        <b>Trạng thái:</b> {viewGrade.status}
      </p>

      <div className="max-h-96 overflow-y-auto">
        <table className="min-w-full text-sm mt-3 border rounded-lg overflow-hidden">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="py-2 px-3 text-left">Câu</th>
              <th className="py-2 px-3 text-left">Điểm</th>
              <th className="py-2 px-3 text-left">Chi tiết test</th>
            </tr>
          </thead>

          <tbody>
            {["Q1", "Q2", "Q3", "Q4", "Q5", "Q6"].map((q) => (
              <tr key={q} className="border-b align-top">
                <td className="py-2 px-3 font-semibold">{q}</td>
                <td className="py-2 px-3">{viewGrade[q.toLowerCase()]}</td>
                <td className="py-2 px-3">
                  {viewGrade.details?.[q] ? (
                    <ul className="list-disc ml-5 space-y-1">
                      {viewGrade.details[q].map((d, i) => (
                        <li key={i}>
                          <b>{d.subcode}</b> — {d.point} điểm{" "}
                          {d.note && (
                            <span className="text-gray-400">({d.note})</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
