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
      localStorage.setItem("refresh_token", data.data.refreshToken);
      localStorage.setItem("token_exp", data.data.accessTokenExpiryTime);
      localStorage.setItem("refresh_exp", data.data.refreshTokenExpiryTime);

      localStorage.setItem("userId", String(data.data.userid));
      localStorage.setItem("username", data.data.username);
      localStorage.setItem("role", data.data.role);

      // Nếu API trả về các thông tin khác → lưu luôn
      const payload = data.data || {};
      if (payload.email) localStorage.setItem("email", payload.email);
      if (payload.role) localStorage.setItem("role", payload.role);
      if (payload.userid !== undefined)
        localStorage.setItem("userId", String(payload.userid));
      if (payload.username) localStorage.setItem("username", payload.username);

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
      {/* ==== WAVE BACKGROUND ==== */}
      <div className="absolute inset-0 -z-10">
        <svg
          className="absolute bottom-0 w-full h-auto opacity-80"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#1f2937"
            d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,165.3C672,160,768,96,864,80C960,64,1056,96,1152,101.3C1248,107,1344,85,1392,74.7L1440,64L1440,0L1392,0C1344,0,
        1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
        </svg>

        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700"></div>
      </div>

      {/* ==== LAYOUT ==== */}
      <div className="relative min-h-screen sm:flex sm:flex-row justify-center">
        {/* left text */}
        <div className="flex-col flex self-center lg:px-14 sm:max-w-4xl xl:max-w-md z-10">
          <div className="self-start hidden lg:flex flex-col text-gray-200">
            <h1 className="my-3 font-semibold text-4xl text-white">
              Welcome back
            </h1>
            <p className="pr-3 text-sm text-gray-300">
              Welcome to the Marking System. This platform provides a reliable
              environment for assessing submissions, managing grades, and
              ensuring fair evaluation.
            </p>
          </div>
        </div>

        {/* login card */}
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

            {/* form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <input
                className="w-full text-sm px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="relative">
                <input
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  className="text-sm px-4 py-3 rounded-lg w-full bg-gray-100 border border-gray-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <div
                  className="absolute inset-y-0 right-0 mr-3 flex items-center text-gray-600 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </div>
              </div>

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
      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none -z-0">
        <svg
          className="relative block w-[200%] h-48"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="
        M321.39,56.44
        C186.81,78.67,96.43,68.13,0,0
        V120H1200V0
        C1034.65,80.71,896.36,85.72,703.36,66.69
        556.97,52.59,476.24,31.79,321.39,56.44Z"
            className="fill-gray-100"
          />
        </svg>
      </div>
    </div>
  );
};

export default LoginPage;
