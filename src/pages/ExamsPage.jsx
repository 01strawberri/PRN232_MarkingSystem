import React, { useEffect, useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Table from "@/components/ui/Table";
import API_URL from "@/config/api";
import { useNavigate, useSearchParams } from "react-router-dom";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("vi-VN");
};

const toInputDateTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (num) => num.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hour}:${minute}`;
};

const fromInputDateTime = (value) =>
  value ? new Date(value).toISOString() : null;

export default function ExamsPage() {
  const [exams, setExams] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const [viewExam, setViewExam] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editExam, setEditExam] = useState(null);
  const [uploadExam, setUploadExam] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);
  const [searchParams] = useSearchParams();
  const filterSemesterId = searchParams.get("semesterId");

  const loadedRef = useRef(false);
  const navigate = useNavigate();

  const fetchReferenceData = async () => {
    const [semRes, subRes] = await Promise.all([
      fetch(`${API_URL}/api/Semester`),
      fetch(`${API_URL}/api/Subject`),
    ]);

    if (!semRes.ok || !subRes.ok) {
      throw new Error("REFERENCE_FAILED");
    }

    const semData = await semRes.json();
    const subData = await subRes.json();

    setSemesters(
      semData.map((s) => ({
        id: s.semesterid,
        name: s.semestercode,
      }))
    );

    setSubjects(
      subData.map((s) => ({
        id: s.subjectid,
        name: s.subjectname,
      }))
    );
  };

  const fetchExams = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/Exam`);
      if (!res.ok) throw new Error("REQUEST_FAILED");
      const data = await res.json();

      const semLookup = semesters.reduce((acc, cur) => {
        acc[cur.id] = cur.name;
        return acc;
      }, {});

      const subLookup = subjects.reduce((acc, cur) => {
        acc[cur.id] = cur.name;
        return acc;
      }, {});

      const formatted = data.map((e) => ({
        id: e.examid,
        examName: e.examname,
        semesterId: e.semesterid,
        subjectId: e.subjectid,
        examDateRaw: e.examdate,
        examDate: formatDate(e.examdate),
        createdAt: formatDate(e.createat || e.createdat),
        semesterName: semLookup[e.semesterid] || e.semesterid,
        subjectName: subLookup[e.subjectid] || e.subjectid,
      }));

      setExams(formatted);
      setActionError("");
    } catch (err) {
      console.error(err);
      setError("Không thể tải dữ liệu kỳ thi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    const load = async () => {
      try {
        await fetchReferenceData();
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh sách học kỳ/môn học.");
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (!semesters.length || !subjects.length) return;
    fetchExams();
  }, [semesters, subjects]);

  const filtered = filterSemesterId
    ? exams.filter((e) => String(e.semesterId) === String(filterSemesterId))
    : exams;

  const columns = [
    { key: "examName", label: "Mã kỳ thi" },
    { key: "semesterName", label: "Học kỳ" },
    { key: "subjectName", label: "Môn học" },
    { key: "examDate", label: "Ngày thi" },
    { key: "createdAt", label: "Ngày tạo" },
    {
      key: "actions",
      label: "Hành động",
      render: (row) => (
        <div className="flex gap-3 text-sm">
          <Button
            variant="link"
            className="p-0 text-indigo-600"
            onClick={() => setViewExam(row)}
          >
            Xem chi tiết
          </Button>

          <Button
            variant="link"
            className="p-0 text-emerald-600"
            onClick={() => setUploadExam(row)}
          >
            Chấm bài
          </Button>

          {role === "Admin" && (
            <Button
              variant="link"
              className="p-0 text-amber-600"
              onClick={() => setEditExam(row)}
            >
              Chỉnh sửa
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Kỳ thi</h1>
            <p className="text-gray-500 mt-1">
              Danh sách kỳ thi lấy từ API odata/exams.
            </p>

            {filterSemesterId && (
              <p className="text-sm mt-1 text-emerald-600">
                Đang lọc theo học kỳ: {semesters[filterSemesterId] || "—"}
              </p>
            )}
          </div>

          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              {role === "Admin" ? (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setCreateOpen(true)}
                >
                  + Tạo kỳ thi mới
                </Button>
              ) : (
                <div className="text-red-500 text-sm">
                  Bạn không có quyền tạo kỳ thi.
                </div>
              )}
            </DialogTrigger>

            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Tạo kỳ thi mới</DialogTitle>
              </DialogHeader>{" "}
              {role === "Admin" ? (
                <CreateExamForm
                  semesters={semesters}
                  subjects={subjects}
                  onSuccess={(msg) => {
                    setActionMessage(msg);
                    setTimeout(() => setActionMessage(""), 3000);
                    setCreateOpen(false);
                    fetchExams();
                  }}
                  onError={(msg) => setActionError(msg)}
                />
              ) : (
                <div className="text-red-500 text-sm">
                  Bạn không có quyền tạo kỳ thi.
                </div>
              )}
            </DialogContent>
          </Dialog>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Danh sách kỳ thi
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading && <p className="text-gray-600">Đang tải...</p>}
            {error && <p className="text-red-600">{error}</p>}
            {(actionError || actionMessage) && (
              <div className="mb-3 text-sm">
                {actionError && <p className="text-red-600">{actionError}</p>}
                {actionMessage && (
                  <p className="text-emerald-600">{actionMessage}</p>
                )}
              </div>
            )}

            {!loading && (
              <Table columns={columns} data={filtered} initialPageSize={10} />
            )}
          </CardContent>
        </Card>
      </div>

      {viewExam && (
        <Dialog open={!!viewExam} onOpenChange={() => setViewExam(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Chi tiết kỳ thi</DialogTitle>
            </DialogHeader>
            <ExamDetail exam={viewExam} />
          </DialogContent>
        </Dialog>
      )}

      {editExam && (
        <Dialog open={!!editExam} onOpenChange={() => setEditExam(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa kỳ thi</DialogTitle>
            </DialogHeader>
            {role === "Admin" ? (
              <EditExamForm
                exam={editExam}
                semesters={semesters}
                subjects={subjects}
                processing={processingId === editExam.id}
                onStart={() => setProcessingId(editExam.id)}
                onFinish={() => setProcessingId(null)}
                onSuccess={(msg) => {
                  setActionMessage(msg);
                  setTimeout(() => setActionMessage(""), 3000);
                  setEditExam(null);
                  fetchExams();
                }}
                onError={(msg) => setActionError(msg)}
              />
            ) : (
              <div className="text-red-500 text-sm">
                Bạn không có quyền thực hiện chức năng này.
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}

      {uploadExam && (
        <Dialog open={uploadExam} onOpenChange={() => setUploadExam(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Chấm bài</DialogTitle>
            </DialogHeader>
            <UploadExamForm exam={uploadExam} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function ExamDetail({ exam }) {
  return (
    <div className="space-y-2 text-sm mt-2">
      <p>
        <b>Mã kỳ thi:</b> {exam.examName}
      </p>
      <p>
        <b>Học kỳ:</b> {exam.semesterName}
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
  );
}

function UploadExamForm({ exam }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const upload = async () => {
    if (!file) return alert("Vui lòng chọn file .zip hoặc .rar");

    const token = localStorage.getItem("access_token");
    if (!token) return alert("Không tìm thấy token");

    const form = new FormData();
    form.append("file", file);

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/file/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (!res.ok) throw new Error("Upload thất bại!");
      alert("Upload thành công! Bắt đầu chấm bài...");
      nav(`/progress?examId=${exam.id}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 mt-2">
      <Input
        type="file"
        accept=".zip,.rar"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <Button
        onClick={upload}
        disabled={loading}
        className="w-full"
        variant="secondary"
      >
        {loading ? "Đang upload..." : "Bắt đầu chấm"}
      </Button>
    </div>
  );
}

function EditExamForm({
  exam,
  semesters,
  subjects,
  processing,
  onStart,
  onFinish,
  onSuccess,
  onError,
}) {
  const [name, setName] = useState(exam.examName);
  const [semesterId, setSemesterId] = useState(exam.semesterId);
  const [subjectId, setSubjectId] = useState(exam.subjectId);
  const [examDate, setExamDate] = useState(toInputDateTime(exam.examDateRaw));
  const [error, setError] = useState("");

  useEffect(() => {
    setName(exam.examName);
    setSemesterId(exam.semesterId);
    setSubjectId(exam.subjectId);
    setExamDate(toInputDateTime(exam.examDateRaw));
  }, [exam]);

  const submit = async () => {
    if (!name.trim() || !semesterId || !subjectId || !examDate) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    const examDateIso = fromInputDateTime(examDate);
    if (!examDateIso || new Date(examDateIso) <= new Date()) {
      setError("Ngày thi phải ở tương lai.");
      return;
    }

    onStart?.();
    setError("");
    onError?.("");

    try {
      const payload = {
        semesterId: Number(semesterId),
        subjectId: Number(subjectId),
        examName: name.trim(),
        examDate: examDateIso,
      };

      const res = await fetch(`${API_URL}/api/Exam/${exam.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("REQUEST_FAILED");

      onSuccess?.("Đã cập nhật kỳ thi.");
    } catch (err) {
      console.error(err);
      setError("Không thể cập nhật kỳ thi.");
      onError?.("Không thể cập nhật kỳ thi.");
    } finally {
      onFinish?.();
    }
  };

  return (
    <div className="space-y-4 mt-2">
      <Input
        placeholder="Tên kỳ thi"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <select
        className="w-full border rounded-lg px-3 py-2 text-sm"
        value={semesterId}
        onChange={(e) => setSemesterId(e.target.value)}
      >
        <option value="">Chọn học kỳ</option>
        {semesters.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <select
        className="w-full border rounded-lg px-3 py-2 text-sm"
        value={subjectId}
        onChange={(e) => setSubjectId(e.target.value)}
      >
        <option value="">Chọn môn học</option>
        {subjects.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <Input
        type="datetime-local"
        value={examDate}
        onChange={(e) => setExamDate(e.target.value)}
        placeholder="Ngày thi"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button
        className="w-full"
        variant="secondary"
        onClick={submit}
        disabled={processing}
      >
        {processing ? "Đang lưu..." : "Lưu thay đổi"}
      </Button>
    </div>
  );
}

function CreateExamForm({ semesters, subjects, onSuccess, onError }) {
  const [name, setName] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [examDate, setExamDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name.trim() || !semesterId || !subjectId || !examDate) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    const examDateIso = fromInputDateTime(examDate);
    if (!examDateIso || new Date(examDateIso) <= new Date()) {
      setError("Ngày thi phải ở tương lai.");
      return;
    }

    setLoading(true);
    setError("");
    onError?.("");

    try {
      const payload = {
        semesterId: Number(semesterId),
        subjectId: Number(subjectId),
        examName: name.trim(),
        examDate: examDateIso,
      };

      const res = await fetch(`${API_URL}/api/Exam`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("REQUEST_FAILED");

      setName("");
      setSemesterId("");
      setSubjectId("");
      setExamDate("");
      onSuccess?.("Đã tạo kỳ thi mới.");
    } catch (err) {
      console.error(err);
      setError("Không thể tạo kỳ thi.");
      onError?.("Không thể tạo kỳ thi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 mt-2">
      <Input
        placeholder="Tên kỳ thi (VD: PE123_SU25)"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <select
        className="w-full border rounded-lg px-3 py-2 text-sm"
        value={semesterId}
        onChange={(e) => setSemesterId(e.target.value)}
      >
        <option value="">Chọn học kỳ</option>
        {semesters.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <select
        className="w-full border rounded-lg px-3 py-2 text-sm"
        value={subjectId}
        onChange={(e) => setSubjectId(e.target.value)}
      >
        <option value="">Chọn môn học</option>
        {subjects.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <Input
        type="datetime-local"
        value={examDate}
        onChange={(e) => setExamDate(e.target.value)}
        placeholder="Ngày thi"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button
        className="w-full"
        variant="secondary"
        onClick={submit}
        disabled={loading}
      >
        {loading ? "Đang tạo..." : "Tạo mới"}
      </Button>
    </div>
  );
}
