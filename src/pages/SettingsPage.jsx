import React from "react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:ml-64">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Cài đặt</h1>
          <p className="text-gray-500 mt-1">
            Cấu hình hệ thống chấm điểm và tùy chọn ứng dụng.
          </p>
        </header>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-gray-600">
            Thiết lập lớp, kỳ thi, hệ số điểm và phân quyền.
          </p>
        </div>
      </div>
    </div>
  );
}
