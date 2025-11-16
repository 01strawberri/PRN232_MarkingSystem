import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
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
    const handleResize = () => {
      if (window.innerWidth > 1024) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebarMobile = () => setIsOpen((s) => !s);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("theme-dark");
    } else {
      root.classList.remove("theme-dark");
    }
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {}
  }, [theme]);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={toggleSidebarMobile}
        className="fixed top-4 left-4 z-50 lg:hidden text-gray-800 bg-white p-2 rounded shadow"
      >
        {isOpen ? "✖" : "☰"}
      </button>

      {isOpen && (
        <div
          onClick={toggleSidebarMobile}
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
        />
      )}

      {/* Sidebar chính */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-xl z-50 transition-transform duration-300 w-64 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 h-full flex flex-col">
          {/* Logo */}
          <div className="mb-6 flex items-center gap-3">
            <div className="h-10 w-10 bg-indigo-600 rounded-md" />
            <div>
              <div className="text-lg font-semibold">PRN232</div>
              <div className="text-xs text-gray-500">Marking System</div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-1">
              {/* Dashboard */}
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded ${
                      isActive
                        ? "bg-gray-100 text-indigo-600"
                        : "hover:bg-gray-100"
                    }`
                  }
                >
                  📊 <span>Dashboard</span>
                </NavLink>
              </li>

              {/* Students */}
              <li>
                <NavLink
                  to="/students"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded ${
                      isActive
                        ? "bg-gray-100 text-indigo-600"
                        : "hover:bg-gray-100"
                    }`
                  }
                >
                  🎓 <span>Học sinh</span>
                </NavLink>
              </li>

              {/* Exams */}
              <li>
                <NavLink
                  to="/exams"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded ${
                      isActive
                        ? "bg-gray-100 text-indigo-600"
                        : "hover:bg-gray-100"
                    }`
                  }
                >
                  📝 <span>Kỳ thi</span>
                </NavLink>
              </li>

              {/* Exam Rounds */}
              <li>
                <NavLink
                  to="/exam-rounds"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded ${
                      isActive
                        ? "bg-gray-100 text-indigo-600"
                        : "hover:bg-gray-100"
                    }`
                  }
                >
                  🔄 <span>Exam Rounds</span>
                </NavLink>
              </li>

              {/* Progress */}
              <li>
                <NavLink
                  to="/progress"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded ${
                      isActive
                        ? "bg-gray-100 text-indigo-600"
                        : "hover:bg-gray-100"
                    }`
                  }
                >
                  ⚙️ <span>Tiến độ chấm</span>
                </NavLink>
              </li>

              {/* Results */}
              <li>
                <NavLink
                  to="/results"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded ${
                      isActive
                        ? "bg-gray-100 text-indigo-600"
                        : "hover:bg-gray-100"
                    }`
                  }
                >
                  🏁 <span>Kết quả</span>
                </NavLink>
              </li>

              {/* Reports */}
              <li>
                <NavLink
                  to="/reports"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded ${
                      isActive
                        ? "bg-gray-100 text-indigo-600"
                        : "hover:bg-gray-100"
                    }`
                  }
                >
                  📄 <span>Reports</span>
                </NavLink>
              </li>

              {/* Users */}
              <li>
                <NavLink
                  to="/users"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded ${
                      isActive
                        ? "bg-gray-100 text-indigo-600"
                        : "hover:bg-gray-100"
                    }`
                  }
                >
                  👤 <span>Người dùng</span>
                </NavLink>
              </li>

              {/* Settings */}
              <li>
                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded ${
                      isActive
                        ? "bg-gray-100 text-indigo-600"
                        : "hover:bg-gray-100"
                    }`
                  }
                >
                  ⚙️ <span>Settings</span>
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* Footer: theme + logout */}
          <div className="mt-4 space-y-3">
            {/* Theme toggle */}
            <div className="px-3">
              <button
                onClick={() =>
                  setTheme((t) => (t === "dark" ? "light" : "dark"))
                }
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded border text-sm"
              >
                {theme === "dark" ? "🌙 Dark mode" : "☀️ Light mode"}
              </button>
            </div>

            {/* Sign out */}
            <div className="px-3">
              <NavLink
                to="/login"
                className="block px-3 py-2 bg-indigo-600 text-white rounded text-center"
              >
                Đăng xuất
              </NavLink>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
