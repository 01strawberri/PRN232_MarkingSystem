import React, { useEffect, useState, useRef } from "react";
import Table from "@/components/ui/Table";
import API_URL from "@/config/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nextLink, setNextLink] = useState(null);

  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");

  const [viewStudent, setViewStudent] = useState(null);
  const [editStudent, setEditStudent] = useState(null);

  const loadedRef = useRef(false);

  const fetchGroups = async () => {
    const res = await fetch(`${API_URL}/odata/groups`);
    const data = await res.json();
    return data.value;
  };

  const fetchStudents = async (url = `${API_URL}/odata/students`) => {
    try {
      setLoading(true);

      const groupsData = groups.length ? groups : await fetchGroups();
      setGroups(groupsData);

      const groupMap = {};
      groupsData.forEach((g) => {
        groupMap[g.Groupid] = g.Groupname || `Nhóm ${g.Groupid}`;
      });

      const res = await fetch(url);
      const data = await res.json();

      const formatted = data.value.map((s) => ({
        id: s.Studentid,
        studentCode: s.Studentroll,
        name: s.Studentfullname,
        groupId: s.Groupid,
        groupName: groupMap[s.Groupid] || "Không xác định",
        active: s.Isactive,
        createdAt: new Date(s.Createdat).toLocaleDateString("vi-VN"),
      }));

      setStudents((prev) => [...prev, ...formatted]);

      if (data["@odata.nextLink"]) setNextLink(data["@odata.nextLink"]);
      else setNextLink(null);
    } catch {
      setError("Không thể tải danh sách sinh viên.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    fetchStudents();
  }, []);

  useEffect(() => {
    let list = [...students];

    if (search.trim() !== "") {
      list = list.filter(
        (s) =>
          s.studentCode.toLowerCase().includes(search.toLowerCase()) ||
          s.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (groupFilter !== "all") {
      list = list.filter((s) => String(s.groupId) === groupFilter);
    }

    setFiltered(list);
  }, [search, groupFilter, students]);

  const columns = [
    { key: "studentCode", label: "Mã SV" },
    { key: "name", label: "Tên" },
    { key: "groupName", label: "Lớp" },
    {
      key: "active",
      label: "Kích hoạt",
      render: (row) =>
        row.active ? (
          <span className="text-emerald-600 font-semibold">✔</span>
        ) : (
          <span className="text-red-600 font-semibold">✖</span>
        ),
    },
    { key: "createdAt", label: "Ngày tạo" },
    {
      key: "actions",
      label: "Hành động",
      render: (row) => (
        <div className="text-sm">
          <button
            className="text-indigo-600 hover:underline mr-3"
            onClick={() => setViewStudent(row)}
          >
            Xem
          </button>
          <button
            className="text-amber-600 hover:underline"
            onClick={() => setEditStudent(row)}
          >
            Chỉnh sửa
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-6  bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Học sinh</h1>
            <p className="text-muted-foreground mt-1">
              Quản lý danh sách sinh viên tham gia kỳ thi.
            </p>
          </div>

          <div className="space-x-3">
            <Button variant="secondary">+ Thêm sinh viên</Button>
          </div>
        </header>

        {/* SEARCH + FILTER */}
        <Card className="mb-6 shadow-sm rounded-2xl">
          <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              placeholder="Tìm theo tên hoặc MSSV..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10"
            />

            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="border h-10 rounded-lg px-3"
            >
              <option value="all">Tất cả lớp</option>
              {groups.map((g) => (
                <option key={g.Groupid} value={g.Groupid}>
                  {g.Groupname}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>

        {/* TABLE */}
        {loading && <div className="text-gray-600">Đang tải dữ liệu...</div>}
        {error && <div className="text-red-600">{error}</div>}

        {!loading && (
          <div className="shadow-sm rounded-xl overflow-hidden bg-white border">
            <Table columns={columns} data={filtered} initialPageSize={10} />
          </div>
        )}

        {nextLink && (
          <div className="mt-4 flex justify-center">
            <Button variant="secondary" onClick={() => fetchStudents(nextLink)}>
              Tải thêm
            </Button>
          </div>
        )}
      </div>

      {/* VIEW MODAL */}
      {viewStudent && (
        <Modal title="Thông tin sinh viên" onClose={() => setViewStudent(null)}>
          <p>
            <b>Mã SV:</b> {viewStudent.studentCode}
          </p>
          <p>
            <b>Họ tên:</b> {viewStudent.name}
          </p>
          <p>
            <b>Lớp:</b> {viewStudent.groupName}
          </p>
          <p>
            <b>Ngày tạo:</b> {viewStudent.createdAt}
          </p>
          <p>
            <b>Kích hoạt:</b> {viewStudent.active ? "Có" : "Không"}
          </p>
        </Modal>
      )}

      {/* EDIT MODAL */}
      {editStudent && (
        <Modal title="Chỉnh sửa sinh viên" onClose={() => setEditStudent(null)}>
          <EditStudentForm student={editStudent} groups={groups} />
        </Modal>
      )}
    </div>
  );
}

/* ---------------------------
        MODAL
---------------------------- */
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-[420px]">
        <h2 className="font-semibold text-lg mb-4">{title}</h2>
        <div className="text-sm space-y-2">{children}</div>

        <div className="mt-5 text-right">
          <Button variant="secondary" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------
       EDIT FORM
---------------------------- */
function EditStudentForm({ student, groups }) {
  const [name, setName] = useState(student.name);
  const [groupId, setGroupId] = useState(student.groupId);

  const submitEdit = () => {
    alert("Đã lưu thay đổi (demo) – cần nối với PATCH API");
  };

  return (
    <div className="space-y-4 text-sm">
      <div>
        <label className="text-sm font-medium">Tên:</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div>
        <label className="text-sm font-medium">Lớp:</label>
        <select
          className="border rounded-lg px-3 py-2 w-full"
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
        >
          {groups.map((g) => (
            <option key={g.Groupid} value={g.Groupid}>
              {g.Groupname}
            </option>
          ))}
        </select>
      </div>

      <Button className="w-full" onClick={submitEdit}>
        Lưu
      </Button>
    </div>
  );
}
