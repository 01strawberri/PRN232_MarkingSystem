import React, { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  const [loading, setLoading] = useState(true);
  const [nextLink, setNextLink] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [viewGrade, setViewGrade] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadedRef = useRef(false);
  const connectionRef = useRef(null);

  /* LOAD USER MAP */
  const fetchUsers = async () => {
    const res = await fetch(`${API_URL}/odata/users`);
    const data = await res.json();
    const map = {};
    data.value.forEach((u) => (map[u.Userid] = u.Username));
    setUsers(map);
    return map;
  };

  /* LOAD GRADES */
  const fetchGrades = async (
    url = `${API_URL}/odata/grades`,
    userMapOverride
  ) => {
    try {
      setLoading(true);
      const res = await fetch(url);
      const data = await res.json();

      const userMap = userMapOverride || users;

      const formatted = data.value.map((g) => ({
        id: g.Gradeid,
        submissionId: g.Submissionid,
        q1: g.Q1,
        q2: g.Q2,
        q3: g.Q3,
        q4: g.Q4,
        q5: g.Q5,
        q6: g.Q6,

        total: g.Totalscore,
        status: g.Status || "N/A",

        createdAt: g.Createat
          ? new Date(g.Createat).toLocaleString("vi-VN")
          : "—",

        updatedAt: g.Updateat
          ? new Date(g.Updateat).toLocaleString("vi-VN")
          : "—",

        markerId: g.Marker,
        marker: userMap[g.Marker] || "-",
      }));

      setGrades((prev) => [...prev, ...formatted]);
      setNextLink(data["@odata.nextLink"] || null);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách điểm.");
    } finally {
      setLoading(false);
    }
  };

  /* FETCH DETAILS */
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
    } catch (err) {
      console.error(err);
      setError("Không thể tải chi tiết điểm.");
    } finally {
      setDetailLoading(false);
    }
  };

  /* INITIAL LOAD */
  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    const load = async () => {
      const userMap = await fetchUsers();
      await fetchGrades(`${API_URL}/odata/grades`, userMap);
    };

    load();
  }, []);

  /* SIGNALR */
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_URL}/gradingHub`)
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    connection
      .start()
      .then(() => {
        console.log("[SignalR] Connected");

        grades.forEach((g) => {
          if (g.submissionId)
            connection.invoke("SubscribeToSubmission", g.submissionId);
        });
      })
      .catch((err) => console.error("[SignalR] error:", err));

    connection.on("ReceiveGradingResult", (grade) => {
      setGrades((prev) =>
        prev.map((g) =>
          g.id === grade.Gradeid
            ? {
                ...g,
                q1: grade.Q1,
                q2: grade.Q2,
                q3: grade.Q3,
                q4: grade.Q4,
                q5: grade.Q5,
                q6: grade.Q6,
                total: grade.Totalscore,
                status: grade.Status,
                updatedAt: grade.Updateat
                  ? new Date(grade.Updateat).toLocaleString("vi-VN")
                  : "—",
              }
            : g
        )
      );
    });

    return () => connection.stop();
  }, [grades]);

  /* FILTER */
  const filtered = grades.filter((g) =>
    ((g.submissionId ?? "") + "").includes(search)
  );

  /* TABLE COLUMNS */
  const columns = [
    { key: "submissionId", label: "Submission ID" },
    { key: "status", label: "Trạng thái" },

    { key: "q1", label: "Q1" },
    { key: "q2", label: "Q2" },
    { key: "q3", label: "Q3" },
    { key: "q4", label: "Q4" },
    { key: "q5", label: "Q5" },
    { key: "q6", label: "Q6" },

    { key: "total", label: "Tổng điểm" },
    { key: "marker", label: "Người chấm" },
    { key: "createdAt", label: "Ngày chấm" },
    { key: "updatedAt", label: "Cập nhật" },

    {
      key: "actions",
      label: "Hành động",
      render: (row) => (
        <Button
          variant="link"
          className="p-0 text-indigo-600"
          onClick={() => fetchDetails(row)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  /* UI */
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Danh sách điểm</h1>
          <p className="text-gray-500 mt-1">
            Realtime từ SignalR + dữ liệu OData.
          </p>
        </header>

        <Card>
          <CardContent>
            {loading && <p className="text-gray-600">Đang tải...</p>}
            {error && <p className="text-red-600">{error}</p>}

            {!loading && (
              <Table columns={columns} data={filtered} initialPageSize={10} />
            )}

            {nextLink && (
              <div className="mt-4 flex justify-center">
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

      {/* DETAIL DIALOG */}
      {viewGrade && (
        <Dialog open={viewGrade} onOpenChange={() => setViewGrade(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                Chi tiết Submission #{viewGrade.submissionId}
              </DialogTitle>
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

/* ------------------ DETAIL CONTENT ------------------ */
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
      <p>
        <b>Ngày chấm:</b> {viewGrade.createdAt}
      </p>
      <p>
        <b>Cập nhật:</b> {viewGrade.updatedAt}
      </p>

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
  );
}
