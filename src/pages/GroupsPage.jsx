import React, { useEffect, useState, useRef } from "react";
import Table from "@/components/ui/Table";
import API_URL from "@/config/api";

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [semesterLookup, setSemesterLookup] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const loadedRef = useRef(false);

  const [viewGroup, setViewGroup] = useState(null);
  const [editGroup, setEditGroup] = useState(null);
  const [createModal, setCreateModal] = useState(false);

  const loadCurrentUser = () => {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return;
    }
    const storedId = localStorage.getItem("userId");
    setCurrentUserId(storedId ? Number(storedId) : null);
  };

  const fetchSemesters = async () => {
    try {
      const res = await fetch(`${API_URL}/api/Semester`);
      if (!res.ok) throw new Error("REQUEST_FAILED");
      const data = await res.json();
      const formatted = data.map((s) => ({
        id: s.semesterid,
        name: s.semestercode,
      }));

      setSemesters(formatted);
      setSemesterLookup(
        formatted.reduce((acc, cur) => {
          acc[cur.id] = cur.name;
          return acc;
        }, {})
      );
    } catch (err) {
      console.error(err);
      setActionError("Không thể tải danh sách học kỳ.");
    }
  };

  // Fetch Groups (Class)
  const fetchGroups = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/Group`);
      if (!res.ok) {
        throw new Error("REQUEST_FAILED");
      }
      const data = await res.json();

      const formatted = data.map((g) => ({
        id: g.groupid,
        name: g.groupname || `Lớp ${g.groupid}`,
        semesterId: g.semesterid,
        semesterName: semesterLookup[g.semesterid] || g.semesterid || "-",
        createdAt: g.createat
          ? new Date(g.createat).toLocaleDateString("vi-VN")
          : "-",
        updatedAt: g.updateat
          ? new Date(g.updateat).toLocaleDateString("vi-VN")
          : "-",
        createBy: g.createby,
        updateBy: g.updateby,
      }));

      setGroups(formatted);
      setActionError("");
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách lớp.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    loadCurrentUser();
    fetchSemesters();
    fetchGroups();
  }, []);

  useEffect(() => {
    if (!Object.keys(semesterLookup).length) return;
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        semesterName: semesterLookup[g.semesterId] || g.semesterId || "-",
      }))
    );
  }, [semesterLookup]);

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Tên lớp" },
    {
      key: "semesterName",
      label: "Học kỳ",
      render: (row) => row.semesterName || row.semesterId || "-",
    },

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
          <>
            <Table columns={columns} data={groups} initialPageSize={10} />
            {(actionError || actionMessage) && (
              <div className="mt-4 text-sm">
                {actionError && <p className="text-red-600">{actionError}</p>}
                {actionMessage && (
                  <p className="text-emerald-600">{actionMessage}</p>
                )}
              </div>
            )}
          </>
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
          <p>
            <b>Học kỳ:</b>{" "}
            {viewGroup.semesterName || viewGroup.semesterId || "-"}
          </p>
          <p>
            <b>Ngày tạo:</b> {viewGroup.createdAt}
          </p>
          <p>
            <b>Ngày cập nhật:</b> {viewGroup.updatedAt}
          </p>
          <p>
            <b>Tạo bởi:</b> {viewGroup.createBy ?? "-"}
          </p>
          <p>
            <b>Cập nhật bởi:</b> {viewGroup.updateBy ?? "-"}
          </p>
        </Modal>
      )}

      {/* EDIT MODAL */}
      {editGroup && (
        <Modal title="Chỉnh sửa lớp" onClose={() => setEditGroup(null)}>
          <GroupEditForm
            group={editGroup}
            semesters={semesters}
            currentUserId={currentUserId}
            processing={processingId === editGroup.id}
            onStart={() => setProcessingId(editGroup.id)}
            onFinish={() => setProcessingId(null)}
            onSuccess={(msg) => {
              setActionMessage(msg);
              setTimeout(() => setActionMessage(""), 3000);
              setEditGroup(null);
              fetchGroups();
            }}
            onError={(msg) => setActionError(msg)}
          />
        </Modal>
      )}

      {/* CREATE MODAL */}
      {createModal && (
        <Modal title="Thêm lớp" onClose={() => setCreateModal(false)}>
          <GroupCreateForm
            processing={processingId === "create"}
            semesters={semesters}
            currentUserId={currentUserId}
            onStart={() => setProcessingId("create")}
            onFinish={() => setProcessingId(null)}
            onSuccess={(msg) => {
              setActionMessage(msg);
              setTimeout(() => setActionMessage(""), 3000);
              setCreateModal(false);
              fetchGroups();
            }}
            onError={(msg) => setActionError(msg)}
          />
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
function GroupEditForm({
  group,
  semesters,
  currentUserId,
  processing,
  onStart,
  onFinish,
  onSuccess,
  onError,
}) {
  const [name, setName] = useState(group.name);
  const [semesterId, setSemesterId] = useState(
    group.semesterId || semesters[0]?.id || ""
  );
  const [error, setError] = useState("");

  useEffect(() => {
    setName(group.name);
    setSemesterId(group.semesterId || semesters[0]?.id || "");
  }, [group, semesters]);

  const submitEdit = async () => {
    if (!name.trim()) {
      setError("Vui lòng nhập tên lớp.");
      return;
    }
    if (!semesterId) {
      setError("Vui lòng chọn học kỳ.");
      return;
    }

    onStart?.();
    setError("");
    onError?.("");

    try {
      const payload = {
        groupName: name.trim(),
        semesterId: Number(semesterId),
        createBy: group.createBy ?? currentUserId ?? 0,
        updateBy: currentUserId ?? group.updateBy ?? 0,
      };

      const res = await fetch(`${API_URL}/api/Group/${group.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("REQUEST_FAILED");
      }

      onSuccess?.("Đã cập nhật lớp.");
    } catch (err) {
      console.error(err);
      setError("Không thể cập nhật lớp.");
      onError?.("Không thể cập nhật lớp.");
    } finally {
      onFinish?.();
    }
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

      <div>
        <label className="text-sm">Học kỳ:</label>
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
      </div>


      <button
        onClick={submitEdit}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm disabled:opacity-50"
        disabled={processing || !semesterId}
      >
        {processing ? "Đang lưu..." : "Lưu"}
      </button>
    </div>
  );
}

