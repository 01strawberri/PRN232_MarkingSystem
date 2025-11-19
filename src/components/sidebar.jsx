import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  FileText,
  Settings,
  Repeat,
  BarChart3,
  LogOut,
  UserRound,
  BookOpen,
  GraduationCap,
} from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoverExpand, setHoverExpand] = useState(false);

  const [theme, setTheme] = useState(() => {
    try {
      if (
        typeof window === "undefined" ||
        typeof localStorage === "undefined"
      ) {
        return "light";
      }
      return (
        localStorage.getItem("theme") ||
        (window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light")
      );
    } catch (e) {
      return "light";
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("theme-dark");
    else root.classList.remove("theme-dark");

    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);

  const expanded = hoverExpand || isOpen;

  return (
    <>
      {/* MOBILE toggle */}
      <button
        onClick={() => setIsOpen((s) => !s)}
        className="lg:hidden fixed top-4 left-4 z-[60] bg-black/40 text-white p-2 rounded-md backdrop-blur"
      >
        {isOpen ? "✖" : "☰"}
      </button>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        onMouseEnter={() => setHoverExpand(true)}
        onMouseLeave={() => setHoverExpand(false)}
        className={`
          fixed top-0 left-0 h-full z-50 bg-[#111] text-white shadow-xl 
          transition-all duration-300 overflow-hidden
          ${expanded ? "w-64" : "w-16"}
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* LOGO */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
            <div className="h-9 w-9 bg-indigo-600 rounded-md" />
            {expanded && (
              <div>
                <div className="text-sm font-semibold">PRN232</div>
                <div className="text-xs text-gray-400">Marking System</div>
              </div>
            )}
          </div>

          {/* NAVIGATION */}
          <nav className="mt-3 flex-1 overflow-y-auto">
            <ul className="space-y-1 px-2">
              {renderItem("/dashboard", LayoutDashboard, "Dashboard", expanded)}
              {renderItem("/students", GraduationCap, "Học sinh", expanded)}
              {renderItem("/semesters", BookOpen, "Học kỳ", expanded)}
              {renderItem("/exams", FileText, "Kỳ thi", expanded)}
              {renderItem("/grades", FileSpreadsheet, "Kết quả", expanded)}
              {renderItem("/reports", BookOpen, "Reports", expanded)}
              {renderItem("/users", Users, "Người dùng", expanded)}
              {renderItem("/settings", Settings, "Settings", expanded)}
            </ul>
          </nav>

          {/* FOOTER */}
          <div className="p-3 border-t border-white/10">
            {/* Theme toggle */}
            <button
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              className="w-full flex items-center gap-3 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-md text-sm"
            >
              <Settings className="w-4 h-4" />
              {expanded && (
                <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
              )}
            </button>

            {/* Logout */}
            <NavLink
              to="/login"
              className="mt-3 block px-3 py-2 bg-indigo-600 rounded-md text-center flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              {expanded && "Đăng xuất"}
            </NavLink>

            {/* Profile */}
            <div className="mt-4 flex items-center gap-3">
              {expanded && (
                <div className="text-sm">
                  <div className="font-medium">Admin</div>
                  <div className="text-xs text-gray-400">admin@example.com</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function renderItem(to, Icon, label, expanded) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `
            flex items-center gap-3 px-3 py-2 rounded-md transition
            ${isActive ? "bg-white/10 text-indigo-400" : "hover:bg-white/10"}
          `
        }
      >
        <Icon className="w-5 h-5" />
        {expanded && <span>{label}</span>}
      </NavLink>
    </li>
  );
}
