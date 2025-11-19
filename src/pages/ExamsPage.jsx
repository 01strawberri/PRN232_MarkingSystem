import React, { useEffect, useState, useRef } from "react";
import Table from "@/components/ui/Table";
import API_URL from "@/config/api";
import { useNavigate, useSearchParams } from "react-router-dom";

/* ============================================================
   MAIN PAGE
=============================================================== */
export default function ExamsPage() {
  const [exams, setExams] = useState([]);
  const [semesters, setSemesters] = useState({});
  const [subjects, setSubjects] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [viewExam, setViewExam] = useState(null);
  const [createModal, setCreateModal] = useState(false);
  const [uploadModal, setUploadModal] = useState(null);

  const [searchParams] = useSearchParams();
  const filterSemesterId = searchParams.get("semesterId");

  const loadedRef = useRef(false);

  /* ============================================================
      INITIAL LOAD: semesters + subjects + exams
  ============================================================ */
  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    const load = async () => {
      try {
        setLoading(true);

        // Load song song
        const [semesterRes, subjectRes, examRes] = await Promise.all([
          fetch(`${API_URL}/odata/semesters`),
          fetch(`${API_URL}/odata/subjects`),
          fetch(`${API_URL}/odata/exams`),
        ]);

        const semesterData = await semesterRes.json();
        const subjectData = await subjectRes.json();
        const examData = await examRes.json();

        const semesterMap = {};
        semesterData.value.forEach((s) => {
          semesterMap[s.Semesterid] = s.Semestercode;
        });

        const subjectMap = {};
        subjectData.value.forEach((s) => {
          subjectMap[s.Subjectid] = s.Subjectname;
        });

        setSemesters(semesterMap);
        setSubjects(subjectMap);

        const formatted = examData.value.map((e) => ({
          id: e.Examid,
          examName: e.Examname,
          semesterId: e.Semesterid,
          subjectId: e.Subjectid,
          semesterCode: semesterMap[e.Semesterid] || "—",
          subjectName: subjectMap[e.Subjectid] || "—",
          examDate: new Date(e.Examdate).toLocaleDateString("vi-VN"),
          createdAt: new Date(e.Createdat).toLocaleDateString("vi-VN"),
        }));

        setExams(formatted);
      } catch (err) {
        setError("Không thể tải dữ liệu kỳ thi.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [filterSemesterId]);

  /* ============================================================
      FILTER BY SEMESTER ID
  ============================================================ */
  const filteredExams = filterSemesterId
    ? exams.filter((e) => String(e.semesterId) === String(filterSemesterId))
    : exams;

  /* ============================================================
      TABLE COLUMNS
  ============================================================ */
  const columns = [
    { key: "examName", label: "Mã kỳ thi" },
    { key: "semesterCode", label: "Học kỳ" },
    { key: "subjectName", label: "Môn học" },
    { key: "examDate", label: "Ngày thi" },
    { key: "createdAt", label: "Ngày tạo" },

    {
      key: "actions",
      label: "Hành động",
      render: (row) => (
        <div className="flex gap-3 text-sm">
          <button
            onClick={() => setViewExam(row)}
            className="text-indigo-600 hover:underline"
          >
            Xem chi tiết
          </button>

          <button
            onClick={() => setUploadModal(row)}
            className="text-emerald-600 hover:underline"
          >
            Chấm bài
          </button>
        </div>
      ),
    },
  ];

  /* ============================================================
      RENDER PAGE
  ============================================================ */
  return (
    <div className="min-h-screen p-6 lg:ml-64">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Kỳ thi</h1>
            <p className="text-gray-500 mt-1">
              Danh sách kỳ thi lấy từ API odata/exams.
            </p>

            {filterSemesterId && (
              <p className="text-sm mt-1 text-emerald-600">
                Đang lọc theo học kỳ: {semesters[filterSemesterId] || "—"}
              </p>
            )}
          </div>

          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm"
            onClick={() => setCreateModal(true)}
          >
            + Tạo kỳ thi mới
          </button>
        </header>

        {loading && <p>Đang tải dữ liệu...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && (
          <Table columns={columns} data={filteredExams} initialPageSize={10} />
        )}
      </div>

      {/* MODALS */}
      {viewExam && (
        <ExamDetailModal exam={viewExam} onClose={() => setViewExam(null)} />
      )}

      {uploadModal && (
        <UploadModal exam={uploadModal} onClose={() => setUploadModal(null)} />
      )}

      {createModal && <CreateExamModal onClose={() => setCreateModal(false)} />}
    </div>
  );
}

/* ============================================================
   MODAL: CHI TIẾT KỲ THI
=============================================================== */
function ExamDetailModal({ exam, onClose }) {
  return (
    <Modal title={`Chi tiết kỳ thi: ${exam.examName}`} onClose={onClose}>
      <div className="space-y-2 text-sm">
        <p>
          <b>Mã kỳ thi:</b> {exam.examName}
        </p>
        <p>
          <b>Học kỳ:</b> {exam.semesterCode}
        </p>
        <p>
          <b>Môn học:</b> {exam.subjectName}
        </p>
        <p>
          <b>Ngày thi:</b> {exam.examDate}
        </p>
        <p>
          <b>Ngày tạo:</b> {exam.createdAt}
        </p>
      </div>
    </Modal>
  );
}

/* ============================================================
   MODAL: UPLOAD & CHẤM BÀI — GỬI TOKEN
=============================================================== */
function UploadModal({ exam, onClose }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const nav = useNavigate();

  const upload = async () => {
    if (!file) return alert("Vui lòng chọn file .zip hoặc .rar");

    const token = localStorage.getItem("access_token");

    if (!token) return alert("Không tìm thấy token, vui lòng đăng nhập!");

    const form = new FormData();
    form.append("file", file);

    setUploading(true);

    try {
      const res = await fetch(`${API_URL}/api/file/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (!res.ok) throw new Error("Upload thất bại!");

      alert("Upload thành công! Hệ thống đang bắt đầu chấm bài...");

      onClose();
      nav(`/progress?examId=${exam.id}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal title={`Chấm bài - ${exam.examName}`} onClose={onClose}>
      <div className="space-y-3">
        <input
          type="file"
          accept=".zip,.rar"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          onClick={upload}
          disabled={uploading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm"
        >
          {uploading ? "Đang upload..." : "Bắt đầu chấm"}
        </button>
      </div>
    </Modal>
  );
}

/* ============================================================
   CREATE EXAM MODAL (giữ nguyên)
=============================================================== */
function CreateExamModal({ onClose }) {
  const [name, setName] = useState("");

  return (
    <Modal title="Tạo kỳ thi mới" onClose={onClose}>
      <div className="space-y-3">
        <label className="text-sm">Mã kỳ thi:</label>
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="VD: PE_PRN222_SU25"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">
          Tạo mới
        </button>
      </div>
    </Modal>
  );
}

/* ============================================================
   GENERAL MODAL COMPONENT
=============================================================== */
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[600px] shadow-lg">
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