/* ---------------------------
   CREATE FORM
---------------------------- */
function GroupCreateForm({
  semesters,
  currentUserId,
  processing,
  onStart,
  onFinish,
  onSuccess,
  onError,
}) {
  const [name, setName] = useState("");
  const [semesterId, setSemesterId] = useState(semesters[0]?.id || "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!semesterId && semesters.length) {
      setSemesterId(semesters[0].id);
    }
  }, [semesters, semesterId]);

  const submitCreate = async () => {
    if (!name.trim()) {
      setError("Vui lòng nhập tên lớp.");
      return;
    }
    if (!semesterId) {
      setError("Vui lòng chọn học kỳ.");
      return;
    }

    onStart?.();
    setError("");
    onError?.("");

    try {
      const payload = {
        groupName: name.trim(),
        semesterId: Number(semesterId),
        createBy: currentUserId ?? 0,
        updateBy: null,
      };

      const res = await fetch(`${API_URL}/api/Group`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("REQUEST_FAILED");
      }

      setName("");
      setSemesterId(semesters[0]?.id || "");
      onSuccess?.("Đã tạo lớp mới.");
    } catch (err) {
      console.error(err);
      setError("Không thể tạo lớp.");
      onError?.("Không thể tạo lớp.");
    } finally {
      onFinish?.();
    }
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

      <div>
        <label className="text-sm">Học kỳ:</label>
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
      </div>

      <button
        onClick={submitCreate}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm disabled:opacity-50"
        disabled={processing || !semesterId}
      >
        {processing ? "Đang tạo..." : "Tạo mới"}
      </button>
    </div>
  );
}
