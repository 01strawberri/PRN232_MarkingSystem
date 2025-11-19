import React from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function ReportsPage() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Báo cáo</h1>
          <p className="text-gray-500 mt-1">
            Xuất báo cáo tổng hợp điểm, thống kê theo kỳ thi.
          </p>
        </header>

        {/* FILTER CARD */}
        <Card>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-sm">
              {/* KỲ THI */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-gray-600 font-medium">Kỳ thi</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn kỳ thi..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">PE_PRN222_SU25</SelectItem>
                    <SelectItem value="2">PE_PRN221_FA24</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* EXAM ROUND */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-gray-600 font-medium">Exam round</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn round..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="r1">Round 1</SelectItem>
                    <SelectItem value="r2">Round 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* REPORT TYPE */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-gray-600 font-medium">
                  Kiểu báo cáo
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn kiểu..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excel">Tổng hợp điểm (Excel)</SelectItem>
                    <SelectItem value="stat">Thống kê phân bố điểm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex gap-3">
              <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
                Export Excel
              </Button>

              <Button variant="secondary" className="text-gray-800">
                Xem preview
              </Button>
            </div>

            <p className="text-gray-400 text-xs mt-4">
              Lưu ý: file Excel sẽ sinh giống format{" "}
              <b>StudentCode_ExamRound.xlsx</b>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
