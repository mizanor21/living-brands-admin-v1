"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import logo from "@/public/assets/logo/logo.png";
import Image from "next/image";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state for spinner
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true); // Start loading when login is initiated
    try {
      const res = await axios.post("/api/login", { email, password });
      localStorage.setItem("token", res.data.token);
      router.push("/dashboard");
    } catch (error) {
      setError(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false); // Stop loading after login process is complete
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gradient-to-br p-4">
      <div className="flex rounded-xl overflow-hidden shadow-lg backdrop-blur-md bg-white/10 border border-white/20">
        {/* Left Section - Illustration with Brand Color */}
        <div className="hidden text-[#135c5d] lg:flex w-full lg:w-1/2 flex-col items-center justify-center bg-opacity-60 p-10">
          <Image
            src={logo}
            alt="Welcome Illustration"
            width={200}
            height={200}
            className=""
          />
          <h2 className="text-4xl font-extrabold my-2">Welcome Back!</h2>
          <p className="text-center text-lg">
            Log in to access your account and stay connected.
          </p>
        </div>

        {/* Right Section - Glassmorphic Login Form */}
        <div className="flex w-full lg:w-1/2 items-center justify-center p-10">
          <form
            onSubmit={handleLogin}
            className="w-full max-w-md p-8 bg-white/20 rounded-2xl shadow-md backdrop-blur-xl border-white/30 space-y-6"
          >
            <h2 className="text-3xl font-semibold text-[#135c5d] text-center">
              Sign In
            </h2>
            {error && (
              <div className="text-center text-red-500 text-sm">{error}</div>
            )}
            <div>
              <label
                className="block text-gray-300 font-medium mb-1"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-white/40 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#135c5d] border-gray-300 placeholder-gray-400 text-gray-900"
              />
            </div>
            <div>
              <label
                className="block text-gray-300 font-medium mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-white/40 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#135c5d] border-gray-300 placeholder-gray-400 text-gray-900"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 text-lg font-semibold text-white bg-[#135c5d] rounded-lg hover:bg-[#104d4e] focus:outline-none focus:ring-4 focus:ring-[#135c5d] transition-transform transform hover:scale-105 flex items-center justify-center"
              disabled={loading} // Disable button when loading
            >
              {loading ? (
                <svg
                  className="w-5 h-5 mr-2 text-white animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
              ) : null}
              {loading ? "Logging in..." : "Login"}
            </button>
            <div className="text-center text-gray-300 text-sm">
              User login panel.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
