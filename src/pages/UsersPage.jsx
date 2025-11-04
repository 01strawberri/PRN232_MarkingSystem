import React from "react";

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:ml-64">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Người dùng</h1>
          <p className="text-gray-500 mt-1">
            Quản lý giáo viên, nhân sự và quyền truy cập.
          </p>
        </header>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-gray-600">
            Danh sách người dùng, phân quyền và chỉnh sửa tài khoản.
          </p>
        </div>
      </div>
    </div>
  );
}
