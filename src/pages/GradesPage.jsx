import React, { useEffect, useState, useRef } from "react";
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

  /* ===================== USERS ===================== */
  const fetchUsers = async () => {
    const res = await fetch(`${API_URL}/odata/users`);
    const data = await res.json();

    const map = {};
    data.value.forEach((u) => {
      map[u.Userid] = u.Username;
    });

    setUsers(map);
    return map;
  };

  /* ===================== GRADES LIST ===================== */
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

  /* ===================== DETAILS ===================== */
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

      setViewGrade({
        ...grade,
        details: map,
      });
    } catch (err) {
      console.error(err);
      setError("Không thể tải chi tiết điểm.");
    } finally {
      setDetailLoading(false);
    }
  };

  /* ===================== LOAD ONCE ===================== */
  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    const load = async () => {
      const userMap = await fetchUsers();
      await fetchGrades(`${API_URL}/odata/grades`, userMap);
    };

    load();
  }, []);

  /* ===================== FIX FILTER ===================== */
  const filtered = grades.filter((g) =>
    ((g.submissionId ?? "") + "").includes(search)
  );

  /* ===================== COLUMNS ===================== */
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
        <button
          onClick={() => fetchDetails(row)}
          className="text-indigo-600 hover:underline text-sm"
        >
          Chi tiết
        </button>
      ),
    },
  ];

  /* ===================== UI ===================== */
  return (
    <div className="min-h-screen p-6 lg:ml-64">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Danh sách điểm
          </h1>
          <p className="text-gray-500 mt-1">Dữ liệu từ API odata/grades.</p>
        </header>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Tìm theo Submission ID..."
            className="px-3 py-2 border rounded-lg text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading && <p className="text-gray-600">Đang tải...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && (
          <Table columns={columns} data={filtered} initialPageSize={10} />
        )}

        {nextLink && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => fetchGrades(nextLink)}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Tải thêm
            </button>
          </div>
        )}
      </div>

      {/* ---------- DETAILS MODAL ---------- */}
      {viewGrade && (
        <Modal
          title={`Chi tiết Submission #${viewGrade.submissionId}`}
          onClose={() => setViewGrade(null)}
        >
          {detailLoading ? (
            <p className="text-gray-600">Đang tải...</p>
          ) : (
            <div className="text-sm space-y-4">
              <p>
                <b>Người chấm:</b> {viewGrade.marker}
              </p>
              <p>
                <b>Tổng điểm:</b>{" "}
                <span className="text-emerald-600">{viewGrade.total}</span>
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

              <table className="min-w-full text-sm mt-3">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="py-2 pr-4">Câu</th>
                    <th className="py-2 pr-4">Điểm</th>
                    <th className="py-2 pr-4">Chi tiết test</th>
                  </tr>
                </thead>

                <tbody>
                  {["Q1", "Q2", "Q3", "Q4", "Q5", "Q6"].map((q) => (
                    <tr key={q} className="border-b align-top">
                      <td className="py-2 pr-4 font-semibold">{q}</td>
                      <td className="py-2 pr-4">
                        {viewGrade[q.toLowerCase()]}
                      </td>
                      <td className="py-2 pr-4">
                        {viewGrade.details[q] ? (
                          <ul className="list-disc ml-5">
                            {viewGrade.details[q].map((d, i) => (
                              <li key={i}>
                                <b>{d.subcode}</b> — {d.point} điểm{" "}
                                {d.note && (
                                  <span className="text-gray-400">
                                    ({d.note})
                                  </span>
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
          )}
        </Modal>
      )}
    </div>
  );
}

/* MODAL */
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[650px] shadow-lg max-h-[90vh] overflow-auto">
        <h2 className="font-semibold text-lg mb-4">{title}</h2>

        {children}

        <div className="mt-5 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
