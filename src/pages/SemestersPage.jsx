import React, { useEffect, useState, useRef } from "react";
import Table from "@/components/ui/Table";
import API_URL from "@/config/api";
import { useNavigate } from "react-router-dom";

export default function SemestersPage() {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadedRef = useRef(false);

  const [editSemester, setEditSemester] = useState(null);
  const [createModal, setCreateModal] = useState(false);

  const navigate = useNavigate();

  // Fetch semesters
  const fetchSemesters = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/odata/semesters`);
      const data = await res.json();

      const formatted = data.value.map((s) => ({
        id: s.Semesterid,
        code: s.Semestercode,
        start: new Date(s.Startdate).toLocaleDateString("vi-VN"),
        end: new Date(s.Enddate).toLocaleDateString("vi-VN"),
        active: s.Isactive,
        createdAt: new Date(s.Createat).toLocaleDateString("vi-VN"),
      }));

      setSemesters(formatted);
    } catch (err) {
      setError("Không thể tải danh sách học kỳ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    fetchSemesters();
  }, []);

  // Columns for Table
  const columns = [
    { key: "code", label: "Mã học kỳ" },
    { key: "start", label: "Ngày bắt đầu" },
    { key: "end", label: "Ngày kết thúc" },
    {
      key: "active",
      label: "Trạng thái",
      render: (r) =>
        r.active ? (
          <span className="text-emerald-600 font-semibold">Đang hoạt động</span>
        ) : (
          <span className="text-gray-500">Không hoạt động</span>
        ),
    },
    { key: "createdAt", label: "Ngày tạo" },
    {
      key: "actions",
      label: "Hành động",
      render: (row) => (
        <button
          className="text-amber-600 hover:underline"
          onClick={(e) => {
            e.stopPropagation(); // tránh click row redirect
            setEditSemester(row);
          }}
        >
          Chỉnh sửa
        </button>
      ),
    },
  ];

  // Click row -> chuyển sang ExamsPage
  const handleRowClick = (row) => {
    navigate(`/exams?semester=${row.id}`);
  };

  return (
    <div className="min-h-screen p-6 lg:ml-64">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Học kỳ</h1>
            <p className="text-gray-500 mt-1">
              Chọn học kỳ để xem danh sách kỳ thi.
            </p>
          </div>

          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm"
            onClick={() => setCreateModal(true)}
          >
            + Tạo học kỳ mới
          </button>
        </header>

        {loading && <div className="text-gray-600">Đang tải...</div>}
        {error && <div className="text-red-600">{error}</div>}

        {!loading && (
          <Table
            columns={columns}
            data={semesters}
            initialPageSize={8}
            onRowClick={handleRowClick}
            rowClassName="cursor-pointer hover:bg-gray-50"
          />
        )}
      </div>

      {/* EDIT MODAL */}
      {editSemester && (
        <Modal title="Chỉnh sửa học kỳ" onClose={() => setEditSemester(null)}>
          <SemesterEditForm semester={editSemester} />
        </Modal>
      )}

      {/* CREATE MODAL */}
      {createModal && (
        <Modal title="Tạo học kỳ mới" onClose={() => setCreateModal(false)}>
          <SemesterCreateForm />
        </Modal>
      )}
    </div>
  );
}

/* ---------------------------
   MODAL COMPONENT
---------------------------- */
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white rounded-xl w-96 p-6 shadow-lg">
        <h2 className="font-semibold text-lg mb-3">{title}</h2>
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

/* ---------------------------
   EDIT FORM
---------------------------- */
function SemesterEditForm({ semester }) {
  const [code, setCode] = useState(semester.code);
  const [start, setStart] = useState(semester.start);
  const [end, setEnd] = useState(semester.end);

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm">Mã học kỳ:</label>
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm">Ngày bắt đầu:</label>
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm">Ngày kết thúc:</label>
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />
      </div>

      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">
        Lưu thay đổi
      </button>
    </div>
  );
}

/* ---------------------------
   CREATE FORM
---------------------------- */
function SemesterCreateForm() {
  const [code, setCode] = useState("");

  return (
    <div className="space-y-3">
      <label className="text-sm">Mã học kỳ:</label>
      <input
        className="w-full border rounded-lg px-3 py-2 text-sm"
        placeholder="VD: SU25"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">
        Tạo mới
      </button>
    </div>
  );
}
