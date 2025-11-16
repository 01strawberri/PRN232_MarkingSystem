import React from "react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-2">Đăng ký tài khoản</h2>
          <p className="text-sm text-gray-500 mb-6">
            Tạo tài khoản cho giảng viên hoặc trợ giảng dùng hệ thống chấm bài.
          </p>

          <form className="space-y-4">
            <input
              className="w-full px-4 py-2 border rounded text-sm"
              placeholder="Họ và tên"
            />
            <input
              className="w-full px-4 py-2 border rounded text-sm"
              placeholder="Email"
              type="email"
            />
            <select className="w-full px-4 py-2 border rounded text-sm text-gray-700">
              <option>Chọn vai trò</option>
              <option>Lecturer</option>
              <option>Teaching Assistant</option>
              <option>Admin</option>
            </select>
            <input
              className="w-full px-4 py-2 border rounded text-sm"
              placeholder="Mật khẩu"
              type="password"
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-sm font-medium"
            >
              Tạo tài khoản
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
