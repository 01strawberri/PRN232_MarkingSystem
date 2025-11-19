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

export default function ExamsPage() {
  const [exams, setExams] = useState([]);
  const [semesters, setSemesters] = useState({});
  const [subjects, setSubjects] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [viewExam, setViewExam] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [uploadExam, setUploadExam] = useState(null);

  const [searchParams] = useSearchParams();
  const filterSemesterId = searchParams.get("semesterId");

  const loadedRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    const load = async () => {
      try {
        setLoading(true);
        const [semRes, subRes, examRes] = await Promise.all([
          fetch(`${API_URL}/odata/semesters`),
          fetch(`${API_URL}/odata/subjects`),
          fetch(`${API_URL}/odata/exams`),
        ]);

        const semData = await semRes.json();
        const subData = await subRes.json();
        const examData = await examRes.json();

        const semMap = {};
        semData.value.forEach((s) => {
          semMap[s.Semesterid] = s.Semestercode;
        });

        const subMap = {};
        subData.value.forEach((s) => {
          subMap[s.Subjectid] = s.Subjectname;
        });

        setSemesters(semMap);
        setSubjects(subMap);

        const formatted = examData.value.map((e) => ({
          id: e.Examid,
          examName: e.Examname,
          semesterId: e.Semesterid,
          subjectId: e.Subjectid,
          semesterCode: semMap[e.Semesterid] || "—",
          subjectName: subMap[e.Subjectid] || "—",
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

  const filtered = filterSemesterId
    ? exams.filter((e) => String(e.semesterId) === String(filterSemesterId))
    : exams;

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
              <Button size="sm" variant="secondary">
                + Tạo kỳ thi mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Tạo kỳ thi mới</DialogTitle>
              </DialogHeader>
              <CreateExamForm />
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

            {!loading && (
              <Table columns={columns} data={filtered} initialPageSize={10} />
            )}
          </CardContent>
        </Card>
      </div>

      {viewExam && (
        <Dialog open={viewExam} onOpenChange={() => setViewExam(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Chi tiết kỳ thi</DialogTitle>
            </DialogHeader>
            <ExamDetail exam={viewExam} />
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

function CreateExamForm() {
  const [name, setName] = useState("");
  return (
    <div className="space-y-4 mt-2">
      <Input
        placeholder="Mã kỳ thi (VD: PE123_SU25)"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button className="w-full" variant="secondary">
        Tạo mới
      </Button>
    </div>
  );
}
