import React, { useState } from "react";
import API_URL from "@/config/api";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // HANDLE LOGIN
  // =========================================================
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/authentication/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // handle error response
      if (!response.ok) {
        const err = await response.json();
        setError(err.message || "Email hoặc mật khẩu không đúng");
        setLoading(false);
        return;
      }

      const data = await response.json();

      // =========================================================
      // SAVE TOKEN
      // =========================================================
      localStorage.setItem("access_token", data.data.accessToken);

      // Nếu API trả về các thông tin khác → lưu luôn
      if (data.email) localStorage.setItem("email", data.email);
      if (data.role) localStorage.setItem("role", data.role);
      if (data.userId) localStorage.setItem("userId", data.userId);

      alert("Đăng nhập thành công!");

      // Redirect
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 h-full w-full" />

      <div className="relative min-h-screen sm:flex sm:flex-row justify-center bg-transparent">
        <div className="flex-col flex self-center lg:px-14 sm:max-w-4xl xl:max-w-md z-10">
          <div className="self-start hidden lg:flex flex-col text-gray-200">
            <h1 className="my-3 font-semibold text-4xl text-white">
              Welcome back
            </h1>
            <p className="pr-3 text-sm text-gray-400">
              Welcome to the Marking System. This platform provides a reliable
              environment for assessing submissions, managing grades, and
              ensuring fair evaluation.
            </p>
          </div>
        </div>

        <div className="flex justify-center self-center z-10">
          <div className="p-12 bg-white mx-auto rounded-3xl w-96 shadow-2xl shadow-gray-400/50">
            <div className="mb-7">
              <h3 className="font-semibold text-2xl text-gray-800">Sign In</h3>
              <p className="text-gray-500">
                Don&apos;t have an account?{" "}
                <a
                  href="#"
                  className="text-sm text-gray-700 hover:text-black underline"
                >
                  Sign Up
                </a>
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              {/* Email */}
              <input
                className="w-full text-sm px-4 py-3 bg-gray-100 focus:bg-gray-50 border border-gray-300 rounded-lg"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {/* Password */}
              <div className="relative">
                <input
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  className="text-sm px-4 py-3 rounded-lg w-full bg-gray-100 border border-gray-300 focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <div
                  className="absolute inset-y-0 right-0 mr-3 flex items-center text-gray-600 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 5c-7.633 0-11.084 6.751-11.2 6.985a1 1 0 0 0 0 .994C.916 13.249 4.367 20 12 20s11.084-6.751 11.2-6.985a1 1 0 0 0 0-.994C23.084 11.751 19.633 5 12 5zm0 13c-5.539 0-8.567-4.73-9.157-6 .59-1.27 3.618-6 9.157-6 5.539 0 8.567 4.73 9.157 6-.59 1.27-3.618 6-9.157 6z" />
                      <path d="M12 9a3 3 0 1 0 .002 6.002A3 3 0 0 0 12 9z" />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 5c-7.633 0-11.084 6.751-11.2 6.985a1 1 0 0 0 0 .994C.916 13.249 4.367 20 12 20s11.084-6.751 11.2-6.985a1 1 0 0 0 0-.994C23.084 11.751 19.633 5 12 5zm0 13c-5.539 0-8.567-4.73-9.157-6 .59-1.27 3.618-6 9.157-6 5.539 0 8.567 4.73 9.157 6-.59 1.27-3.618 6-9.157 6z" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Sign in button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg font-semibold"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
