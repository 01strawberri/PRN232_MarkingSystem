import React, { useEffect, useState, useRef } from "react";
import Table from "@/components/ui/Table";
import API_URL from "@/config/api";

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

  // Fetch groups (class names)
  const fetchGroups = async () => {
    const res = await fetch(`${API_URL}/odata/groups`);
    const data = await res.json();
    return data.value;
  };

  // Fetch OData students
  const fetchStudents = async (url = `${API_URL}/odata/students`) => {
    try {
      setLoading(true);

      // Load groups mapping first
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
    } catch (err) {
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

  // Search + Filter
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
          <span className="text-emerald-600 font-bold">✔</span>
        ) : (
          <span className="text-red-600 font-bold">✖</span>
        ),
    },
    { key: "createdAt", label: "Ngày tạo" },
    {
      key: "actions",
      label: "Hành động",
      render: (row) => (
        <div className="text-sm text-gray-600">
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
    <div className="min-h-screen p-6 lg:ml-64">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Học sinh</h1>
            <p className="text-gray-500 mt-1">
              Quản lý danh sách sinh viên tham gia kỳ thi.
            </p>
          </div>
          <div className="space-x-3">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm">
              Import từ Excel
            </button>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm">
              + Thêm sinh viên
            </button>
          </div>
        </header>

        {/* SEARCH + FILTER */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="Tìm theo tên hoặc MSSV..."
            className="px-3 py-2 border rounded-lg text-sm w-full sm:w-1/2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="px-3 py-2 border rounded-lg text-sm w-full sm:w-40"
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
          >
            <option value="all">Tất cả lớp</option>

            {groups.map((g) => (
              <option key={g.Groupid} value={g.Groupid}>
                {g.Groupname}
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="text-gray-600 mb-4">Đang tải dữ liệu...</div>
        )}

        {error && <div className="text-red-600 mb-4">{error}</div>}

        {!loading && (
          <Table columns={columns} data={filtered} initialPageSize={10} />
        )}

        {nextLink && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => fetchStudents(nextLink)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm"
            >
              Tải thêm
            </button>
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
      MODAL COMPONENT
---------------------------- */
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
        <h2 className="font-semibold text-lg mb-4">{title}</h2>
        <div className="text-sm">{children}</div>
        <div className="mt-5 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm"
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
function EditStudentForm({ student, groups }) {
  const [name, setName] = useState(student.name);
  const [groupId, setGroupId] = useState(student.groupId);

  const submitEdit = () => {
    alert("Đã lưu thay đổi (demo). Sau này nối API PATCH)");
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm">Tên:</label>
        <input
          className="w-full border px-3 py-2 rounded-lg text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm">Lớp:</label>
        <select
          className="w-full border px-3 py-2 rounded-lg text-sm"
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

      <button
        onClick={submitEdit}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm"
      >
        Lưu
      </button>
    </div>
  );
}
