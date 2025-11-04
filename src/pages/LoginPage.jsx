import React, { useState } from "react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 h-full w-full" />

      {/* Main container */}
      <div className="relative min-h-screen sm:flex sm:flex-row justify-center bg-transparent">
        {/* Left content */}
        <div className="flex-col flex self-center lg:px-14 sm:max-w-4xl xl:max-w-md z-10">
          <div className="self-start hidden lg:flex flex-col text-gray-200">
            <h1 className="my-3 font-semibold text-4xl text-white">
              Welcome back
            </h1>
            <p className="pr-3 text-sm text-gray-400">
              Lorem ipsum is placeholder text commonly used in the graphic,
              print, and publishing industries for previewing layouts and visual
              mockups.
            </p>
          </div>
        </div>

        {/* Right card */}
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

            <div className="space-y-6">
              {/* Email */}
              <div>
                <input
                  className="w-full text-sm px-4 py-3 bg-gray-100 focus:bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 text-gray-800"
                  type="email"
                  placeholder="Email"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  className="text-sm text-gray-800 px-4 py-3 rounded-lg w-full bg-gray-100 focus:bg-gray-50 border border-gray-300 focus:outline-none focus:border-gray-500"
                />
                <div className="flex items-center absolute inset-y-0 right-0 mr-3 text-sm leading-5">
                  {/* Lock closed */}
                  <svg
                    onClick={() => setShowPassword(!showPassword)}
                    className={`h-5 w-5 text-gray-600 cursor-pointer ${
                      showPassword ? "hidden" : "block"
                    }`}
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2a5 5 0 00-5 5v3H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V12a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm-3 8V7a3 3 0 016 0v3H9z" />
                  </svg>

                  {/* Lock open */}
                  <svg
                    onClick={() => setShowPassword(!showPassword)}
                    className={`h-5 w-5 text-gray-600 cursor-pointer ${
                      showPassword ? "block" : "hidden"
                    }`}
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18 8h-1V6a5 5 0 00-9.9-1.001A1 1 0 008.1 6a3 3 0 016 0v2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V10a2 2 0 00-2-2zM12 17a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
                  </svg>
                </div>
              </div>

              {/* Forgot password */}
              <div className="flex items-center justify-between">
                <div className="text-sm ml-auto">
                  <a
                    href="#"
                    className="text-gray-600 hover:text-black underline"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>

              {/* Sign in button */}
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center bg-gray-900 hover:bg-black text-white p-3 rounded-lg tracking-wide font-semibold cursor-pointer transition ease-in duration-500"
                >
                  Sign in
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center justify-center space-x-2 my-5">
                <span className="h-px w-16 bg-gray-200" />
                <span className="text-gray-400 font-normal">or</span>
                <span className="h-px w-16 bg-gray-200" />
              </div>

              {/* Social buttons */}
              <div className="flex justify-center gap-5 w-full">
                {/* Google */}
                <button
                  type="button"
                  className="w-full flex items-center justify-center mb-6 md:mb-0 border border-gray-300 hover:border-gray-900 hover:bg-gray-900 text-sm text-gray-500 p-3 rounded-lg tracking-wide font-medium cursor-pointer transition ease-in duration-500"
                >
                  <svg
                    className="w-4 mr-2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="#EA4335"
                      d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
                    />
                    <path
                      fill="#34A853"
                      d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"
                    />
                    <path
                      fill="#4A90E2"
                      d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"
                    />
                  </svg>
                  <span>Google</span>
                </button>

                {/* Facebook */}
                <button
                  type="button"
                  className="w-full flex items-center justify-center mb-6 md:mb-0 border border-gray-300 hover:border-gray-900 hover:bg-gray-900 text-sm text-gray-500 p-3 rounded-lg tracking-wide font-medium cursor-pointer transition ease-in duration-500"
                >
                  <svg
                    className="w-4 mr-2"
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g>
                      <path
                        d="M50 2.5c-58.892 1.725-64.898 84.363-7.46 95h14.92c57.451-10.647 51.419-93.281-7.46-95z"
                        fill="#1877f2"
                      />
                      <path
                        d="M57.46 64.104h11.125l2.117-13.814H57.46v-8.965c0-3.779 1.85-7.463 7.781-7.463h6.021V22.101c-12.894-2.323-28.385-1.616-28.722 17.66V50.29H30.417v13.814H42.54V97.5h14.92V64.104z"
                        fill="#f1f1f1"
                      />
                    </g>
                  </svg>
                  <span>Facebook</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave (gray tone) */}
      <svg
        className="absolute bottom-[-40px] left-0 z-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
      >
        <path
          fill="#f8f9fa"
          fillOpacity="1"
          d="M0,0L40,42.7C80,85,160,171,240,197.3C320,224,400,192,480,154.7C560,117,640,75,720,74.7C800,75,880,117,960,154.7C1040,192,1120,224,1200,213.3C1280,203,1360,149,1400,122.7L1440,96L1440,320L0,320Z"
        />
      </svg>
    </div>
  );
};

export default LoginPage;
