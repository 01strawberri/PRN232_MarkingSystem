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
import { useNavigate } from "react-router-dom";

export default function SemestersPage() {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadedRef = useRef(false);

  const [editSemester, setEditSemester] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);

  const navigate = useNavigate();

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
        <Button
          variant="link"
          className="text-amber-600 p-0"
          onClick={(e) => {
            e.stopPropagation();
            setEditSemester(row);
          }}
        >
          Chỉnh sửa
        </Button>
      ),
    },
  ];

  const handleRowClick = (row) => {
    navigate(`/exams?semester=${row.id}`);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Học kỳ</h1>
          <p className="text-gray-500 mt-1">
            Chọn học kỳ để xem danh sách kỳ thi.
          </p>
        </div>

        <div className="flex justify-end">
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="secondary">
                + Tạo học kỳ mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Tạo học kỳ mới</DialogTitle>
              </DialogHeader>
              <SemesterCreateForm />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Danh sách học kỳ
            </CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>

      {editSemester && (
        <Dialog open={editSemester} onOpenChange={() => setEditSemester(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa học kỳ</DialogTitle>
            </DialogHeader>
            <SemesterEditForm semester={editSemester} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function SemesterEditForm({ semester }) {
  const [code, setCode] = useState(semester.code);
  const [start, setStart] = useState(semester.start);
  const [end, setEnd] = useState(semester.end);

  return (
    <div className="space-y-4 mt-2">
      <Input
        placeholder="Mã học kỳ"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <Input
        placeholder="Ngày bắt đầu"
        value={start}
        onChange={(e) => setStart(e.target.value)}
      />
      <Input
        placeholder="Ngày kết thúc"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
      />

      <Button className="w-full" variant="secondary">
        Lưu thay đổi
      </Button>
    </div>
  );
}

function SemesterCreateForm() {
  const [code, setCode] = useState("");

  return (
    <div className="space-y-4 mt-2">
      <Input
        placeholder="Mã học kỳ (VD: SU25)"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <Button className="w-full">Tạo mới</Button>
    </div>
  );
}
