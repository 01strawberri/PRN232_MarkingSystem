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

export default function SemestersPage() {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const loadedRef = useRef(false);

  const [editSemester, setEditSemester] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);

  const navigate = useNavigate();
  const [role, setRole] = useState("Admin");

  useEffect(() => {
    const r = localStorage.getItem("role") || "Admin";
    setRole(r);
  }, []);
  const loadCurrentUser = () => {
    if (typeof window === "undefined" || typeof localStorage === "undefined")
      return;
    const storedId = localStorage.getItem("userId");
    setCurrentUserId(storedId ? Number(storedId) : null);
  };

  const fetchSemesters = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/Semester`);
      if (!res.ok) {
        throw new Error("REQUEST_FAILED");
      }
      const data = await res.json();

      const formatted = data.map((s) => ({
        id: s.semesterid,
        code: s.semestercode,
        startDisplay: formatDate(s.startdate),
        endDisplay: formatDate(s.enddate),
        startRaw: s.startdate,
        endRaw: s.enddate,
        active: Boolean(s.isactive),
        createdAtDisplay: formatDate(s.createat),
        createAtRaw: s.createat,
        updateAtRaw: s.updateat,
        createBy: s.createby,
        updateBy: s.updateby,
      }));

      setSemesters(formatted);
      setActionError("");
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách học kỳ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    loadCurrentUser();
    fetchSemesters();
  }, []);

  const columns = [
    { key: "code", label: "Mã học kỳ" },
    {
      key: "startDisplay",
      label: "Ngày bắt đầu",
      render: (r) => r.startDisplay,
    },
    {
      key: "endDisplay",
      label: "Ngày kết thúc",
      render: (r) => r.endDisplay,
    },
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
    {
      key: "createdAtDisplay",
      label: "Ngày tạo",
      render: (r) => r.createdAtDisplay,
    },
    {
      key: "actions",
      label: "Hành động",
      render: (row) =>
        role === "Admin" ? (
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
        ) : (
          <span className="text-gray-400 text-xs">—</span>
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
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setCreateOpen(true)}
              >
                + Tạo học kỳ mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Tạo học kỳ mới</DialogTitle>
              </DialogHeader>
              {role === "Admin" ? (
                <SemesterCreateForm
                  currentUserId={currentUserId}
                  onClose={() => setCreateOpen(false)}
                  onSuccess={(msg) => {
                    setActionMessage(msg);
                    setTimeout(() => setActionMessage(""), 3000);
                    setCreateOpen(false);
                    fetchSemesters();
                  }}
                  onError={(msg) => setActionError(msg)}
                />
              ) : (
                <div className="text-red-600 text-sm py-2">
                  Bạn không có quyền thực hiện chức năng này.
                </div>
              )}
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
            {(actionError || actionMessage) && (
              <div className="mb-3 text-sm">
                {actionError && <p className="text-red-600">{actionError}</p>}
                {actionMessage && (
                  <p className="text-emerald-600">{actionMessage}</p>
                )}
              </div>
            )}

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

      {editSemester && role === "Admin" && (
        <Dialog
          open={!!editSemester}
          onOpenChange={(open) => {
            if (!open) setEditSemester(null);
          }}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa học kỳ</DialogTitle>
            </DialogHeader>
            <SemesterEditForm
              semester={editSemester}
              currentUserId={currentUserId}
              processing={processingId === editSemester.id}
              onStart={() => setProcessingId(editSemester.id)}
              onFinish={() => setProcessingId(null)}
              onSuccess={(msg) => {
                setActionMessage(msg);
                setTimeout(() => setActionMessage(""), 3000);
                setEditSemester(null);
                fetchSemesters();
              }}
              onError={(msg) => setActionError(msg)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function SemesterEditForm({
  semester,
  currentUserId,
  processing,
  onStart,
  onFinish,
  onSuccess,
  onError,
}) {
  const [code, setCode] = useState(semester.code);
  const [start, setStart] = useState(toInputDateTime(semester.startRaw));
  const [end, setEnd] = useState(toInputDateTime(semester.endRaw));
  const [isActive, setIsActive] = useState(semester.active);
  const [error, setError] = useState("");

  useEffect(() => {
    setCode(semester.code);
    setStart(toInputDateTime(semester.startRaw));
    setEnd(toInputDateTime(semester.endRaw));
    setIsActive(semester.active);
  }, [semester]);

  const submit = async () => {
    if (!code.trim()) {
      setError("Vui lòng nhập mã học kỳ.");
      return;
    }
    if (!start || !end) {
      setError("Vui lòng chọn thời gian bắt đầu và kết thúc.");
      return;
    }

    onStart?.();
    setError("");
    onError?.("");

    try {
      const payload = {
        semesterCode: code.trim(),
        startDate: fromInputDateTime(start),
        endDate: fromInputDateTime(end),
        isActive,
        createAt: semester.createAtRaw || new Date().toISOString(),
        updateAt: new Date().toISOString(),
        createBy: semester.createBy ?? currentUserId ?? 0,
        updateBy: currentUserId ?? 0,
      };

      const res = await fetch(`${API_URL}/api/Semester/${semester.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("REQUEST_FAILED");

      onSuccess?.("Đã cập nhật học kỳ.");
    } catch (err) {
      console.error(err);
      setError("Không thể cập nhật học kỳ.");
      onError?.("Không thể cập nhật học kỳ.");
    } finally {
      onFinish?.();
    }
  };

  return (
    <div className="space-y-4 mt-2">
      <Input
        placeholder="Mã học kỳ"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <Input
        type="datetime-local"
        placeholder="Ngày bắt đầu"
        value={start}
        onChange={(e) => setStart(e.target.value)}
      />
      <Input
        type="datetime-local"
        placeholder="Ngày kết thúc"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        Học kỳ đang hoạt động
      </label>

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

function SemesterCreateForm({ currentUserId, onSuccess, onError, onClose }) {
  const [code, setCode] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!code.trim()) {
      setError("Vui lòng nhập mã học kỳ.");
      return;
    }
    if (!start || !end) {
      setError("Vui lòng chọn thời gian bắt đầu và kết thúc.");
      return;
    }

    setLoading(true);
    setError("");
    onError?.("");

    try {
      const now = new Date().toISOString();
      const payload = {
        semesterCode: code.trim(),
        startDate: fromInputDateTime(start),
        endDate: fromInputDateTime(end),
        isActive: true,
        createAt: now,
        updateAt: null,
        createBy: currentUserId ?? 0,
        updateBy: null,
      };

      const res = await fetch(`${API_URL}/api/Semester`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("REQUEST_FAILED");

      setCode("");
      setStart("");
      setEnd("");
      onClose?.();
      onSuccess?.("Đã tạo học kỳ mới.");
    } catch (err) {
      console.error(err);
      setError("Không thể tạo học kỳ.");
      onError?.("Không thể tạo học kỳ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 mt-2">
      <Input
        placeholder="Mã học kỳ (VD: SU25)"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <Input
        type="datetime-local"
        placeholder="Ngày bắt đầu"
        value={start}
        onChange={(e) => setStart(e.target.value)}
      />
      <Input
        type="datetime-local"
        placeholder="Ngày kết thúc"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
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
