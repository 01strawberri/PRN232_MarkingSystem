import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebarMobile = () => setIsOpen((s) => !s);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        id="toggleSidebarMobile"
        onClick={toggleSidebarMobile}
        className="fixed top-4 left-4 z-50 lg:hidden text-gray-800 bg-white p-2 rounded shadow"
        aria-label="Toggle sidebar"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Mobile backdrop */}
      {isOpen && (
        <div
          id="sidebarBackdrop"
          onClick={toggleSidebarMobile}
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`fixed top-0 left-0 h-full bg-white shadow-xl z-50 transition-transform duration-300 w-64 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-10 w-10 bg-indigo-600 rounded-md" />
            <div>
              <div className="text-lg font-semibold">PRN232</div>
              <div className="text-xs text-gray-500">Marking System</div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-1">
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded ${
                      isActive
                        ? "bg-gray-100 text-indigo-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6"
                    />
                  </svg>
                  <span>Dashboard</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/students"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded ${
                      isActive
                        ? "bg-gray-100 text-indigo-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m4 0h-1a3 3 0 00-3 3v1H8v-1a3 3 0 00-3-3H4"
                    />
                  </svg>
                  <span>Học sinh</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/exams"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded ${
                      isActive
                        ? "bg-gray-100 text-indigo-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-sky-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5h6M9 3h6a2 2 0 012 2v14a2 2 0 01-2 2H9a2 2 0 01-2-2V5a2 2 0 012-2z"
                    />
                  </svg>
                  <span>Kỳ thi</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/grades"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded ${
                      isActive
                        ? "bg-gray-100 text-indigo-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-amber-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2v2a3 3 0 006 0v-2c0-1.105-1.343-2-3-2z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 20v-2"
                    />
                  </svg>
                  <span>Điểm</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/reports"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded ${
                      isActive
                        ? "bg-gray-100 text-indigo-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7h18M3 12h18M3 17h18"
                    />
                  </svg>
                  <span>Reports</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded ${
                      isActive
                        ? "bg-gray-100 text-indigo-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2v2a3 3 0 006 0v-2c0-1.105-1.343-2-3-2z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 20v-2"
                    />
                  </svg>
                  <span>Settings</span>
                </NavLink>
              </li>
            </ul>
          </nav>

          <div className="mt-4">
            <NavLink
              to="/login"
              className="block px-3 py-2 bg-indigo-600 text-white rounded text-center"
            >
              Sign out
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
}
