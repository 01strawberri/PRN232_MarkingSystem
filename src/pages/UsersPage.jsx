import React, { useEffect, useState, useRef } from "react";
import API_URL from "@/config/api";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const loadedRef = useRef(false);

  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [createModal, setCreateModal] = useState(false);

  /* ============================================================
      FETCH USERS (FROM ODATA)
  =============================================================== */
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/odata/users`);
      const data = await res.json();

      const formatted = data.value.map((u) => ({
        id: u.Userid,
        username: u.Username,
        email: u.Email,
        role: u.Role,
        active: u.Isactive,
        createdAt: new Date(u.Createat).toLocaleDateString("vi-VN"),
      }));

      setUsers(formatted);
      setFiltered(formatted);
    } catch (err) {
      setError("Không thể tải danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    fetchUsers();
  }, []);

  const handleToggleActive = async (user) => {
    const nextActive = !user.active;
    const confirmLabel = nextActive ? "mở khoá" : "khoá";
    if (
      typeof window !== "undefined" &&
      !window.confirm(`Bạn có chắc muốn ${confirmLabel} tài khoản này?`)
    ) {
      return;
    }

    setProcessingId(user.id);
    setActionError("");

    try {
      const payload = {
        username: user.username,
        email: user.email,
        role: user.role,
        isactive: nextActive,
      };

      const res = await fetch(`${API_URL}/api/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("REQUEST_FAILED");
      }

      await fetchUsers();
      setActionMessage(`Đã ${nextActive ? "mở khoá" : "khoá"} ${user.username}.`);
      setTimeout(() => setActionMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setActionError("Không thể cập nhật trạng thái tài khoản.");
    } finally {
      setProcessingId(null);
    }
  };

  /* ============================================================
      SEARCH + FILTER ROLE
  =============================================================== */
  useEffect(() => {
    let list = [...users];

    if (search.trim() !== "") {
      const s = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.username.toLowerCase().includes(s) ||
          u.email.toLowerCase().includes(s)
      );
    }

    if (roleFilter !== "all") {
      list = list.filter((u) => u.role === roleFilter);
    }

    setFiltered(list);
  }, [search, roleFilter, users]);

  return (
    <div className="min-h-screen p-6 ">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Người dùng</h1>
            <p className="text-gray-500 mt-1">
              Quản lý tài khoản giảng viên, trợ giảng và admin.
            </p>
          </div>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm"
            onClick={() => setCreateModal(true)}
          >
            + Tạo người dùng
          </button>
        </header>

        {/* SEARCH + FILTER */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            className="px-3 py-2 border rounded-lg text-sm w-full sm:w-1/2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="px-3 py-2 border rounded-lg text-sm w-full sm:w-40"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">Tất cả vai trò</option>
            <option value="Admin">Admin</option>
            <option value="Teacher">Teacher</option>
          </select>
        </div>

        {/* LOADING / ERROR */}
        {loading && <div className="text-gray-600">Đang tải dữ liệu...</div>}
        {error && <div className="text-red-600">{error}</div>}

        {/* TABLE */}
        {!loading && (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="py-2 pr-4">Tên</th>
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2 pr-4">Vai trò</th>
                    <th className="py-2 pr-4">Kích hoạt</th>
                    <th className="py-2 pr-4">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.id} className="border-b last:border-0">
                      <td className="py-2 pr-4 text-gray-800">{u.username}</td>
                      <td className="py-2 pr-4 text-gray-800">{u.email}</td>
                      <td className="py-2 pr-4 text-gray-600">{u.role}</td>
                      <td className="py-2 pr-4">
                        {u.active ? (
                          <span className="text-emerald-600 font-semibold">
                            ✔
                          </span>
                        ) : (
                          <span className="text-red-600 font-semibold">✖</span>
                        )}
                      </td>

                      <td className="py-2 pr-4">
                        <button
                          className="text-xs text-indigo-600 hover:underline mr-3"
                          onClick={() => setViewUser(u)}
                        >
                          Xem
                        </button>
                        <button
                          className="text-xs text-amber-600 hover:underline mr-3"
                          onClick={() => setEditUser(u)}
                        >
                          Chỉnh sửa
                        </button>
                        <button
                          className={`text-xs hover:underline ${
                            u.active
                              ? "text-red-600"
                              : "text-emerald-600"
                          } ${processingId === u.id ? "opacity-50 cursor-not-allowed" : ""}`}
                          onClick={() => handleToggleActive(u)}
                          disabled={processingId === u.id}
                        >
                          {processingId === u.id
                            ? "Đang xử lý..."
                            : u.active
                            ? "Khoá"
                            : "Mở khoá"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {(actionError || actionMessage) && (
              <div className="mt-4 text-sm">
                {actionError && <p className="text-red-600">{actionError}</p>}
                {actionMessage && (
                  <p className="text-emerald-600">{actionMessage}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================= VIEW MODAL ================= */}
      {viewUser && (
        <Modal title="Thông tin người dùng" onClose={() => setViewUser(null)}>
          <p>
            <b>Username:</b> {viewUser.username}
          </p>
          <p>
            <b>Email:</b> {viewUser.email}
          </p>
          <p>
            <b>Vai trò:</b> {viewUser.role}
          </p>
          <p>
            <b>Ngày tạo:</b> {viewUser.createdAt}
          </p>
          <p>
            <b>Kích hoạt:</b> {viewUser.active ? "Có" : "Không"}
          </p>
        </Modal>
      )}

      {/* ================= EDIT MODAL ================= */}
      {editUser && (
        <Modal title="Chỉnh sửa người dùng" onClose={() => setEditUser(null)}>
          <EditUserForm
            user={editUser}
            onSuccess={() => {
              fetchUsers();
              setEditUser(null);
            }}
          />
        </Modal>
      )}

      {/* ================= CREATE MODAL ================= */}
      {createModal && (
        <Modal title="Tạo người dùng" onClose={() => setCreateModal(false)}>
          <CreateUserForm
            onSuccess={() => {
              fetchUsers();
              setCreateModal(false);
            }}
          />
        </Modal>
      )}
    </div>
  );
}

/* ============================================================
   MODAL WRAPPER
=============================================================== */
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
        <h2 className="font-semibold text-lg mb-4">{title}</h2>

        <div className="text-sm">{children}</div>

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

/* ============================================================
   EDIT USER FORM
=============================================================== */
function EditUserForm({ user, onSuccess }) {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [active, setActive] = useState(user.active);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    if (!username.trim() || !email.trim()) {
      setError("Vui lòng nhập đầy đủ Username và Email.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        username: username.trim(),
        email: email.trim(),
        role,
        isactive: active,
      };

      if (password.trim()) {
        payload.password = password.trim();
      }

      const res = await fetch(`${API_URL}/api/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("REQUEST_FAILED");
      }

      onSuccess?.();
    } catch (err) {
      console.error(err);
      setError("Không thể cập nhật người dùng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm">Username:</label>
      <input
        className="w-full border px-3 py-2 rounded-lg text-sm"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label className="text-sm">Email:</label>
      <input
        className="w-full border px-3 py-2 rounded-lg text-sm"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label className="text-sm">Vai trò:</label>
      <select
        className="w-full border px-3 py-2 rounded-lg text-sm"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="Admin">Admin</option>
        <option value="Teacher">Teacher</option>
      </select>

      <label className="text-sm">Mật khẩu mới (tuỳ chọn):</label>
      <input
        type="password"
        className="w-full border px-3 py-2 rounded-lg text-sm"
        placeholder="Để trống nếu không đổi mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
        />
        Tài khoản đang kích hoạt
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={save}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Đang lưu..." : "Lưu"}
      </button>
    </div>
  );
}

/* ============================================================
   CREATE USER FORM
=============================================================== */
function CreateUserForm({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Teacher");
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const create = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError("Vui lòng nhập Username, Email và Mật khẩu.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        username: username.trim(),
        email: email.trim(),
        password: password.trim(),
        role,
        isactive: active,
      };

      const res = await fetch(`${API_URL}/api/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("REQUEST_FAILED");
      }

      setUsername("");
      setEmail("");
      setPassword("");
      setRole("Teacher");
      setActive(true);
      onSuccess?.();
    } catch (err) {
      console.error(err);
      setError("Không thể tạo người dùng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm">Username:</label>
      <input
        className="w-full border px-3 py-2 rounded-lg text-sm"
        placeholder="Tên đăng nhập"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label className="text-sm">Email:</label>
      <input
        className="w-full border px-3 py-2 rounded-lg text-sm"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label className="text-sm">Mật khẩu:</label>
      <input
        type="password"
        className="w-full border px-3 py-2 rounded-lg text-sm"
        placeholder="Mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <label className="text-sm">Vai trò:</label>
      <select
        className="w-full border px-3 py-2 rounded-lg text-sm"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="Admin">Admin</option>
        <option value="Teacher">Teacher</option>
      </select>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
        />
        Kích hoạt ngay
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={create}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Đang tạo..." : "Tạo mới"}
      </button>
    </div>
  );
}
