import React from "react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen p-6 ">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Cài đặt</h1>
          <p className="text-gray-500 mt-1">
            Cấu hình rubric, rule auto-0, cloud endpoint và thông tin học kỳ.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-gray-800 font-semibold mb-3">Rubric</h2>
            <p className="text-sm text-gray-600 mb-3">
              Thiết lập thang điểm tổng (10 điểm) và điểm chi tiết Q1–Q6.
            </p>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm">
              Quản lý Rubric
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-gray-800 font-semibold mb-3">Rule auto-0</h2>
            <p className="text-sm text-gray-600 mb-3">
              Cấu hình các rule tự động cho 0 điểm (hardcode, sai 3-layer,
              keyword cấm...).
            </p>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm">
              Quản lý RuleSets
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-gray-800 font-semibold mb-3">Cloud Endpoint</h2>
            <p className="text-sm text-gray-600 mb-3">
              Cấu hình API nhận điểm từ hệ thống chấm (ví dụ /scores).
            </p>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm">
              Thiết lập Endpoint
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-gray-800 font-semibold mb-3">
              Học kỳ & giảng viên
            </h2>
            <p className="text-sm text-gray-600 mb-3">
              Quản lý Semesters, Lecturers và mapping với Exams.
            </p>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm">
              Quản lý học kỳ / giảng viên
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
