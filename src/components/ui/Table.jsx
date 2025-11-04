import React, { useMemo, useState } from "react";
import EmptyState from "./EmptyState";

// columns: [{ key, label, render?(row) }]
export default function Table({
  columns = [],
  data = [],
  initialPageSize = 10,
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const filtered = useMemo(() => {
    if (!query) return data;
    const q = query.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [data, query]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  function goto(p) {
    const np = Math.max(1, Math.min(totalPages, p));
    setPage(np);
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border rounded w-64 text-sm"
            placeholder="Tìm kiếm..."
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500">Rows</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="px-2 py-1 border rounded text-sm"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        {pageData.length === 0 ? (
          <EmptyState
            title="Không tìm thấy kết quả"
            subtitle="Thử thay đổi từ khóa tìm kiếm hoặc lọc khác."
          />
        ) : (
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="text-xs text-gray-500">
                {columns.map((col) => (
                  <th key={col.key} className="px-3 py-2">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageData.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className="border-t last:border-b hover:bg-gray-50"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-3 py-3 align-middle text-gray-700"
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">{total} mục</div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => goto(page - 1)}
            className="px-3 py-1 border rounded text-sm"
            disabled={page <= 1}
          >
            Prev
          </button>
          <div className="px-3 py-1 border rounded text-sm">
            {page} / {totalPages}
          </div>
          <button
            onClick={() => goto(page + 1)}
            className="px-3 py-1 border rounded text-sm"
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
