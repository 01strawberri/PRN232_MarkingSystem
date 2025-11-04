import React from "react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-2">Đăng ký</h2>
          <p className="text-sm text-gray-500 mb-6">
            Tạo tài khoản cho giáo viên hoặc nhân viên (placeholder).
          </p>

          <form className="space-y-4">
            <input
              className="w-full px-4 py-2 border rounded"
              placeholder="Họ và tên"
            />
            <input
              className="w-full px-4 py-2 border rounded"
              placeholder="Email"
            />
            <input
              className="w-full px-4 py-2 border rounded"
              placeholder="Mật khẩu"
              type="password"
            />
            <button className="w-full bg-indigo-600 text-white py-2 rounded">
              Tạo tài khoản
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
