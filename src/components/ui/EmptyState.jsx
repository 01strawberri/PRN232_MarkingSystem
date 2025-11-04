import React from "react";

export default function EmptyState({
  title = "Không có dữ liệu",
  subtitle = "Không có mục nào để hiển thị.",
}) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100">
        <svg
          className="h-8 w-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m4 0h-1a3 3 0 00-3 3v1H8v-1a3 3 0 00-3-3H4"
          />
        </svg>
      </div>
      <h4 className="mt-4 text-lg font-medium text-gray-700">{title}</h4>
      <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
    </div>
  );
}
