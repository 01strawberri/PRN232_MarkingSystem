import React, { useEffect, useState, useRef } from "react";
import Table from "@/components/ui/Table";
import API_URL from "@/config/api";

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadedRef = useRef(false);

  const [viewGroup, setViewGroup] = useState(null);
  const [editGroup, setEditGroup] = useState(null);
  const [createModal, setCreateModal] = useState(false);

  // Fetch Groups (Class)
  const fetchGroups = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/odata/groups`);
      const data = await res.json();

      const formatted = data.value.map((g) => ({
        id: g.Groupid,
        name: g.Groupname || `Lớp ${g.Groupid}`,
        createdAt: g.Createdat
          ? new Date(g.Createdat).toLocaleDateString("vi-VN")
          : "-",
      }));

      setGroups(formatted);
    } catch (err) {
      setError("Không thể tải danh sách lớp.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    fetchGroups();
  }, []);

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Tên lớp" },

    {
      key: "actions",
      label: "Hành động",
      render: (row) => (
        <div className="text-sm text-gray-600">
          <button
            className="text-indigo-600 hover:underline mr-3"
            onClick={() => setViewGroup(row)}
          >
            Xem
          </button>
          <button
            className="text-amber-600 hover:underline"
            onClick={() => setEditGroup(row)}
          >
            Chỉnh sửa
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-6 lg:ml-64">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Lớp học</h1>
            <p className="text-gray-500 mt-1">
              Quản lý danh sách lớp (GroupID) của sinh viên.
            </p>
          </div>

          <button
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white text-sm"
            onClick={() => setCreateModal(true)}
          >
            + Thêm lớp
          </button>
        </header>

        {loading && <div className="text-gray-600">Đang tải dữ liệu...</div>}
        {error && <div className="text-red-600">{error}</div>}

        {!loading && (
          <Table columns={columns} data={groups} initialPageSize={10} />
        )}
      </div>

      {/* VIEW MODAL */}
      {viewGroup && (
        <Modal title="Thông tin lớp" onClose={() => setViewGroup(null)}>
          <p>
            <b>ID:</b> {viewGroup.id}
          </p>
          <p>
            <b>Tên lớp:</b> {viewGroup.name}
          </p>
        </Modal>
      )}

      {/* EDIT MODAL */}
      {editGroup && (
        <Modal title="Chỉnh sửa lớp" onClose={() => setEditGroup(null)}>
          <GroupEditForm group={editGroup} />
        </Modal>
      )}

      {/* CREATE MODAL */}
      {createModal && (
        <Modal title="Thêm lớp" onClose={() => setCreateModal(false)}>
          <GroupCreateForm />
        </Modal>
      )}
    </div>
  );
}

/* ---------------------------
   MODAL WRAPPER
---------------------------- */
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white rounded-xl w-96 p-6 shadow-lg">
        <h2 className="font-semibold text-lg mb-3">{title}</h2>

        <div className="text-sm">{children}</div>

        <div className="mt-5 text-right">
          <button
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm"
            onClick={onClose}
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
function GroupEditForm({ group }) {
  const [name, setName] = useState(group.name);

  const submitEdit = () => {
    alert("Đã lưu chỉnh sửa (demo). Sau này gắn API PATCH)");
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm">Tên lớp:</label>
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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

/* ---------------------------
   CREATE FORM
---------------------------- */
function GroupCreateForm() {
  const [name, setName] = useState("");

  const submitCreate = () => {
    alert("Đã tạo lớp mới (demo). Sau này gắn API POST)");
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm">Tên lớp:</label>
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Tên lớp..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <button
        onClick={submitCreate}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm"
      >
        Tạo mới
      </button>
    </div>
  );
}
