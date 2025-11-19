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
      map[e.Examid] = {
        name: e.Examname,
      };
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
     APPROVE / REJECT
  ====================================================== */
  const approveGrade = async (id) => {
    const res = await fetch(`${API_URL}/api/grades/${id}/approve`, {
      method: "POST",
    });
    res.ok ? alert("Đã duyệt!") : alert("Approve thất bại");
  };

  const rejectGrade = async (id) => {
    const res = await fetch(`${API_URL}/api/grades/${id}/reject`, {
      method: "POST",
    });
    res.ok ? alert("Đã từ chối!") : alert("Reject thất bại");
  };
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
    } catch (err) {
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
     SIGNALR REALTIME UPDATE
  ====================================================== */
  useEffect(() => {
    if (connectionRef.current) return; // tránh double mount

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_URL}/gradingHub`)
      .withAutomaticReconnect()
      .withServerTimeout(60000)
      .withKeepAliveInterval(15000)
      .build();

    connectionRef.current = connection;

    connection
      .start()
      .then(() => console.log("SignalR connected"))
      .catch((err) => console.error("SignalR start error:", err));

    return () => {
      if (connectionRef.current?.state === "Connected") {
        connectionRef.current.stop();
      }
    };
  }, []);

  /* Subscribe khi grades đã load */
  useEffect(() => {
    if (!connectionRef.current) return;
    if (connectionRef.current.state !== "Connected") return;

    grades.forEach((g) => {
      if (g.submissionId)
        connectionRef.current.invoke("SubscribeToSubmission", g.submissionId);
    });
  }, [grades]);

  /* ======================================================
     FILTER
  ====================================================== */
  const filtered = grades.filter((g) => (g.submissionId + "").includes(search));

  /* ======================================================
     TABLE COLUMNS
  ====================================================== */
  const columns = [
    { key: "studentRoll", label: "MSSV" },
    { key: "studentName", label: "Họ tên" },
    { key: "examName", label: "Bài thi" },

    { key: "status", label: "Trạng thái" },

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
    <div className="min-h-screen p-6">
      <div className="w-full mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-bold">Danh sách điểm</h1>
          <p className="text-gray-500 mt-1">
            Dữ liệu realtime từ SignalR + OData.
          </p>
        </header>

        {error && <p className="text-red-600">{error}</p>}

        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="overflow-x-auto">
              <div className="min-w-max">
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

      {/* DETAILS DIALOG */}
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
      <p></p>
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
        {" "}
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
