import React, { useState } from "react";

const AuthPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const dataToSend = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }

      console.log("Login successful:", result);

      // Handle successful login (example):
      // localStorage.setItem("token", result.token);
      // window.location.href = "/dashboard";

    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Could not connect to the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
          backgroundBlendMode: "soft-light",
        }}
      ></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold">
            <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
              Isosofts
            </span>
          </h1>
          <p className="text-gray-600 mt-3 text-lg">
            Login to Your Account
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl border border-blue-100/60 overflow-hidden">
          <div className="p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-gray-50/40"
                  placeholder="example@isosofts.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-gray-50/40"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-4 rounded-xl font-medium text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl mt-2
                  ${loading ? "opacity-70 cursor-not-allowed" : "hover:from-blue-600 hover:to-blue-800"}`}
              >
                {loading ? "Processing..." : "Login"}
              </button>
            </form>

            <div className="mt-10">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    If you have trouble logging in, please contact your Line Manager
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          © 2025 Isosofts. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

const globalStyles = `
  .rounded-xl {
    border-radius: 1rem !important;
  }
  input:focus {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
`;

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = globalStyles;
  document.head.appendChild(style);
}

export default AuthPage;