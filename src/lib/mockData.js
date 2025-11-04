// Mock data for students, exams, grades
export const students = [
  { id: "HS001", name: "Nguyễn Văn A", class: "10A" },
  { id: "HS002", name: "Trần Thị B", class: "10A" },
  { id: "HS003", name: "Lê Văn C", class: "11B" },
  { id: "HS004", name: "Phạm Thị D", class: "12C" },
  { id: "HS005", name: "Hoàng Văn E", class: "10A" },
  { id: "HS006", name: "Đỗ Thị F", class: "11B" },
  { id: "HS007", name: "Võ Văn G", class: "12C" },
  { id: "HS008", name: "Bùi Thị H", class: "10A" },
  { id: "HS009", name: "Đặng Văn I", class: "11B" },
  { id: "HS010", name: "Ngô Thị J", class: "12C" },
  { id: "HS011", name: "Lâm Văn K", class: "10B" },
  { id: "HS012", name: "Mai Thị L", class: "10B" },
];

export const exams = [
  { id: "EX001", title: "Toán HK1", date: "2025-11-10", status: "Scheduled" },
  { id: "EX002", title: "Vật lý HK1", date: "2025-11-12", status: "Scheduled" },
  { id: "EX003", title: "Hóa học HK1", date: "2025-11-15", status: "Draft" },
  {
    id: "EX004",
    title: "Sinh học HK1",
    date: "2025-11-18",
    status: "Completed",
  },
];

export const grades = [
  {
    id: 1,
    studentId: "HS001",
    studentName: "Nguyễn Văn A",
    exam: "Toán HK1",
    score: 8.5,
    status: "Approved",
  },
  {
    id: 2,
    studentId: "HS002",
    studentName: "Trần Thị B",
    exam: "Toán HK1",
    score: 7.2,
    status: "Pending",
  },
  {
    id: 3,
    studentId: "HS003",
    studentName: "Lê Văn C",
    exam: "Toán HK1",
    score: 6.8,
    status: "Pending",
  },
  {
    id: 4,
    studentId: "HS001",
    studentName: "Nguyễn Văn A",
    exam: "Vật lý HK1",
    score: 9.0,
    status: "Approved",
  },
  {
    id: 5,
    studentId: "HS004",
    studentName: "Phạm Thị D",
    exam: "Hóa học HK1",
    score: 5.5,
    status: "Draft",
  },
];
