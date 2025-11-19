import React, { useState } from "react";
import Table from "@/components/ui/Table";
import API_URL from "@/config/api";

export default function ExamRoundsPage() {
  const [uploadModal, setUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");

  const rounds = [
    {
      id: 1,
      name: "Round 1 - 09/03",
      examCode: "PE_PRN222_SU25",
      totalSubmissions: 120,
      status: "Đã import",
      progress: "75%",
    },
    {
      id: 2,
      name: "Round 2 - 10/03",
      examCode: "PE_PRN222_SU25",
      totalSubmissions: 80,
      status: "Đang chấm",
      progress: "40%",
    },
  ];

  const columns = [
    { key: "name", label: "Tên exam round" },
    { key: "examCode", label: "Mã kỳ thi" },
    { key: "totalSubmissions", label: "Số bài nộp" },
    { key: "progress", label: "Tiến độ chấm" },
    { key: "status", label: "Trạng thái" },
    {
      key: "actions",
      label: "Hành động",
      render: (r) => (
        <div className="text-sm text-gray-600">
          <button className="text-indigo-600 hover:underline mr-3">
            Xem tiến độ chấm
          </button>
          <button className="text-indigo-600 hover:underline mr-3">
            Xem kết quả
          </button>
          <button className="text-amber-600 hover:underline">Cấu hình</button>
        </div>
      ),
    },
  ];

  /* ============================================================
      HANDLE UPLOAD
  ============================================================ */
  const uploadFile = async () => {
    if (!selectedFile) {
      setMessage("Vui lòng chọn file!");
      return;
    }

    try {
      setUploading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch(`${API_URL}/api/file/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload thất bại!");

      const data = await res.json();

      setMessage("Upload thành công!");
      console.log("UPLOAD RESULT:", data);
    } catch (err) {
      setMessage("❌ Upload lỗi!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 lg:ml-64">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Exam Rounds
            </h1>
            <p className="text-gray-500 mt-1">
              Quản lý các đợt nộp/chấm bài của một kỳ thi.
            </p>
          </div>

          <div className="space-x-3">
            <button
              onClick={() => setUploadModal(true)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm"
            >
              Upload submissions (.zip/.rar)
            </button>

            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm">
              Start grading
            </button>
          </div>
        </header>

        <Table columns={columns} data={rounds} initialPageSize={8} />
      </div>

      {/* ============ UPLOAD MODAL ============ */}
      {uploadModal && (
        <Modal title="Upload submissions" onClose={() => setUploadModal(false)}>
          <div className="space-y-4 text-sm">
            <input
              type="file"
              accept=".zip,.rar"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="border p-2 rounded w-full"
            />

            {message && <p className="text-center text-red-600">{message}</p>}

            <button
              onClick={uploadFile}
              disabled={uploading}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg"
            >
              {uploading ? "Đang upload..." : "Upload"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ============================================================
   MODAL REUSABLE COMPONENT
============================================================ */
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[450px] shadow-lg">
        <h2 className="font-semibold text-lg mb-4">{title}</h2>

        {children}

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
