import React from "react";

export default function UsersPage() {
  const users = [
    { id: 1, name: "Admin 1", email: "admin@fpt.edu.vn", role: "Admin" },
    {
      id: 2,
      name: "Lecturer A",
      email: "lecturerA@fpt.edu.vn",
      role: "Lecturer",
    },
    {
      id: 3,
      name: "TA B",
      email: "taB@fpt.edu.vn",
      role: "Teaching Assistant",
    },
  ];

  return (
    <div className="min-h-screen p-6 lg:ml-64">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Người dùng</h1>
            <p className="text-gray-500 mt-1">
              Quản lý tài khoản giảng viên, trợ giảng và admin.
            </p>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm">
            + Tạo người dùng
          </button>
        </header>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="py-2 pr-4">Tên</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Vai trò</th>
                  <th className="py-2 pr-4">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b last:border-0">
                    <td className="py-2 pr-4 text-gray-800">{u.name}</td>
                    <td className="py-2 pr-4 text-gray-800">{u.email}</td>
                    <td className="py-2 pr-4 text-gray-600">{u.role}</td>
                    <td className="py-2 pr-4">
                      <button className="text-xs text-indigo-600 hover:underline mr-3">
                        Chỉnh sửa
                      </button>
                      <button className="text-xs text-red-600 hover:underline">
                        Khoá
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
